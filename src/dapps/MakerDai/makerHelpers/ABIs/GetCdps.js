export default [
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: 'manager', type: 'address' },
      {
        internalType: 'address',
        name: 'guy',
        type: 'address'
      }
    ],
    name: 'getCdpsAsc',
    outputs: [
      { internalType: 'uint256[]', name: 'ids', type: 'uint256[]' },
      {
        internalType: 'address[]',
        name: 'urns',
        type: 'address[]'
      },
      { internalType: 'bytes32[]', name: 'ilks', type: 'bytes32[]' }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: 'manager', type: 'address' },
      {
        internalType: 'address',
        name: 'guy',
        type: 'address'
      }
    ],
    name: 'getCdpsDesc',
    outputs: [
      { internalType: 'uint256[]', name: 'ids', type: 'uint256[]' },
      {
        internalType: 'address[]',
        name: 'urns',
        type: 'address[]'
      },
      { internalType: 'bytes32[]', name: 'ilks', type: 'bytes32[]' }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
];
