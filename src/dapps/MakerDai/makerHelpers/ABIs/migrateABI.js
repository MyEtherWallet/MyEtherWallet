export default [
  {
    constant: true,
    inputs: [],
    name: 'saiJoin',
    outputs: [{ internalType: 'contract JoinLike', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'wethJoin',
    outputs: [{ internalType: 'contract JoinLike', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'tub',
    outputs: [
      { internalType: 'contract SaiTubLike', name: '', type: 'address' }
    ],
    payable: false,
    stateMutability: 'view',
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
    inputs: [],
    name: 'cdpManager',
    outputs: [
      { internalType: 'contract ManagerLike', name: '', type: 'address' }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'daiJoin',
    outputs: [{ internalType: 'contract JoinLike', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'uint256', name: 'wad', type: 'uint256' }],
    name: 'swapDaiToSai',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'bytes32', name: 'cup', type: 'bytes32' }],
    name: 'migrate',
    outputs: [{ internalType: 'uint256', name: 'cdp', type: 'uint256' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'uint256', name: 'wad', type: 'uint256' }],
    name: 'swapSaiToDai',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tub_',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'cdpManager_',
        type: 'address'
      },
      { internalType: 'address', name: 'saiJoin_', type: 'address' },
      {
        internalType: 'address',
        name: 'wethJoin_',
        type: 'address'
      },
      { internalType: 'address', name: 'daiJoin_', type: 'address' }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  }
];
