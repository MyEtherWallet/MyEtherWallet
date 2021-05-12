import configs from './config/configNft';
import utils from 'web3-utils';
import Sender from './handlerSend';

export default class NftCollection {
  constructor(props) {
    this.address = props.address;
    this.api = props.api;
    this.web3 = props.web3;
    const details = props.details;

    this.name = details.name;
    this.symbol = details.symbol;
    this.contracts = details.contracts;
    this.contract = details.contractIdAddress;
    this.currentPage = 1;
    this.selectedContract = details.contractIdAddress;
    this.imageContractBase = Array.from(this.contracts)[0].contract;
    this.nftConfig = props.details;
    this.count = details.owned_asset_count;
    this.startIndex = 0;
    this.endIndex = 9;
    this.priorIndex = 0;
    this.currentIndex = 0;
    this.loadedTo = 0;
    this.initialSetRetrieved = false;
    this.tokens = details.tokens;
    this.nftUrl = `${configs.url}/getImage`;
    this.nftToShowList = [];
    this.isActive = false;
    this.sender = new Sender({
      web3: this.web3,
      address: this.address,
      contractAddresses: this.contracts
      // tokens: this.tokens
    });
    this.failureRetryReset = false;
    this.displayEndIndex = 0;
  }

  getTokenCount() {
    return this.count;
  }

  // activate() {
  //   return new Promise((resolve, reject) => {
  //     if (this.tokens.length === 0) {
  //       this.getFirstTokenSet().then(resolve).catch(reject);
  //     } else {
  //       resolve();
  //     }
  //   });
  // }

  sendData(to, tokenId) {
    return this.sender.sendData(to, tokenId);
  }

  txFeeETH(gasLimit, gasPrice) {
    return this.sender.txFeeETH(gasLimit, gasPrice);
  }

  txFeeUSD(gasLimit, ethPrice, gasPrice) {
    return this.sender.txFeeUSD(gasLimit, ethPrice, gasPrice);
  }

  removeSentNft(token_id) {
    this.nftObjectClone = utils._.clone(this.tokens);
    this.tokens = this.tokens.filter(entry => {
      return entry.token_id !== token_id;
    });
    if (this.tokens) {
      if (this.tokens.length === 0) this.sentUpdate += 1;
    }
    this.showDetails = false;
  }

  resetNFT() {
    if (Object.keys(this.nftObjectClone).length > 0) {
      this.tokens = this.nftObjectClone;
    }
  }

  getNext() {
    this.getNftsToShow();

    this.currentPage++;

    if (this.tokens.length <= this.currentPage * this.countPerPage) {
      this.collectionLoading = true;
      return this.incrementTokenList();
    }
    return Promise.resolve(this.getPageState());
  }

  getPrevious() {
    if (this.currentPage >= 2) {
      this.currentPage--;
      return this.getPageState();
    }
    return this.getPageState();
  }
}
