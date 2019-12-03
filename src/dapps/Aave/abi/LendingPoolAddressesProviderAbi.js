export default [
  {
    constant: true,
    inputs: [
      {
        name: '_key',
        type: 'bytes32'
      }
    ],
    name: 'getAddress',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'newAddress',
        type: 'address'
      }
    ],
    name: 'LendingPoolUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'newAddress',
        type: 'address'
      }
    ],
    name: 'LendingPoolCoreUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'newAddress',
        type: 'address'
      }
    ],
    name: 'LendingPoolParametersProviderUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'newAddress',
        type: 'address'
      }
    ],
    name: 'LendingPoolManagerUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'newAddress',
        type: 'address'
      }
    ],
    name: 'LendingPoolConfiguratorUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'newAddress',
        type: 'address'
      }
    ],
    name: 'LendingPoolLiquidationManagerUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'newAddress',
        type: 'address'
      }
    ],
    name: 'LendingPoolDataProviderUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'newAddress',
        type: 'address'
      }
    ],
    name: 'LendingPoolNetworkMetadataProviderUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'newAddress',
        type: 'address'
      }
    ],
    name: 'PriceOracleUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'newAddress',
        type: 'address'
      }
    ],
    name: 'LendingRateOracleUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'newAddress',
        type: 'address'
      }
    ],
    name: 'FeeProviderUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'newAddress',
        type: 'address'
      }
    ],
    name: 'InterestRrateStrategyUpdated',
    type: 'event'
  },
  {
    constant: true,
    inputs: [],
    name: 'getLendingPool',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_pool',
        type: 'address'
      }
    ],
    name: 'setLendingPool',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getInterestRateStrategy',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_strategy',
        type: 'address'
      }
    ],
    name: 'setInterestRateStrategy',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getLendingPoolCore',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_lendingPoolCore',
        type: 'address'
      }
    ],
    name: 'setLendingPoolCore',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getLendingPoolConfigurator',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_configurator',
        type: 'address'
      }
    ],
    name: 'setLendingPoolConfigurator',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getLendingPoolManager',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_lendingPoolManager',
        type: 'address'
      }
    ],
    name: 'setLendingPoolManager',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getLendingPoolDataProvider',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_provider',
        type: 'address'
      }
    ],
    name: 'setLendingPoolDataProvider',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getNetworkMetadataProvider',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_networkMetadataProvider',
        type: 'address'
      }
    ],
    name: 'setNetworkMetadataProvider',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getLendingPoolParametersProvider',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_parametersProvider',
        type: 'address'
      }
    ],
    name: 'setLendingPoolParametersProvider',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getPriceOracle',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_priceOracle',
        type: 'address'
      }
    ],
    name: 'setPriceOracle',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getLendingRateOracle',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_lendingRateOracle',
        type: 'address'
      }
    ],
    name: 'setLendingRateOracle',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getFeeProvider',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_feeProvider',
        type: 'address'
      }
    ],
    name: 'setFeeProvider',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getLendingPoolLiquidationManager',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_manager',
        type: 'address'
      }
    ],
    name: 'setLendingPoolLiquidationManager',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
