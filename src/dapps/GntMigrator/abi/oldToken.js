export default [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'golemFactory',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_master', type: 'address' }],
    name: 'setMigrationMaster',
    outputs: [],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_value', type: 'uint256' }],
    name: 'migrate',
    outputs: [],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'finalize',
    outputs: [],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'refund',
    outputs: [],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'migrationMaster',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'tokenCreationCap',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_agent', type: 'address' }],
    name: 'setMigrationAgent',
    outputs: [],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'migrationAgent',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'fundingEndBlock',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalMigrated',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'tokenCreationMin',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'funding',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'tokenCreationRate',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'fundingStartBlock',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'create',
    outputs: [],
    payable: true,
    type: 'function'
  },
  {
    inputs: [
      { name: '_golemFactory', type: 'address' },
      { name: '_migrationMaster', type: 'address' },
      { name: '_fundingStartBlock', type: 'uint256' },
      { name: '_fundingEndBlock', type: 'uint256' }
    ],
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_from', type: 'address' },
      { indexed: true, name: '_to', type: 'address' },
      { indexed: false, name: '_value', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_from', type: 'address' },
      { indexed: true, name: '_to', type: 'address' },
      { indexed: false, name: '_value', type: 'uint256' }
    ],
    name: 'Migrate',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_from', type: 'address' },
      { indexed: false, name: '_value', type: 'uint256' }
    ],
    name: 'Refund',
    type: 'event'
  }
];
