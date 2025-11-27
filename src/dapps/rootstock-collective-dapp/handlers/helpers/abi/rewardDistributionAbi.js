export const RewardDistributorAbi = [
  {
    type: 'constructor',
    inputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'receive',
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'UPGRADE_INTERFACE_VERSION',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'backersManager',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract BackersManagerRootstockCollective'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'defaultNativeAmount',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'defaultRifAmount',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'defaultUsdrifAmount',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'governanceManager',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IGovernanceManagerRootstockCollective'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [
      {
        name: 'governanceManager_',
        type: 'address',
        internalType: 'contract IGovernanceManagerRootstockCollective'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'initializeCollectiveRewardsAddresses',
    inputs: [
      {
        name: 'backersManager_',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'initializeV3',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'lastFundedCycleStart',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'proxiableUUID',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'rifToken',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IERC20'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'sendRewards',
    inputs: [
      {
        name: 'amountRif_',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'amountUsdrif_',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'amountNative_',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'sendRewardsAndStartDistribution',
    inputs: [
      {
        name: 'amountRif_',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'amountUsdrif_',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'amountNative_',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'sendRewardsAndStartDistributionWithDefaultAmount',
    inputs: [],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'sendRewardsWithDefaultAmount',
    inputs: [],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'setDefaultRewardAmount',
    inputs: [
      {
        name: 'rifTokenAmount_',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'usdrifTokenAmount_',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'nativeAmount_',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'upgradeToAndCall',
    inputs: [
      {
        name: 'newImplementation',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'data',
        type: 'bytes',
        internalType: 'bytes'
      }
    ],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'usdrifToken',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IERC20'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'event',
    name: 'DefaultRewardAmountsUpdated',
    inputs: [
      {
        name: 'rifAmount_',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      },
      {
        name: 'usdrifAmount_',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      },
      {
        name: 'nativeAmount_',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Initialized',
    inputs: [
      {
        name: 'version',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Upgraded',
    inputs: [
      {
        name: 'implementation',
        type: 'address',
        indexed: true,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'error',
    name: 'AddressEmptyCode',
    inputs: [
      {
        name: 'target',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'CollectiveRewardsAddressesAlreadyInitialized',
    inputs: []
  },
  {
    type: 'error',
    name: 'CollectiveRewardsAddressesNotInitialized',
    inputs: []
  },
  {
    type: 'error',
    name: 'CycleAlreadyFunded',
    inputs: []
  },
  {
    type: 'error',
    name: 'ERC1967InvalidImplementation',
    inputs: [
      {
        name: 'implementation',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'ERC1967NonPayable',
    inputs: []
  },
  {
    type: 'error',
    name: 'FailedCall',
    inputs: []
  },
  {
    type: 'error',
    name: 'InvalidInitialization',
    inputs: []
  },
  {
    type: 'error',
    name: 'NotFoundationTreasury',
    inputs: []
  },
  {
    type: 'error',
    name: 'NotInitializing',
    inputs: []
  },
  {
    type: 'error',
    name: 'UUPSUnauthorizedCallContext',
    inputs: []
  },
  {
    type: 'error',
    name: 'UUPSUnsupportedProxiableUUID',
    inputs: [
      {
        name: 'slot',
        type: 'bytes32',
        internalType: 'bytes32'
      }
    ]
  },
  {
    type: 'error',
    name: 'UsdrifTokenAlreadyInitialized',
    inputs: []
  }
];
