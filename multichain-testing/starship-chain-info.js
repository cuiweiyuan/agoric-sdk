/** @file Generated by fetch-starship-chain-info.ts */
export default /** @type {const} } */ ({
  agoric: {
    chainId: 'agoriclocal',
    stakingTokens: [
      {
        denom: 'ubld',
      },
    ],
    icqEnabled: false,
    connections: {
      gaialocal: {
        id: 'connection-1',
        client_id: '07-tendermint-1',
        counterparty: {
          client_id: '07-tendermint-1',
          connection_id: 'connection-1',
          prefix: {
            key_prefix: 'FIXME',
          },
        },
        state: 3,
        transferChannel: {
          channelId: 'channel-1',
          portId: 'transfer',
          counterPartyChannelId: 'channel-1',
          counterPartyPortId: 'transfer',
          ordering: 0,
          state: 3,
          version: 'ics20-1',
        },
      },
      osmosislocal: {
        id: 'connection-0',
        client_id: '07-tendermint-0',
        counterparty: {
          client_id: '07-tendermint-1',
          connection_id: 'connection-1',
          prefix: {
            key_prefix: 'FIXME',
          },
        },
        state: 3,
        transferChannel: {
          channelId: 'channel-1',
          portId: 'transfer',
          counterPartyChannelId: 'channel-0',
          counterPartyPortId: 'transfer',
          ordering: 0,
          state: 3,
          version: 'ics20-1',
        },
      },
    },
  },
  cosmoshub: {
    chainId: 'gaialocal',
    stakingTokens: [
      {
        denom: 'uatom',
      },
    ],
    icqEnabled: false,
    connections: {
      agoriclocal: {
        id: 'connection-1',
        client_id: '07-tendermint-1',
        counterparty: {
          client_id: '07-tendermint-1',
          connection_id: 'connection-1',
          prefix: {
            key_prefix: 'FIXME',
          },
        },
        state: 3,
        transferChannel: {
          channelId: 'channel-1',
          portId: 'transfer',
          counterPartyChannelId: 'channel-1',
          counterPartyPortId: 'transfer',
          ordering: 0,
          state: 3,
          version: 'ics20-1',
        },
      },
      osmosislocal: {
        id: 'connection-0',
        client_id: '07-tendermint-0',
        counterparty: {
          client_id: '07-tendermint-0',
          connection_id: 'connection-0',
          prefix: {
            key_prefix: 'FIXME',
          },
        },
        state: 3,
        transferChannel: {
          channelId: 'channel-0',
          portId: 'transfer',
          counterPartyChannelId: 'channel-0',
          counterPartyPortId: 'transfer',
          ordering: 0,
          state: 3,
          version: 'ics20-1',
        },
      },
    },
  },
  osmosis: {
    chainId: 'osmosislocal',
    stakingTokens: [
      {
        denom: 'uosmo',
      },
    ],
    icqEnabled: true,
    connections: {
      agoriclocal: {
        id: 'connection-1',
        client_id: '07-tendermint-1',
        counterparty: {
          client_id: '07-tendermint-0',
          connection_id: 'connection-0',
          prefix: {
            key_prefix: 'FIXME',
          },
        },
        state: 3,
        transferChannel: {
          channelId: 'channel-0',
          portId: 'transfer',
          counterPartyChannelId: 'channel-1',
          counterPartyPortId: 'transfer',
          ordering: 0,
          state: 3,
          version: 'ics20-1',
        },
      },
      gaialocal: {
        id: 'connection-0',
        client_id: '07-tendermint-0',
        counterparty: {
          client_id: '07-tendermint-0',
          connection_id: 'connection-0',
          prefix: {
            key_prefix: 'FIXME',
          },
        },
        state: 3,
        transferChannel: {
          channelId: 'channel-0',
          portId: 'transfer',
          counterPartyChannelId: 'channel-0',
          counterPartyPortId: 'transfer',
          ordering: 0,
          state: 3,
          version: 'ics20-1',
        },
      },
    },
  },
});
