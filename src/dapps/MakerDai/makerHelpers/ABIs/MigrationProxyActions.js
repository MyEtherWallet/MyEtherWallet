export default [
  {
    constant: false,
    inputs: [
      {
        internalType: 'address payable',
        name: 'scdMcdMigration',
        type: 'address'
      },
      { internalType: 'uint256', name: 'wad', type: 'uint256' }
    ],
    name: 'swapDaiToSai',
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
        name: 'scdMcdMigration',
        type: 'address'
      },
      { internalType: 'uint256', name: 'wad', type: 'uint256' }
    ],
    name: 'swapSaiToDai',
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
        name: 'scdMcdMigration',
        type: 'address'
      },
      { internalType: 'bytes32', name: 'cup', type: 'bytes32' },
      {
        internalType: 'address',
        name: 'otc',
        type: 'address'
      },
      { internalType: 'address', name: 'payGem', type: 'address' },
      {
        internalType: 'uint256',
        name: 'maxPayAmt',
        type: 'uint256'
      }
    ],
    name: 'migratePayFeeWithGem',
    outputs: [{ internalType: 'uint256', name: 'cdp', type: 'uint256' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address payable',
        name: 'scdMcdMigration',
        type: 'address'
      },
      { internalType: 'bytes32', name: 'cup', type: 'bytes32' }
    ],
    name: 'migrate',
    outputs: [{ internalType: 'uint256', name: 'cdp', type: 'uint256' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address payable',
        name: 'scdMcdMigration',
        type: 'address'
      },
      { internalType: 'bytes32', name: 'cup', type: 'bytes32' },
      {
        internalType: 'address',
        name: 'otc',
        type: 'address'
      },
      { internalType: 'uint256', name: 'maxPayAmt', type: 'uint256' }
    ],
    name: 'migratePayFeeWithDebt',
    outputs: [{ internalType: 'uint256', name: 'cdp', type: 'uint256' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
