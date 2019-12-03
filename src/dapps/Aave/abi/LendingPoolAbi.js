export default [
  {
    constant: true,
    inputs: [],
    name: 'addressesProvider',
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
    inputs: [
      {
        name: '_addressesProvider',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_reserve',
        type: 'address'
      },
      {
        indexed: true,
        name: '_user',
        type: 'address'
      },
      {
        indexed: false,
        name: '_amount',
        type: 'uint256'
      },
      {
        indexed: true,
        name: '_referral',
        type: 'uint16'
      },
      {
        indexed: false,
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'Deposit',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_reserve',
        type: 'address'
      },
      {
        indexed: true,
        name: '_user',
        type: 'address'
      },
      {
        indexed: false,
        name: '_amount',
        type: 'uint256'
      },
      {
        indexed: false,
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'RedeemUnderlying',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_reserve',
        type: 'address'
      },
      {
        indexed: true,
        name: '_user',
        type: 'address'
      },
      {
        indexed: false,
        name: '_amount',
        type: 'uint256'
      },
      {
        indexed: true,
        name: '_referral',
        type: 'uint16'
      },
      {
        indexed: false,
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'Borrow',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_reserve',
        type: 'address'
      },
      {
        indexed: true,
        name: '_user',
        type: 'address'
      },
      {
        indexed: false,
        name: '_amount',
        type: 'uint256'
      },
      {
        indexed: false,
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'Repay',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_collateral',
        type: 'address'
      },
      {
        indexed: true,
        name: '_user',
        type: 'address'
      },
      {
        indexed: false,
        name: '_amount',
        type: 'uint256'
      },
      {
        indexed: true,
        name: '_reserve',
        type: 'address'
      },
      {
        indexed: false,
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'LiquidationCall',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_reserve',
        type: 'address'
      },
      {
        indexed: true,
        name: '_user',
        type: 'address'
      },
      {
        indexed: false,
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'Swap',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_target',
        type: 'address'
      },
      {
        indexed: true,
        name: '_reserve',
        type: 'address'
      },
      {
        indexed: false,
        name: '_amount',
        type: 'uint256'
      },
      {
        indexed: false,
        name: '_fee',
        type: 'uint256'
      },
      {
        indexed: false,
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'FlashLoan',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_reserve',
        type: 'address'
      },
      {
        indexed: true,
        name: '_user',
        type: 'address'
      }
    ],
    name: 'ReserveUsedAsCollateralEnabled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_reserve',
        type: 'address'
      },
      {
        indexed: true,
        name: '_user',
        type: 'address'
      }
    ],
    name: 'ReserveUsedAsCollateralDisabled',
    type: 'event'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_reserve',
        type: 'address'
      },
      {
        name: '_amount',
        type: 'uint256'
      },
      {
        name: '_referralCode',
        type: 'uint16'
      }
    ],
    name: 'deposit',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_reserve',
        type: 'address'
      },
      {
        name: '_user',
        type: 'address'
      },
      {
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'redeemUnderlying',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_reserve',
        type: 'address'
      },
      {
        name: '_amount',
        type: 'uint256'
      },
      {
        name: '_interestRateMode',
        type: 'uint256'
      },
      {
        name: '_referralCode',
        type: 'uint16'
      }
    ],
    name: 'borrow',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_reserve',
        type: 'address'
      },
      {
        name: '_amount',
        type: 'uint256'
      },
      {
        name: '_onBehalfOf',
        type: 'address'
      }
    ],
    name: 'repay',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_reserve',
        type: 'address'
      }
    ],
    name: 'swapBorrowRateMode',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_reserve',
        type: 'address'
      },
      {
        name: '_user',
        type: 'address'
      }
    ],
    name: 'rebalanceFixedBorrowRate',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_reserve',
        type: 'address'
      },
      {
        name: '_useAsCollateral',
        type: 'bool'
      }
    ],
    name: 'setUserUseReserveAsCollateral',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_collateral',
        type: 'address'
      },
      {
        name: '_reserve',
        type: 'address'
      },
      {
        name: '_user',
        type: 'address'
      },
      {
        name: '_purchaseAmount',
        type: 'uint256'
      },
      {
        name: '_receiveAToken',
        type: 'bool'
      }
    ],
    name: 'liquidationCall',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_receiver',
        type: 'address'
      },
      {
        name: '_reserve',
        type: 'address'
      },
      {
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'flashLoan',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_reserve',
        type: 'address'
      }
    ],
    name: 'getReserveConfigurationData',
    outputs: [
      {
        name: 'ltv',
        type: 'uint256'
      },
      {
        name: 'liquidationThreshold',
        type: 'uint256'
      },
      {
        name: 'liquidationDiscount',
        type: 'uint256'
      },
      {
        name: 'interestRateStrategyAddress',
        type: 'address'
      },
      {
        name: 'usageAsCollateralEnabled',
        type: 'bool'
      },
      {
        name: 'borrowingEnabled',
        type: 'bool'
      },
      {
        name: 'fixedBorrowRateEnabled',
        type: 'bool'
      },
      {
        name: 'isActive',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_reserve',
        type: 'address'
      }
    ],
    name: 'getReserveData',
    outputs: [
      {
        name: 'totalLiquidity',
        type: 'uint256'
      },
      {
        name: 'availableLiquidity',
        type: 'uint256'
      },
      {
        name: 'totalBorrowsFixed',
        type: 'uint256'
      },
      {
        name: 'totalBorrowsVariable',
        type: 'uint256'
      },
      {
        name: 'liquidityRate',
        type: 'uint256'
      },
      {
        name: 'variableBorrowRate',
        type: 'uint256'
      },
      {
        name: 'fixedBorrowRate',
        type: 'uint256'
      },
      {
        name: 'averageFixedBorrowRate',
        type: 'uint256'
      },
      {
        name: 'utilizationRate',
        type: 'uint256'
      },
      {
        name: 'liquidityIndex',
        type: 'uint256'
      },
      {
        name: 'variableBorrowIndex',
        type: 'uint256'
      },
      {
        name: 'aTokenAddress',
        type: 'address'
      },
      {
        name: 'lastUpdateTimestamp',
        type: 'uint40'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_user',
        type: 'address'
      }
    ],
    name: 'getUserAccountData',
    outputs: [
      {
        name: 'totalLiquidityETH',
        type: 'uint256'
      },
      {
        name: 'totalCollateralETH',
        type: 'uint256'
      },
      {
        name: 'totalBorrowsETH',
        type: 'uint256'
      },
      {
        name: 'availableBorrowsETH',
        type: 'uint256'
      },
      {
        name: 'currentLiquidationThreshold',
        type: 'uint256'
      },
      {
        name: 'ltv',
        type: 'uint256'
      },
      {
        name: 'healthFactor',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_reserve',
        type: 'address'
      },
      {
        name: '_user',
        type: 'address'
      }
    ],
    name: 'getUserReserveData',
    outputs: [
      {
        name: 'currentATokenBalance',
        type: 'uint256'
      },
      {
        name: 'currentUnderlyingBalance',
        type: 'uint256'
      },
      {
        name: 'currentBorrowBalance',
        type: 'uint256'
      },
      {
        name: 'principalBorrowBalance',
        type: 'uint256'
      },
      {
        name: 'borrowRateMode',
        type: 'uint256'
      },
      {
        name: 'borrowRate',
        type: 'uint256'
      },
      {
        name: 'liquidityRate',
        type: 'uint256'
      },
      {
        name: 'originationFee',
        type: 'uint256'
      },
      {
        name: 'variableBorrowIndex',
        type: 'uint256'
      },
      {
        name: 'lastUpdateTimestamp',
        type: 'uint256'
      },
      {
        name: 'usageAsCollateralEnabled',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getReserves',
    outputs: [
      {
        name: '',
        type: 'address[]'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
];
