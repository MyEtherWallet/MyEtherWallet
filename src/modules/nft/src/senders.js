import ABI from './ABI';

export default class Sender {
  constructor({ address, web3, tokens, contractAddresses = [] }) {
    this.web3 = web3;
    this.contractAddresses = contractAddresses;
    this.tokens = tokens;
    this.address = address;
    this.isCryptoKitties = false;
    if (!this.web3) {
      throw Error('NFT Module requires Web3');
    }
    this.contract = new this.web3.eth.Contract(ABI);
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
    this.contract.options.address = details.contract;
    return {
      to: details.contract,
      data: this.contract.methods
        .safeTransferFrom(this.address, to, tokenId)
        .encodeABI()
    };
  }

  transferFrom(to, tokenId, details) {
    this.contract.options.address = details.contract;
    return {
      to: details.contract,
      data: this.contract.methods
        .transferFrom(this.address, to, tokenId)
        .encodeABI()
    };
  }

  cryptoKittiesTransfer(to, tokenId, details) {
    this.contract.options.address = details.contract;
    return {
      to: details.contract,
      data: this.contract.methods.transfer(to, tokenId).encodeABI()
    };
  }

  getTokenDetails(tokenId) {
    return this.tokens.find(item => (item.token_id = tokenId));
  }
}
