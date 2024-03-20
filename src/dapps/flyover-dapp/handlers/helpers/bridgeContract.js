export const abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'lbcAddress',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'lpRskAddress',
            type: 'address'
          },
          {
            internalType: 'bytes',
            name: 'btcRefundAddress',
            type: 'bytes'
          },
          {
            internalType: 'address',
            name: 'rskRefundAddress',
            type: 'address'
          },
          {
            internalType: 'bytes',
            name: 'lpBtcAddress',
            type: 'bytes'
          },
          {
            internalType: 'uint256',
            name: 'callFee',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'penaltyFee',
            type: 'uint256'
          },
          {
            internalType: 'int64',
            name: 'nonce',
            type: 'int64'
          },
          {
            internalType: 'bytes',
            name: 'deposityAddress',
            type: 'bytes'
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256'
          },
          {
            internalType: 'uint32',
            name: 'agreementTimestamp',
            type: 'uint32'
          },
          {
            internalType: 'uint32',
            name: 'depositDateLimit',
            type: 'uint32'
          },
          {
            internalType: 'uint16',
            name: 'depositConfirmations',
            type: 'uint16'
          },
          {
            internalType: 'uint16',
            name: 'transferConfirmations',
            type: 'uint16'
          },
          {
            internalType: 'uint32',
            name: 'transferTime',
            type: 'uint32'
          },
          {
            internalType: 'uint32',
            name: 'expireDate',
            type: 'uint32'
          },
          {
            internalType: 'uint32',
            name: 'expireBlock',
            type: 'uint32'
          }
        ],
        internalType: 'struct Quotes.PegOutQuote',
        name: 'quote',
        type: 'tuple'
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes'
      }
    ],
    name: 'depositPegout',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
];
