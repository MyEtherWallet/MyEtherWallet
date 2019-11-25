export default [
  {
    constant: true,
    inputs: [],
    name: 'amt',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: '', type: 'address' },
      { name: '', type: 'address' }
    ],
    name: 'done',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'gem', type: 'address' }],
    name: 'shut',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'guy', type: 'address' }],
    name: 'rely',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'gem', type: 'address' }],
    name: 'gulp',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'guy', type: 'address' }],
    name: 'deny',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'address' }],
    name: 'wards',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'amt_', type: 'uint256' }],
    name: 'setamt',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'amt_', type: 'uint256' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: true,
    inputs: [
      { indexed: true, name: 'sig', type: 'bytes4' },
      {
        indexed: true,
        name: 'usr',
        type: 'address'
      },
      { indexed: true, name: 'arg1', type: 'bytes32' },
      {
        indexed: true,
        name: 'arg2',
        type: 'bytes32'
      },
      { indexed: false, name: 'data', type: 'bytes' }
    ],
    name: 'LogNote',
    type: 'event'
  }
];
