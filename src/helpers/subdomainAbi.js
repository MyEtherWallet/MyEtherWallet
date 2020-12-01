const SubdomainAbi = [
  {
    constant: true,
    inputs: [
      {
        name: 'interfaceID',
        type: 'bytes4'
      }
    ],
    name: 'supportsInterface',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'pure',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'label',
        type: 'bytes32'
      }
    ],
    name: 'owner',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'stop',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'name',
        type: 'string'
      }
    ],
    name: 'upgrade',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'migration',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'registrarOwner',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'label',
        type: 'bytes32'
      },
      {
        name: 'subdomain',
        type: 'string'
      }
    ],
    name: 'query',
    outputs: [
      {
        name: 'domain',
        type: 'string'
      },
      {
        name: 'price',
        type: 'uint256'
      },
      {
        name: 'rent',
        type: 'uint256'
      },
      {
        name: 'referralFeePPM',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'hashRegistrar',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'ens',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'label',
        type: 'bytes32'
      },
      {
        name: 'subdomain',
        type: 'string'
      },
      {
        name: 'subdomainOwner',
        type: 'address'
      },
      {
        name: 'referrer',
        type: 'address'
      },
      {
        name: 'resolver',
        type: 'address'
      }
    ],
    name: 'register',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_migration',
        type: 'address'
      }
    ],
    name: 'setMigrationAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'label',
        type: 'bytes32'
      },
      {
        name: 'subdomain',
        type: 'string'
      }
    ],
    name: 'rentDue',
    outputs: [
      {
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'resolver',
        type: 'address'
      }
    ],
    name: 'setResolver',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'stopped',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'TLD_NODE',
    outputs: [
      {
        name: '',
        type: 'bytes32'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'name',
        type: 'string'
      }
    ],
    name: 'migrate',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'label',
        type: 'bytes32'
      },
      {
        name: 'subdomain',
        type: 'string'
      }
    ],
    name: 'payRent',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'price',
        type: 'uint256'
      },
      {
        name: 'referralFeePPM',
        type: 'uint256'
      },
      {
        name: '_owner',
        type: 'address'
      },
      {
        name: '_transfer',
        type: 'address'
      }
    ],
    name: 'configureDomainFor',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'price',
        type: 'uint256'
      },
      {
        name: 'referralFeePPM',
        type: 'uint256'
      }
    ],
    name: 'configureDomain',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'transfer',
        type: 'address'
      }
    ],
    name: 'setTransferAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'name',
        type: 'string'
      }
    ],
    name: 'unlistDomain',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transfer',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        name: '_ens',
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
        name: 'label',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'addr',
        type: 'address'
      }
    ],
    name: 'TransferAddressSet',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'label',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'name',
        type: 'string'
      }
    ],
    name: 'DomainTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'label',
        type: 'bytes32'
      },
      {
        indexed: true,
        name: 'oldOwner',
        type: 'address'
      },
      {
        indexed: true,
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnerChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'label',
        type: 'bytes32'
      }
    ],
    name: 'DomainConfigured',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'label',
        type: 'bytes32'
      }
    ],
    name: 'DomainUnlisted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'label',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'subdomain',
        type: 'string'
      },
      {
        indexed: true,
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        name: 'referrer',
        type: 'address'
      },
      {
        indexed: false,
        name: 'price',
        type: 'uint256'
      }
    ],
    name: 'NewRegistration',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'label',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'subdomain',
        type: 'string'
      },
      {
        indexed: false,
        name: 'amount',
        type: 'uint256'
      },
      {
        indexed: false,
        name: 'expirationDate',
        type: 'uint256'
      }
    ],
    name: 'RentPaid',
    type: 'event'
  }
];

export default SubdomainAbi;
