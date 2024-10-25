export default [
  {
    inputs: [
      {
        internalType: 'address payable',
        name: '_beneficiary',
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
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        internalType: 'contract StakeWisePool',
        name: 'swpool',
        type: 'address'
      }
    ],
    name: 'stakeWithPartnerOnBehalf',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        internalType: 'contract StakeWisePool',
        name: 'swpool',
        type: 'address'
      }
    ],
    name: 'stakeWithReferrerOnBehalf',
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
        name: 'ethAmount',
        type: 'uint256'
      },
      {
        internalType: 'address payable',
        name: 'to',
        type: 'address'
      }
    ],
    name: 'withdraw',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenAmount',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'contract ERC20',
        name: 'token',
        type: 'address'
      }
    ],
    name: 'withdrawToken',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
