export default [
  {
    inputs: [
      { internalType: 'contract Registry', name: 'registry', type: 'address' },
      {
        internalType: 'contract MintingController',
        name: 'mintingController',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'string',
        name: 'keyIndex',
        type: 'string'
      },
      { indexed: false, internalType: 'string', name: 'key', type: 'string' }
    ],
    name: 'NewKey',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'ResetRecords',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'string',
        name: 'keyIndex',
        type: 'string'
      },
      {
        indexed: true,
        internalType: 'string',
        name: 'valueIndex',
        type: 'string'
      },
      { indexed: false, internalType: 'string', name: 'key', type: 'string' },
      { indexed: false, internalType: 'string', name: 'value', type: 'string' }
    ],
    name: 'Set',
    type: 'event'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'string', name: 'key', type: 'string' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'get',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'uint256', name: 'keyHash', type: 'uint256' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'getByHash',
    outputs: [
      { internalType: 'string', name: 'key', type: 'string' },
      { internalType: 'string', name: 'value', type: 'string' }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'string[]', name: 'keys', type: 'string[]' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'getMany',
    outputs: [{ internalType: 'string[]', name: '', type: 'string[]' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'uint256[]', name: 'keyHashes', type: 'uint256[]' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'getManyByHash',
    outputs: [
      { internalType: 'string[]', name: 'keys', type: 'string[]' },
      { internalType: 'string[]', name: 'values', type: 'string[]' }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'uint256', name: 'keyHash', type: 'uint256' }],
    name: 'hashToKey',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'uint256[]', name: 'hashes', type: 'uint256[]' }],
    name: 'hashesToKeys',
    outputs: [{ internalType: 'string[]', name: '', type: 'string[]' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'nonceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'string[]', name: 'keys', type: 'string[]' },
      { internalType: 'string[]', name: 'values', type: 'string[]' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'preconfigure',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'string[]', name: 'keys', type: 'string[]' },
      { internalType: 'string[]', name: 'values', type: 'string[]' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'reconfigure',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'string[]', name: 'keys', type: 'string[]' },
      { internalType: 'string[]', name: 'values', type: 'string[]' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'bytes', name: 'signature', type: 'bytes' }
    ],
    name: 'reconfigureFor',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'registry',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'reset',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'bytes', name: 'signature', type: 'bytes' }
    ],
    name: 'resetFor',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'string', name: 'key', type: 'string' },
      { internalType: 'string', name: 'value', type: 'string' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'set',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'string', name: 'key', type: 'string' },
      { internalType: 'string', name: 'value', type: 'string' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'bytes', name: 'signature', type: 'bytes' }
    ],
    name: 'setFor',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'string[]', name: 'keys', type: 'string[]' },
      { internalType: 'string[]', name: 'values', type: 'string[]' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'setMany',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'string[]', name: 'keys', type: 'string[]' },
      { internalType: 'string[]', name: 'values', type: 'string[]' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'bytes', name: 'signature', type: 'bytes' }
    ],
    name: 'setManyFor',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
