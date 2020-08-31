export default class Sender {
  constructor({ address, web3, tokens, contractAddresses = [] }) {
    this.web3 = web3;
    this.contractAddresses = contractAddresses;
    this.tokens = tokens;
    this.address = address;
    this.isCryptoKitties = false;

    if (
      this.contractAddresses.includes(
        '0x06012c8cf97bead5deae237070f9587f8e7a266d'
      )
    ) {
      this.isCryptoKitties = true;
    }
  }

  send(to, tokenId) {
    const details = this.getTokenDetails(tokenId);
    if (!details) {
      throw Error('token id not found');
    }
    let raw;
    if (this.isCryptoKitties) {
      raw = this.cryptoKittiesTransfer(to, tokenId, details);
    } else {
      raw = this.safeTransferFrom(to, tokenId, details);
    }

    raw.from = this.address;
    return this.web3.eth.sendTransaction(raw);
  }

  safeTransferFrom(to, tokenId, details) {
    const ABI = [
      {
        constant: false,
        inputs: [
          {
            name: 'from',
            type: 'address'
          },
          {
            name: 'to',
            type: 'address'
          },
          {
            name: 'tokenId',
            type: 'uint256'
          }
        ],
        name: 'safeTransferFrom',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ];

    const contract = new this.web3.eth.Contract(ABI, details.contract);
    return {
      to: details.contract,
      data: contract.methods
        .safeTransferFrom(this.address, to, tokenId)
        .encodeABI()
    };
  }

  transferFrom(to, tokenId, details) {
    const ABI = [
      {
        constant: false,
        inputs: [
          { name: '_from', type: 'address' },
          { name: '_to', type: 'address' },
          {
            name: '_tokenId',
            type: 'uint256'
          }
        ],
        name: 'transferFrom',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ];

    const contract = new this.web3.eth.Contract(ABI, details.contract);
    return {
      to: details.contract,
      data: contract.methods.transferFrom(this.address, to, tokenId).encodeABI()
    };
  }

  cryptoKittiesTransfer(to, tokenId, details) {
    const cryptoKittiesContract = new this.web3.eth.Contract([
      {
        constant: false,
        inputs: [
          { name: '_to', type: 'address' },
          { name: '_tokenId', type: 'uint256' }
        ],
        name: 'transfer',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ]);

    return {
      to: details.contract,
      data: cryptoKittiesContract.methods.transfer(to, tokenId).encodeABI()
    };
  }

  getTokenDetails(tokenId) {
    return this.tokens.find(item => (item.token_id = tokenId));
  }
}
