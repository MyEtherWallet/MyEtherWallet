export default [
  {
    constant: false,
    inputs: [],
    name: 'build',
    outputs: [
      { internalType: 'address payable', name: 'proxy', type: 'address' }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'proxies',
    outputs: [{ internalType: 'contract DSProxy', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'build',
    outputs: [
      { internalType: 'address payable', name: 'proxy', type: 'address' }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'factory_', type: 'address' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  }
];
