import utils from 'web3-utils';
import configs from './config/configNft';
import ABI from './abi/abiNft';

export default class NFT {
  constructor({ network, address, web3 }) {
    this.network = network;
    this.address = address;
    this.web3 = web3;
    this.countPerPage = 6;
    this.currentPage = 1;
  }
  isValidAddress(hash) {
    return utils.isAddress(hash);
  }

  /**
   * Send NFT
   */
  send(to, token) {
    console.error('adfadsf', to, token);
    let raw;
    this.contract = new this.web3.eth.Contract(ABI);

    if (this.contractAddresses.includes(configs.cryptoKittiesContract)) {
      raw = this.cryptoKittiesTransfer(to, token);
    } else {
      raw = this.safeTransferFrom(to, token);
    }

    raw.from = this.address;
    return this.web3.eth.sendTransaction(raw).send(to, token.token_id);
    // .on('transactionHash', () => {
    //   this.removeSentNft(token.token_id);
    // })
    // .on('error', err => {
    //   this.resetNFT();
    //   return err;
    // });
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

  sendData(to, tokenId) {
    // what does this do
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
