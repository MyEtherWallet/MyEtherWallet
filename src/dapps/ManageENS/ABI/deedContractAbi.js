const DeedContractAbi = [
  {
    constant: true,
    inputs: [],
    name: 'creationDate',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'destroyDeed',
    outputs: [],
    payable: false,
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
    name: 'setOwner',
    outputs: [],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'registrar',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'refundRatio',
        type: 'uint256'
      }
    ],
    name: 'closeDeed',
    outputs: [],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'newRegistrar',
        type: 'address'
      }
    ],
    name: 'setRegistrar',
    outputs: [],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'newValue',
        type: 'uint256'
      }
    ],
    name: 'setBalance',
    outputs: [],
    payable: true,
    type: 'function'
  },
  {
    inputs: [],
    type: 'constructor'
  },
  {
    payable: true,
    type: 'fallback'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnerChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [],
    name: 'DeedClosed',
    type: 'event'
  }
];

export default DeedContractAbi;
