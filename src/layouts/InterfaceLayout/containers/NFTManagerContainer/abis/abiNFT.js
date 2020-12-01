export default [
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'tokenAddr',
        type: 'address'
      },
      {
        name: 'addr',
        type: 'address'
      }
    ],
    name: 'getTokenBalance',
    outputs: [
      {
        name: 'bal',
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
        name: 'tokenAddr',
        type: 'address'
      },
      {
        name: 'owner',
        type: 'address'
      },
      {
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [
      {
        name: 'token',
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
        name: 'number',
        type: 'uint256'
      }
    ],
    name: 'getByteSize',
    outputs: [
      {
        name: '',
        type: 'uint8'
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
        name: '_tokenAddresses',
        type: 'address[]'
      },
      {
        name: '_owner',
        type: 'address'
      }
    ],
    name: 'getTokenBalances',
    outputs: [
      {
        name: '',
        type: 'bytes'
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
        name: '_tokenAddress',
        type: 'address'
      },
      {
        name: '_owner',
        type: 'address'
      },
      {
        name: 'idxOffset',
        type: 'uint256'
      },
      {
        name: 'count',
        type: 'uint256'
      }
    ],
    name: 'getOwnedTokens',
    outputs: [
      {
        name: '',
        type: 'bytes'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
];
