import utils from 'web3-utils';
import configs from './config/configNft';

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
  // send(token) {
  //   let raw;
  //   if (this.contractAddresses.includes(configs.cryptoKittiesContract)) {
  //     raw = this.cryptoKittiesTransfer(to, tokenId, details);
  //   } else {
  //     raw = this.safeTransferFrom(to, tokenId, details);
  //   }

  //   raw.from = this.address;
  //   return this.web3.eth
  //     .sendTransaction(raw)
  //     .send(to, tokenId)
  //     .on('transactionHash', () => {
  //       this.removeSentNft(tokenId);
  //     })
  //     .on('error', err => {
  //       this.resetNFT();
  //       return err;
  //     });
  // }

  safeTransferFrom(to, tokenId, details) {
    this.contract.options.address = details.contract;
    return {
      to: details.contract,
      data: this.contract.methods
        .safeTransferFrom(this.address, to, tokenId)
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

  sendData(to, tokenId) {
    return this.currentActive.sendData(to, tokenId);
  }

  txFeeETH(gasLimit, gasPrice) {
    return this.currentActive.txFeeETH(gasLimit, gasPrice);
  }

  txFeeUSD(gasLimit, ethPrice, gasPrice) {
    return this.currentActive.txFeeUSD(gasLimit, ethPrice, gasPrice);
  }

  removeSentNft(tokenId) {
    this.currentActive.removeSentNft(tokenId);
  }

  /**
   * Pagination
   */
  getPageValues() {
    return this.currentActive.getPageState().catch(() => {
      return {
        name: 'unknown',
        currentPage: 0,
        count: 0
        // tokens: []
      };
    });
  }

  hasPages(count) {
    return this.countPerPage < count;
  }

  hasNextPage(count) {
    return count > this.currentPage * this.countPerPage;
  }

  startIndex() {
    return 1 + (this.currentPage * this.countPerPage - this.countPerPage);
  }

  endIndex() {
    const endIdx = this.currentPage * this.countPerPage;
    if (this.tokens.length < this.countPerPage) {
      return (
        this.currentPage * this.countPerPage -
        (this.countPerPage - this.tokens.length)
      );
    }
    return this.tokens.length < endIdx ? endIdx : this.tokens.length;
  }

  async nextPage() {
    if (this.currentActive.hasNextPage()) {
      return new Promise((resolve, reject) => {
        this.currentActive.getNext().then(resolve).catch(reject);
      });
    }
    return Promise.resolve();
  }

  hasPriorPage() {
    return this.currentPage >= 2;
  }

  priorPage() {
    return this.currentActive.getPrevious();
  }

  selectNftsToShow() {
    return this.currentActive.selectNftsToShow();
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
