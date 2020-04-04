const ABI = [
  {
    inputs: [
      {
        internalType: 'address payable',
        name: '_beneficiary',
        type: 'address'
      },
      {
        internalType: 'address payable',
        name: '_dexag',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_basisPoints',
        type: 'uint256'
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
        internalType: 'uint256',
        name: 'newBasisPoints',
        type: 'uint256'
      }
    ],
    name: 'BasisPointsSet',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newBeneficiary',
        type: 'address'
      }
    ],
    name: 'BeneficiarySet',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newDexag',
        type: 'address'
      }
    ],
    name: 'DexagSet',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'toAmount',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'trader',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'exchanges',
        type: 'address[]'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tradeType',
        type: 'uint256'
      }
    ],
    name: 'Trade',
    type: 'event'
  },
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback'
  },
  {
    constant: true,
    inputs: [],
    name: 'WETH',
    outputs: [
      {
        internalType: 'contract IWETH',
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
    name: 'approvalHandler',
    outputs: [
      {
        internalType: 'contract ApprovalHandler',
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
    name: 'basisPoints',
    outputs: [
      {
        internalType: 'uint256',
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
    name: 'isOwner',
    outputs: [
      {
        internalType: 'bool',
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
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
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
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'contract IERC20',
        name: 'from',
        type: 'address'
      },
      {
        internalType: 'contract IERC20',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'fromAmount',
        type: 'uint256'
      },
      {
        internalType: 'address[]',
        name: 'exchanges',
        type: 'address[]'
      },
      {
        internalType: 'address[]',
        name: 'approvals',
        type: 'address[]'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      },
      {
        internalType: 'uint256[]',
        name: 'offsets',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: 'etherValues',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256',
        name: 'limitAmount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'tradeType',
        type: 'uint256'
      }
    ],
    name: 'trade',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_basisPoints',
        type: 'uint256'
      }
    ],
    name: 'setbasisPoints',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address payable',
        name: '_beneficiary',
        type: 'address'
      }
    ],
    name: 'setBeneficiary',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address payable',
        name: '_dexag',
        type: 'address'
      }
    ],
    name: 'setDexag',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'withdrawWeth',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
];


export default ABI;
