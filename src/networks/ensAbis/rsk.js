const RSKAbi = [
  {
    constant: true,
    inputs: [{ name: 'node', type: 'bytes32' }],
    name: 'addr',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'addrValue', type: 'address' }
    ],
    name: 'setAddr',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

export default RSKAbi;
