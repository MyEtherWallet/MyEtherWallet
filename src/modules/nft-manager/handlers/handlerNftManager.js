import utils from 'web3-utils';
import configs from './config/configNft';
import ABI from './abi/abiNft';

export default class NFT {
  constructor({ network, address, web3 }) {
    this.network = network;
    this.address = address;
    this.web3 = web3;
    this.countPerPage = configs.countPerPage;
    this.currentPage = 1;
  }
  isValidAddress(hash) {
    return utils.isAddress(hash);
  }

  /**
   * Send NFT
   */
  send(to, token) {
    let raw;
    this.contract = new this.web3.eth.Contract(ABI);
    console.error('send', token);
    if (token.contract.includes(configs.cryptoKittiesContract)) {
      raw = this.cryptoKittiesTransfer(to, token);
    } else {
      raw = this.safeTransferFrom(to, token);
    }

    raw.from = this.address;
    return this.web3.eth.sendTransaction(raw);
  }

  safeTransferFrom(to, token) {
    this.contract.options.address = token.contract;
    return {
      to: token.contract,
      data: this.contract.methods
        .safeTransferFrom(this.address, to, token.token_id)
        .encodeABI()
    };
  }

  cryptoKittiesTransfer(to, token) {
    this.contract.options.address = token.contract;
    return {
      to: token.contract,
      data: this.contract.methods.transfer(to, token.token_id).encodeABI()
    };
  }

  /**
   * Pagination
   */

  hasPages(count) {
    return this.countPerPage < count;
  }

  hasNextPage(count) {
    return count > this.currentPage * this.countPerPage;
  }

  currentPage() {
    return this.currentPage;
  }

  startIndex() {
    return this.currentPage * this.countPerPage - this.countPerPage;
  }

  endIndex(count) {
    const endIdx = this.currentPage * this.countPerPage;
    if (count > endIdx) {
      return endIdx;
    }
    return count;
  }

  nextPage() {
    this.currentPage++;
  }

  hasPriorPage() {
    return this.currentPage >= 2;
  }

  priorPage() {
    if (this.currentPage >= 2) {
      this.currentPage--;
    }
  }

  goToFirstPage() {
    this.currentPage = 1;
  }

  /**
   * Get Nft Image
   */

  getImageUrl(contract, tokenId) {
    const nftUrl = `${configs.url}/getImage`;
    if (tokenId && tokenId.slice(0, 2) === '0x') {
      tokenId = tokenId.slice(2);
    }
    return `${nftUrl}?contract=${contract}&tokenId=${tokenId}`;
  }
}
