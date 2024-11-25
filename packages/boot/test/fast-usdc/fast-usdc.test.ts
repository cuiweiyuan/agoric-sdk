import { test as anyTest } from '@agoric/zoe/tools/prepare-test-env-ava.js';

import type { TestFn } from 'ava';
import type { FastUSDCKit } from '@agoric/fast-usdc/src/fast-usdc.start.js';
import { documentStorageSchema } from '@agoric/governance/tools/storageDoc.js';
import { Fail } from '@endo/errors';
import { unmarshalFromVstorage } from '@agoric/internal/src/marshal.js';
import { makeMarshal } from '@endo/marshal';
import {
  makeWalletFactoryContext,
  type WalletFactoryTestContext,
} from '../bootstrapTests/walletFactory.js';

const test: TestFn<WalletFactoryTestContext> = anyTest;

test.before('bootstrap', async t => {
  const config = '@agoric/vm-config/decentral-itest-orchestration-config.json';
  t.context = await makeWalletFactoryContext(t, config);
});
test.after.always(t => t.context.shutdown?.());

test.serial('oracles provision before contract deployment', async t => {
  const { walletFactoryDriver: wd } = t.context;
  const watcherWallet = await wd.provideSmartWallet('agoric1watcher1');
  t.truthy(watcherWallet);
});

test.serial(
  'contract starts; adds to agoricNames; sends invitation',
  async t => {
    const {
      agoricNamesRemotes,
      evalProposal,
      buildProposal,
      refreshAgoricNamesRemotes,
      storage,
      walletFactoryDriver: wd,
    } = t.context;

    const [watcherWallet] = await Promise.all([
      wd.provideSmartWallet('agoric144rrhh4m09mh7aaffhm6xy223ym76gve2x7y78'),
      wd.provideSmartWallet('agoric19d6gnr9fyp6hev4tlrg87zjrzsd5gzr5qlfq2p'),
      wd.provideSmartWallet('agoric19uscwxdac6cf6z7d5e26e0jm0lgwstc47cpll8'),
      wd.provideSmartWallet('agoric1krunjcqfrf7la48zrvdfeeqtls5r00ep68mzkr'),
      wd.provideSmartWallet('agoric1n4fcxsnkxe4gj6e24naec99hzmc4pjfdccy5nj'),
    ]);

    const materials = buildProposal(
      '@agoric/builders/scripts/fast-usdc/init-fast-usdc.js',
      ['--net', 'MAINNET'],
    );
    await evalProposal(materials);

    // update now that fastUsdc is instantiated
    refreshAgoricNamesRemotes();
    t.truthy(agoricNamesRemotes.instance.fastUsdc);
    t.truthy(agoricNamesRemotes.brand.FastLP);

    const { EV } = t.context.runUtils;
    const agoricNames = await EV.vat('bootstrap').consumeItem('agoricNames');
    const board = await EV.vat('bootstrap').consumeItem('board');
    const getBoardAux = async name => {
      const brand = await EV(agoricNames).lookup('brand', name);
      const id = await EV(board).getId(brand);
      t.truthy(storage.data.get(`published.boardAux.${id}`));
      return unmarshalFromVstorage(
        storage.data,
        `published.boardAux.${id}`,
        makeMarshal().fromCapData,
        -1,
      );
    };
    t.like(
      await getBoardAux('FastLP'),
      {
        allegedName: 'PoolShares', // misnomer, in some contexts
        displayInfo: {
          assetKind: 'nat',
          decimalPlaces: 6,
        },
      },
      'brand displayInfo available in boardAux',
    );

    const current = watcherWallet.getCurrentWalletRecord();

    // XXX We should be able to compare objects by identity like this:
    //
    // const invitationPurse = current.purses.find(
    //   p => p.brand === agoricNamesRemotes.brand.Invitation,
    // );
    //
    // But agoricNamesRemotes and walletFactoryDriver
    // don't share a marshal context.
    // We should be able to map between them using
    // const walletStuff = w.fromCapData(a.toCapData(aStuff))
    // but the marshallers don't even preserve identity within themselves.

    current.purses.length === 1 || Fail`test limited to 1 purse`;
    const [thePurse] = current.purses;
    const details = thePurse.balance.value as Array<any>;
    Array.isArray(details) || Fail`expected SET value`;
    t.is(details.length, 1, 'oracle wallet has 1 invitation');
    t.is(details[0].description, 'oracle operator invitation');
    // XXX t.is(details.instance, agoricNames.instance.fastUsdc) should work
  },
);

test.serial('writes feed policy to vstorage', async t => {
  const { storage } = t.context;
  const doc = {
    node: 'fastUsdc.feedPolicy',
    owner: 'the general and chain-specific policies for the Fast USDC feed',
  };
  await documentStorageSchema(t, storage, doc);
});

test.serial('restart contract', async t => {
  const { EV } = t.context.runUtils;
  await null;
  const kit = await EV.vat('bootstrap').consumeItem('fastUsdcKit');
  const actual = await EV(kit.adminFacet).restartContract(kit.privateArgs);
  t.deepEqual(actual, { incarnationNumber: 1 });
});