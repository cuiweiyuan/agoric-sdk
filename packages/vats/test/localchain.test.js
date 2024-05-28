// @ts-check
import { test as anyTest } from '@agoric/swingset-vat/tools/prepare-test-env-ava.js';

import { NonNullish } from '@agoric/assert';
import { AmountMath, AssetKind, makeIssuerKit } from '@agoric/ertp';
import { reincarnate } from '@agoric/swingset-liveslots/tools/setup-vat-data.js';
import { withAmountUtils } from '@agoric/zoe/tools/test-utils.js';
import { makeDurableZone } from '@agoric/zone/durable.js';
import { E } from '@endo/far';
import { getInterfaceOf } from '@endo/marshal';
import { prepareLocalChainTools } from '../src/localchain.js';
import { makeFakeBankManagerKit } from '../tools/bank-utils.js';
import {
  LOCALCHAIN_DEFAULT_ADDRESS,
  makeFakeLocalchainBridge,
} from '../tools/fake-bridge.js';

/**
 * @import {LocalChainAccount, LocalChainPowers} from '../src/localchain.js';
 * @import {BridgeHandler, ScopedBridgeManager} from '../src/types.js';
 */

/** @type {import('ava').TestFn<Awaited<ReturnType<makeTestContext>>>} */
const test = anyTest;

const { fakeVomKit } = reincarnate({ relaxDurabilityRules: false });
const provideBaggage = key => {
  const root = fakeVomKit.cm.provideBaggage();
  const zone = makeDurableZone(root);
  return zone.mapStore(`${key} baggage`);
};

const makeTestContext = async _t => {
  const issuerKits = ['BLD', 'BEAN'].map(x =>
    makeIssuerKit(x, AssetKind.NAT, harden({ decimalPlaces: 6 })),
  );
  const [bld, bean] = issuerKits.map(withAmountUtils);

  const localchainBridge = makeFakeLocalchainBridge(
    makeDurableZone(provideBaggage('localchain')),
  );

  const { bankManager, pourPayment } = await makeFakeBankManagerKit({
    balances: {
      // agoric1fakeBridgeAddress: { ubld: bld.units(100).value },
    },
  });

  /** @param {LocalChainPowers} powers */
  const makeLocalChain = async powers => {
    const zone = makeDurableZone(provideBaggage('localchain'));
    return prepareLocalChainTools(zone).makeLocalChain(powers);
  };

  const localchain = await makeLocalChain({
    system: localchainBridge,
    bankManager,
  });

  return {
    bld,
    bean,
    bankManager,
    issuerKits,
    localchain,
    pourPayment,
  };
};

test.beforeEach(async t => {
  t.context = await makeTestContext(t);
});

test('localchain - deposit and withdraw', async t => {
  const { bld, bean, pourPayment } = t.context;

  const boot = async () => {
    const { bankManager } = await t.context;
    await t.notThrowsAsync(
      E(bankManager).addAsset('ubld', 'BLD', 'Staking Token', bld.issuerKit),
    );
  };
  await boot();

  const makeContract = async () => {
    const { localchain } = t.context;
    /** @type {LocalChainAccount | undefined} */
    let contractsLca;

    return {
      makeAccount: async () => {
        const lca = await E(localchain).makeAccount();
        t.is(getInterfaceOf(lca), 'Alleged: LocalChainAccount');

        const address = await E(lca).getAddress();
        t.is(address, LOCALCHAIN_DEFAULT_ADDRESS);
        contractsLca = lca;
      },
      deposit: async () => {
        assert(contractsLca, 'first makeAccount');
        t.deepEqual(
          await E(contractsLca).getBalance(bld.brand),
          bld.makeEmpty(),
        );

        const fiftyBldAmt = bld.units(50);
        const res = await E(contractsLca).deposit(
          await pourPayment(fiftyBldAmt),
        );
        t.true(AmountMath.isEqual(res, fiftyBldAmt));
        const payment2 = await pourPayment(fiftyBldAmt);
        // TODO check optAmountShape after https://github.com/Agoric/agoric-sdk/issues/9407
        // await t.throwsAsync(
        //   () =>
        //     E(NonNullish(contractsLca)).deposit(payment2, {
        //       brand: bld.brand,
        //       value: M.record(),
        //     }),
        //   {
        //     message: /amount(.+) Must be a copyRecord/,
        //   },
        // );
        await E(contractsLca).deposit(payment2);
        t.deepEqual(
          await E(contractsLca).getBalance(bld.brand),
          bld.units(100),
        );
      },
      withdraw: async () => {
        assert(contractsLca, 'first makeAccount');
        const oneHundredBldAmt = bld.units(100);
        const oneHundredBeanAmt = bean.units(100);
        t.deepEqual(
          await E(contractsLca).getBalance(bld.brand),
          bld.units(100),
        );
        const payment = await E(contractsLca).withdraw(oneHundredBldAmt);
        t.deepEqual(await E(contractsLca).getBalance(bld.brand), bld.units(0));
        const paymentAmount = await E(bld.issuer).getAmountOf(payment);
        t.true(AmountMath.isEqual(paymentAmount, oneHundredBldAmt));

        await t.throwsAsync(
          () => E(NonNullish(contractsLca)).withdraw(oneHundredBldAmt),
          // fake bank is has different error messages than production
        );

        await t.throwsAsync(
          () => E(NonNullish(contractsLca)).withdraw(oneHundredBeanAmt),
          {
            message: /not found in collection "brandToAssetRecord"/,
          },
        );
      },
    };
  };

  const anOrchestrationContract = await makeContract();
  await anOrchestrationContract.makeAccount();

  await anOrchestrationContract.deposit();
  await anOrchestrationContract.withdraw();
});