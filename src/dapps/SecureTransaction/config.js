const CoralConfig = {
  gasLimitSuggestion: 300000,
  chainID: 1,
  chainIDEnglish: 'mainnet',
  safeSendEscrowContractAddress: '0xdfA32A517D26a193321277Ef1b486c68cfA58aEA',
  safeSendEscrowContractAbi: [
    {
      constant: false,
      inputs: [
        {
          name: '_itemIds',
          type: 'bytes32[]'
        },
        {
          name: '_relay',
          type: 'bool'
        }
      ],
      name: 'batchDeliver',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_itemId',
          type: 'bytes32'
        },
        {
          name: '_relay',
          type: 'bool'
        }
      ],
      name: 'deliver',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_recipient',
          type: 'address'
        },
        {
          name: '_threshold',
          type: 'uint8'
        }
      ],
      name: 'deposit',
      outputs: [
        {
          name: '_id',
          type: 'bytes32'
        }
      ],
      payable: true,
      stateMutability: 'payable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'pauseDeposits',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_tokenAddress',
          type: 'address'
        },
        {
          name: '_recipient',
          type: 'address'
        },
        {
          name: '_amount',
          type: 'uint256'
        }
      ],
      name: 'rescueOrphanedTokens',
      outputs: [
        {
          name: '_success',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'unpauseDeposits',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_newFeeRate',
          type: 'uint256'
        }
      ],
      name: 'updateFeeRate',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_newMaxFee',
          type: 'uint256'
        }
      ],
      name: 'updateMaximumFee',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_newMinFee',
          type: 'uint256'
        }
      ],
      name: 'updateMinimumFee',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_profitThreshold',
          type: 'uint256'
        },
        {
          name: '_partner',
          type: 'bool'
        }
      ],
      name: 'updateProfitThreshold',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_itemId',
          type: 'bytes32'
        }
      ],
      name: 'withdraw',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          name: '_provider',
          type: 'address'
        },
        {
          name: '_partner',
          type: 'address'
        },
        {
          name: '_margin',
          type: 'uint256'
        },
        {
          name: '_minFeeInWei',
          type: 'uint256'
        },
        {
          name: '_maxFeeInWei',
          type: 'uint256'
        },
        {
          name: '_feeRate',
          type: 'uint256'
        },
        {
          name: '_distributionThreshold',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor'
    },
    {
      payable: true,
      stateMutability: 'payable',
      type: 'fallback'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_id',
          type: 'bytes32'
        }
      ],
      name: 'LogItemDeposit',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_id',
          type: 'bytes32'
        }
      ],
      name: 'LogItemWithdrawal',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_id',
          type: 'bytes32'
        }
      ],
      name: 'LogItemDeliver',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_minFee',
          type: 'uint256'
        },
        {
          indexed: false,
          name: '_time',
          type: 'uint256'
        }
      ],
      name: 'LogMinimumFeeUpdated',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_maxFee',
          type: 'uint256'
        },
        {
          indexed: false,
          name: '_time',
          type: 'uint256'
        }
      ],
      name: 'LogMaximumFeeUpdated',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_feeRate',
          type: 'uint256'
        },
        {
          indexed: false,
          name: '_time',
          type: 'uint256'
        }
      ],
      name: 'LogFeeRateUpdated',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_time',
          type: 'uint256'
        }
      ],
      name: 'LogDepositsPaused',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_time',
          type: 'uint256'
        }
      ],
      name: 'LogDepositsUnpaused',
      type: 'event'
    },
    {
      constant: true,
      inputs: [],
      name: 'active',
      outputs: [
        {
          name: '',
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
          name: '_amount',
          type: 'uint256'
        }
      ],
      name: 'checkFee',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'feeRate',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'getCurrentProfit',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'getItemCount',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'getMargin',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'getProfitThreshold',
      outputs: [
        {
          name: '',
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
          name: '_itemId',
          type: 'bytes32'
        }
      ],
      name: 'isProcessing',
      outputs: [
        {
          name: '',
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
      name: 'maxFeeInWei',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'MIN_FEE',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'MIN_GAS_DELIVER',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'MIN_GAS_DEPOSIT',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'MIN_GAS_WITHDRAWAL',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'minFeeInWei',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'partner',
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
      constant: true,
      inputs: [],
      name: 'provider',
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
      constant: true,
      inputs: [],
      name: 'recoverer',
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
      constant: true,
      inputs: [
        {
          name: '_itemId',
          type: 'bytes32'
        }
      ],
      name: 'viewItem',
      outputs: [
        {
          name: '',
          type: 'address'
        },
        {
          name: '',
          type: 'address'
        },
        {
          name: '',
          type: 'uint256'
        },
        {
          name: '',
          type: 'uint8'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    }
  ]
};

export { CoralConfig };
