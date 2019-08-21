export default [
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
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'bytes32'
      }
    ],
    name: 'expiryTimes',
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
    inputs: [
      {
        name: 'subnode',
        type: 'bytes32'
      },
      {
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'register',
    outputs: [],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'rootNode',
    outputs: [
      {
        name: '',
        type: 'bytes32'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    inputs: [
      {
        name: 'ensAddr',
        type: 'address'
      },
      {
        name: 'node',
        type: 'bytes32'
      }
    ],
    type: 'constructor'
  }
];
