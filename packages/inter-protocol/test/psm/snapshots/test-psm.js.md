# Snapshot report for `test/psm/test-psm.js`

The actual snapshot is saved in `test-psm.js.snap`.

Generated by [AVA](https://avajs.dev).

## metrics, with snapshot

> Under "published", the "psm" node is delegated to a tree of PSM contract instances.
> The example below illustrates the schema of the data published there.
> 
> See also board marshalling conventions (_to appear_).

    [
      [
        'published.psm.IST.AUSD.governance',
        {
          current: {
            Electorate: {
              type: 'invitation',
              value: {
                brand: {
                  iface: 'Alleged: Zoe Invitation brand',
                },
                value: [
                  {
                    description: 'questionPoser',
                    handle: {
                      iface: 'Alleged: InvitationHandle',
                    },
                    installation: {
                      iface: 'Alleged: BundleInstallation',
                    },
                    instance: {
                      iface: 'Alleged: InstanceHandle',
                    },
                  },
                ],
              },
            },
            GiveMintedFee: {
              type: 'ratio',
              value: {
                denominator: {
                  brand: {
                    iface: 'Alleged: IST brand',
                  },
                  value: 10000n,
                },
                numerator: {
                  brand: {
                    iface: 'Alleged: IST brand',
                  },
                  value: 3n,
                },
              },
            },
            MintLimit: {
              type: 'amount',
              value: {
                brand: {
                  iface: 'Alleged: IST brand',
                },
                value: 20000000000000n,
              },
            },
            WantMintedFee: {
              type: 'ratio',
              value: {
                denominator: {
                  brand: {
                    iface: 'Alleged: IST brand',
                  },
                  value: 10000n,
                },
                numerator: {
                  brand: {
                    iface: 'Alleged: IST brand',
                  },
                  value: 1n,
                },
              },
            },
          },
        },
      ],
      [
        'published.psm.IST.AUSD.metrics',
        {
          anchorPoolBalance: {
            brand: {
              iface: 'Alleged: aUSD brand',
            },
            value: 100030000n,
          },
          feePoolBalance: {
            brand: {
              iface: 'Alleged: IST brand',
            },
            value: 50000n,
          },
          mintedPoolBalance: {
            brand: {
              iface: 'Alleged: IST brand',
            },
            value: 100030000n,
          },
          totalAnchorProvided: {
            brand: {
              iface: 'Alleged: aUSD brand',
            },
            value: 99970000n,
          },
          totalMintedProvided: {
            brand: {
              iface: 'Alleged: IST brand',
            },
            value: 200000000n,
          },
        },
      ],
    ]