import { assert, details as X } from '@agoric/assert';
import { assertKnownOptions } from '../../assertOptions';
import { makeLocalVatManagerFactory } from './manager-local';
import { makeNodeWorkerVatManagerFactory } from './manager-nodeworker';
import { makeNodeSubprocessFactory } from './manager-subprocess-node';
import { makeXsSubprocessFactory } from './manager-subprocess-xsnap';

export function makeVatManagerFactory({
  allVatPowers,
  kernelKeeper,
  vatEndowments,
  meterManager,
  transformMetering,
  makeNodeWorker,
  startSubprocessWorkerNode,
  startXSnap,
  gcTools,
  defaultManagerType,
  kernelSlog,
}) {
  const localFactory = makeLocalVatManagerFactory({
    allVatPowers,
    kernelKeeper,
    vatEndowments,
    meterManager,
    transformMetering,
    gcTools,
    kernelSlog,
  });

  const nodeWorkerFactory = makeNodeWorkerVatManagerFactory({
    makeNodeWorker,
    kernelKeeper,
    kernelSlog,
    testLog: allVatPowers.testLog,
  });

  const nodeSubprocessFactory = makeNodeSubprocessFactory({
    startSubprocessWorker: startSubprocessWorkerNode,
    kernelKeeper,
    kernelSlog,
    testLog: allVatPowers.testLog,
  });

  const xsWorkerFactory = makeXsSubprocessFactory({
    startXSnap,
    kernelKeeper,
    kernelSlog,
    allVatPowers,
    testLog: allVatPowers.testLog,
  });

  function validateManagerOptions(managerOptions) {
    assertKnownOptions(managerOptions, [
      'enablePipelining',
      'managerType',
      'setup',
      'bundle',
      'metered',
      'enableDisavow',
      'enableSetup',
      'liveSlotsConsole',
      'virtualObjectCacheSize',
      'useTranscript',
      'vatParameters',
      'vatConsole',
      'name',
      'compareSyscalls',
    ]);
    const { setup, bundle, enableSetup = false } = managerOptions;
    assert(setup || bundle);
    assert(
      !bundle || typeof bundle === 'object',
      `bundle must be object, not a plain string`,
    );
    // todo maybe useless
    assert(!(setup && !enableSetup), X`setup() provided, but not enabled`);
  }

  // returns promise for new vatManager
  function vatManagerFactory(vatID, managerOptions, vatSyscallHandler) {
    validateManagerOptions(managerOptions);
    const {
      managerType = defaultManagerType,
      setup,
      bundle,
      metered,
      enableSetup,
    } = managerOptions;

    if (metered && managerType !== 'local' && managerType !== 'xs-worker') {
      console.warn(
        `TODO: support metered with ${managerType}; using local as work-around`,
      );
    }
    if (setup && managerType !== 'local') {
      console.warn(
        `TODO: stop using setup() with ${managerType}; using local as work-around`,
      );
    }
    if (managerType === 'local' || enableSetup) {
      if (setup) {
        return localFactory.createFromSetup(
          vatID,
          setup,
          managerOptions,
          vatSyscallHandler,
        );
      }
      return localFactory.createFromBundle(
        vatID,
        bundle,
        managerOptions,
        vatSyscallHandler,
      );
    }

    if (managerType === 'nodeWorker') {
      return nodeWorkerFactory.createFromBundle(
        vatID,
        bundle,
        managerOptions,
        vatSyscallHandler,
      );
    }

    if (managerType === 'node-subprocess') {
      return nodeSubprocessFactory.createFromBundle(
        vatID,
        bundle,
        managerOptions,
        vatSyscallHandler,
      );
    }

    if (managerType === 'xs-worker') {
      return xsWorkerFactory.createFromBundle(
        vatID,
        bundle,
        managerOptions,
        vatSyscallHandler,
      );
    }

    throw Error(
      `unknown type ${managerType}, not local/nodeWorker/node-subprocess`,
    );
  }

  return harden(vatManagerFactory);
}
