import utils from 'web3-utils';
import configs, {
  GET_ALL_NFTS,
  GET_ALL_COLLECTIONS,
  GET_NFTS_BY_COLLECTION
} from './config/configNft';
import ABI from './abi/abiNft';
import ERC1155ABI from './abi/abiERC1155';
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
        `${GET_ALL_NFTS[this.network.type.chainID]}${this.address}`
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

  /**
   * retrieves all collections for account
   * returns {Object}
   */
  async getCollections() {
    try {
      const { result } = await fetch(
        `${GET_ALL_COLLECTIONS[this.network.type.chainID]}${this.address}`
      ).then(response => response.json());
      const nftResults = result.collections;
      return nftResults;
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Retrieves NFTs in a collection for an account
   * @param {String} collectionID ID of the NFT collection
   * @param {Boolean} firstPageOnly Fetch only the first page of NFTs
   * @returns {Object} Collection of NFTs
   */
  async getNFTsInCollection(collectionID, firstPageOnly = false) {
    try {
      let { result } = await fetch(
        GET_NFTS_BY_COLLECTION(
          this.network.type.chainID,
          collectionID,
          this.address
        )
      ).then(response => response.json());
      let nftResults = result.nfts;
      if (!firstPageOnly) {
        while (result.next) {
          const res = await fetch(result.next).then(response =>
            response.json()
          );
          result = res.result;
          nftResults = nftResults.concat(result.nfts);
        }
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
  send(to, token, gasPrice = undefined) {
    let raw;
    this.contract = new this.web3.eth.Contract(token.erc721 ? ABI : ERC1155ABI);
    if (token.contract.includes(configs.cryptoKittiesContract)) {
      raw = this.cryptoKittiesTransfer(to, token);
    } else if (token.erc721) {
      raw = this.safeTransferFrom(to, token);
    } else {
      raw = this.safeTransferFromRarible(to, token, 1);
    }
    raw.from = this.address;
    if (gasPrice !== undefined) raw.gasPrice = gasPrice;
    return this.web3.eth.sendTransaction(raw);
  }
  /**
   * Get Gas Fees
   */
  async getGasFees(to, token) {
    let raw;
    this.contract = new this.web3.eth.Contract(token.erc721 ? ABI : ERC1155ABI);
    if (token.contract.toLowerCase().includes(configs.cryptoKittiesContract)) {
      raw = this.cryptoKittiesTransfer(to, token);
    } else if (token.erc721) {
      raw = this.safeTransferFrom(to, token);
    } else {
      raw = this.safeTransferFromRarible(to, token, 1);
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
  /**
   * Sends a Rarible/ERC-1155 NFT
   * @param {string} to Address to send to
   * @param {object} token NFT to send
   * @param {number} amount Number of NFTs to send from collection
   * @param {string} data (Optional) data input
   * @returns Raw transaction object
   */
  safeTransferFromRarible(to, token, amount, data = '0x') {
    return {
      to: token.contract,
      data: this.contract.methods
        .safeTransferFrom(this.address, to, token.token_id, amount, data)
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
