import utils from 'web3-utils';
import configs, { chains } from './config/configNft';
import ABI from './abi/abiNft';
import ERC165ABI from './abi/abiERC165';
import ERC1155ABI from './abi/abiERC1155';
import BigNumber from 'bignumber.js';

const ERC1155InterfaceId = '0xd9b67a26';

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
  async getNfts(cached = false) {
    const endpoint = `${
      chains[this.network.type.chainID]
    }${this.address.toLowerCase()}/balances_nft/?no-spam=true${
      cached ? '&with-uncached=true' : ''
    }`;
    try {
      const { data } = await fetch(endpoint).then(response => response.json());
      const items = data && data.items ? data.items : [];
      const nfts = [];
      items.forEach(async collection => {
        const objTemplate = {};
        const has1155 = collection.supports_erc.includes('erc1155');
        const has721 = collection.supports_erc.includes('erc721');
        if (!has1155 && !has721) return;
        const firstNftWithInfo = collection.nft_data.find(
          nft =>
            !!nft.external_data &&
            !!nft.external_data.description &&
            !!nft.external_data.image
        );
        if (!firstNftWithInfo) return;
        objTemplate.contract_address = collection.contract_address;
        const contractInstance = new this.web3.eth.Contract(
          ERC165ABI,
          collection.contract_address
        );
        const supports1155 = await contractInstance.methods
          .supportsInterface(ERC1155InterfaceId)
          .call();
        collection.nft_data.forEach(token => {
          const obj = { ...objTemplate };
          obj.token_id = token.token_id;
          obj.name = token.name || token.token_id;
          obj.image_url =
            token.external_data?.image_512 ||
            token.external_data?.image_256 ||
            token.external_data?.image_1024 ||
            token.external_data?.image ||
            '';
          obj.contract = {
            type: supports1155 ? 'ERC1155' : 'ERC721',
            name: collection.contract_name
          };
          obj.collection = {
            name:
              collection.collection_name ||
              collection.contract_name ||
              collection.contract_address
          };
          obj.queried_wallet_balances = [
            {
              quantity: BigNumber(token.token_balance || 1).toNumber()
            }
          ];
          nfts.push(obj);
        });
      });
      return nfts;
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
