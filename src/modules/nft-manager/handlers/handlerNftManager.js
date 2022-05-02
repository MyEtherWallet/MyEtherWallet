import utils from 'web3-utils';
import configs from './config/configNft';
import ABI from './abi/abiNft';
import BigNumber from 'bignumber.js';

export default class NFT {
  constructor({ network, address, web3 }) {
    this.network = network;
    this.address = address;
    this.web3 = web3;
    this.countPerPage = configs.countPerPage;
    this.currentPage = 1;
  }
  isValidAddress(hash) {
    return hash !== '' && utils.isAddress(hash);
  }

  /**
   * Send NFT
   */
  send(to, token) {
    let raw;
    this.contract = new this.web3.eth.Contract(ABI);
    if (token.contract.includes(configs.cryptoKittiesContract)) {
      raw = this.cryptoKittiesTransfer(to, token);
    } else {
      raw = this.safeTransferFrom(to, token);
    }
    raw.from = this.address;
    return this.web3.eth.sendTransaction(raw);
  }
  /**
   * Get Gas Fees
   */

  async getGasFees(to, token) {
    let raw;
    this.contract = new this.web3.eth.Contract(ABI);
    if (token.contract.includes(configs.cryptoKittiesContract)) {
      raw = this.cryptoKittiesTransfer(to, token);
    } else {
      raw = this.safeTransferFrom(to, token);
    }
    raw.from = this.address;
    const gasEst = this.web3.eth.estimateGas(raw);
    return gasEst;
  }

  safeTransferFrom(to, token) {
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

  totalPages(count) {
    return Math.ceil(new BigNumber(count).div(this.countPerPage).toNumber());
  }

  hasPages(count) {
    return this.countPerPage < count;
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

  setCurrentPage(page) {
    this.currentPage = page;
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
