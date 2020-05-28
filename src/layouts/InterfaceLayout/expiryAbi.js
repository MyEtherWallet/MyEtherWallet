const expiryAbi = [
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
        internalType: 'address',
        name: 'ensAdd',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: 'labelHases',
        type: 'uint256[]'
      }
    ],
    name: 'getExpirationDates',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
];

export default expiryAbi;
