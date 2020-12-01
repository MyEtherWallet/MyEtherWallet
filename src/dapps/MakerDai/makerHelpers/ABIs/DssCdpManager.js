export default [
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'count',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'cdp', type: 'uint256' },
      {
        internalType: 'address',
        name: 'usr',
        type: 'address'
      },
      { internalType: 'uint256', name: 'ok', type: 'uint256' }
    ],
    name: 'cdpAllow',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'bytes32', name: 'ilk', type: 'bytes32' },
      {
        internalType: 'uint256',
        name: 'cdp',
        type: 'uint256'
      },
      { internalType: 'address', name: 'dst', type: 'address' },
      {
        internalType: 'uint256',
        name: 'wad',
        type: 'uint256'
      }
    ],
    name: 'flux',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'cdp', type: 'uint256' },
      {
        internalType: 'address',
        name: 'dst',
        type: 'address'
      }
    ],
    name: 'quit',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'urns',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'ilks',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'vat',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'cdp', type: 'uint256' },
      {
        internalType: 'int256',
        name: 'dink',
        type: 'int256'
      },
      { internalType: 'int256', name: 'dart', type: 'int256' }
    ],
    name: 'frob',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'cdp', type: 'uint256' },
      {
        internalType: 'address',
        name: 'dst',
        type: 'address'
      },
      { internalType: 'int256', name: 'dink', type: 'int256' },
      {
        internalType: 'int256',
        name: 'dart',
        type: 'int256'
      }
    ],
    name: 'frob',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      { internalType: 'address', name: '', type: 'address' }
    ],
    name: 'cdpCan',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'bytes32', name: 'ilk', type: 'bytes32' },
      {
        internalType: 'address',
        name: 'usr',
        type: 'address'
      }
    ],
    name: 'open',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'src', type: 'address' },
      {
        internalType: 'uint256',
        name: 'cdp',
        type: 'uint256'
      }
    ],
    name: 'enter',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'list',
    outputs: [
      { internalType: 'uint256', name: 'prev', type: 'uint256' },
      {
        internalType: 'uint256',
        name: 'next',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'owns',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'last',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'cdp', type: 'uint256' },
      {
        internalType: 'address',
        name: 'dst',
        type: 'address'
      },
      { internalType: 'uint256', name: 'wad', type: 'uint256' }
    ],
    name: 'flux',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'urnCan',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'cdpi',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'usr', type: 'address' },
      {
        internalType: 'uint256',
        name: 'ok',
        type: 'uint256'
      }
    ],
    name: 'urnAllow',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'bytes32', name: 'ilk', type: 'bytes32' }],
    name: 'open',
    outputs: [{ internalType: 'uint256', name: 'cdp', type: 'uint256' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'cdpSrc', type: 'uint256' },
      {
        internalType: 'uint256',
        name: 'cdpDst',
        type: 'uint256'
      }
    ],
    name: 'shift',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'cdp', type: 'uint256' },
      {
        internalType: 'address',
        name: 'dst',
        type: 'address'
      },
      { internalType: 'uint256', name: 'rad', type: 'uint256' }
    ],
    name: 'move',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'first',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'cdp', type: 'uint256' },
      {
        internalType: 'address',
        name: 'dst',
        type: 'address'
      }
    ],
    name: 'give',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'vat_', type: 'address' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'usr', type: 'address' },
      {
        indexed: true,
        internalType: 'address',
        name: 'own',
        type: 'address'
      },
      { indexed: false, internalType: 'uint256', name: 'cdp', type: 'uint256' }
    ],
    name: 'NewCdp',
    type: 'event'
  },
  {
    anonymous: true,
    inputs: [
      { indexed: true, internalType: 'bytes4', name: 'sig', type: 'bytes4' },
      {
        indexed: true,
        internalType: 'address',
        name: 'usr',
        type: 'address'
      },
      { indexed: true, internalType: 'bytes32', name: 'arg1', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'arg2',
        type: 'bytes32'
      },
      { indexed: false, internalType: 'bytes', name: 'data', type: 'bytes' }
    ],
    name: 'LogNote',
    type: 'event'
  }
];
