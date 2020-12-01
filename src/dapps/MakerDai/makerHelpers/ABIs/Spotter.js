export default [
  {
    inputs: [{ internalType: 'address', name: 'vat_', type: 'address' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: true,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes4',
        name: 'sig',
        type: 'bytes4'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'usr',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'arg1',
        type: 'bytes32'
      },
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
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'ilk',
        type: 'bytes32'
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'val',
        type: 'bytes32'
      },
      { indexed: false, internalType: 'uint256', name: 'spot', type: 'uint256' }
    ],
    name: 'Poke',
    type: 'event'
  },
  {
    constant: false,
    inputs: [],
    name: 'cage',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'guy', type: 'address' }],
    name: 'deny',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'bytes32',
        name: 'ilk',
        type: 'bytes32'
      },
      { internalType: 'bytes32', name: 'what', type: 'bytes32' },
      {
        internalType: 'uint256',
        name: 'data',
        type: 'uint256'
      }
    ],
    name: 'file',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'bytes32',
        name: 'what',
        type: 'bytes32'
      },
      { internalType: 'uint256', name: 'data', type: 'uint256' }
    ],
    name: 'file',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'bytes32',
        name: 'ilk',
        type: 'bytes32'
      },
      { internalType: 'bytes32', name: 'what', type: 'bytes32' },
      {
        internalType: 'address',
        name: 'pip_',
        type: 'address'
      }
    ],
    name: 'file',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'ilks',
    outputs: [
      {
        internalType: 'contract PipLike',
        name: 'pip',
        type: 'address'
      },
      { internalType: 'uint256', name: 'mat', type: 'uint256' }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'live',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'par',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'bytes32', name: 'ilk', type: 'bytes32' }],
    name: 'poke',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'guy', type: 'address' }],
    name: 'rely',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'vat',
    outputs: [{ internalType: 'contract VatLike', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'wards',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
];
