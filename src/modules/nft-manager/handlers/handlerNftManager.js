import utils from 'web3-utils';
import configs, { chains } from './config/configNft';
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
  /**
   * retrieves all NFTs for account
   * returns {Object}
   */
  async getNfts() {
    try {
      let { result } = await fetch(
        `${chains[this.network.type.chainID]}${this.address}`
      ).then(response => response.json());
      let nftResults = result.nfts;
      while (result.next) {
        const res = await fetch(result.next).then(response => response.json());
        result = res.result;
        nftResults = nftResults.concat(result.nfts);
      }
      return nftResults;
    } catch (e) {
      throw new Error(e);
    }
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
}
