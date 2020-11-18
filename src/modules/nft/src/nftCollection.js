import configs from './config';
import utils from 'web3-utils';
import Sender from './senders';

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
    this.countPerPage = configs.countPerPage || 9;
    this.selectedContract = details.contractIdAddress;
    this.imageContractBase = this.contracts[0].contract
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
      contractAddresses: this.contracts,
      tokens: this.tokens
    });
  }

  getTokens() {
    return this.tokens;
  }

  getTokenCount(){
    return this.tokens.length
  }

  activate() {
    return new Promise((resolve, reject) => {
      if (this.tokens.length === 0) {
        this.getFirstTokenSet().then(resolve).catch(reject);
      } else {
        resolve();
      }
    });
  }

  getPanelDetails() {
    return {
      count: this.count,
      name: this.name,
      contract: this.contract
    };
  }

  send(to, tokenId) {
    return this.sender
      .send(to, tokenId)
      .on('transactionHash', () => {
        this.removeSentNft(tokenId);
      })
      .on('error', () => {
        this.resetNFT();
      });
  }

  sendData(to, tokenId){
    return this.sender.sendData(to, tokenId)
  }

  txFeeETH(gasLimit, gasPrice){
    return this.sender.txFeeETH(gasLimit, gasPrice)
  }

  txFeeUSD(gasLimit, ethPrice, gasPrice){
    return this.sender.txFeeUSD(gasLimit, ethPrice, gasPrice)
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

  async getPageState() {
    return new Promise((resolve, reject) => {
      if (this.tokens.length === 0) {
        return this.getNftDetails().then(resolve).catch(reject);
      }
      return resolve({
        name: this.name,
        currentPage: this.currentPage,
        count: this.count,
        tokens: this.selectNftsToShow()
      });
    });
  }

  selectNftsToShow() {
    let startIndex = this.currentPage * this.countPerPage - this.countPerPage;
    let endIndex = this.currentPage * this.countPerPage;

    if (startIndex < 0) {
      startIndex = 0;
      endIndex = 9;
    }
    try {
      if (!this.tokens) return [];
      this.sender.updateTokens(this.tokens)
      return this.tokens.length > this.countPerPage
        ? this.tokens.slice(startIndex, endIndex)
        : this.tokens;
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
      return [];
    }
  }

  getNftDetails(contract, startIndex = -1, endIndex = -1) {
    return new Promise((resolve, reject) => {
      let params;
      if (startIndex >= 0 && endIndex >= 0) {
        params = {
          address: this.address,
          contractAddresses: this.contracts,
          startIndex,
          endIndex
        };
      } else {
        params = {
          address: this.address,
          contractAddresses: this.contracts
        };
      }

      const tokenParse = item => {
        return {
          description: item.description,
          name: item.name,
          token_id: item.token_id,
          contract: item.contract
        };
      };

      this.api
        .getNftDetailsApi(this.contract, params)
        .then(data => {
          let allTokens = [];
          if (!this.initialSetRetrieved) {
            this.initialSetRetrieved = true;
          }
          if (!data) {
            resolve(this.tokens);
            return;
          }
          allTokens = data.tokens.map(tokenParse);

          this.tokens = allTokens;
          this.isActive = true;
          resolve(allTokens);
        })
        .catch(reject);
    });
  }

  getImageUrl(contract, tokenId) {
    return `${this.nftUrl}?contract=${contract}&tokenId=${tokenId}`;
  }

  getNftsToShow() {
    this.nftToShowList = this.selectNftsToShow();
  }

  getFirstTokenSet() {
    return new Promise((resolve, reject) => {
      this.getNftDetails()
        .then(() => {
          if (this.count > 9) {
            this.getNftDetails(this.contract, 9, 18, true)
              .then(() => {
                resolve(this.nftConfig[this.selectedContract]);
              })
              .catch(reject);
          } else {
            resolve(this.nftConfig[this.selectedContract]);
          }
        })
        .catch(reject);
    });
  }

  incrementTokenList() {
    return new Promise((resolve, reject) => {
      try {
        let startIndex =
          this.currentPage * this.countPerPage - this.countPerPage;
        let endIndex = this.currentPage * this.countPerPage;
        if (
          this.tokens.length >= this.count ||
          this.tokens.length >= endIndex
        ) {
          this.startIndex = startIndex;
          this.endIndex = endIndex;
          this.collectionLoading = false;
          resolve(this.getPageState());
          return;
        }
        if (this.collectionLoading) {
          resolve(this.getPageState());
          return;
        }

        if (startIndex < 0) {
          startIndex = 0;
          endIndex = 9;
        }
        const selectedContract = this.selectedContract;

        this.getNftDetails(selectedContract, startIndex, endIndex).then(
          result => {
            this.startIndex = startIndex;
            this.endIndex = endIndex;
            this.tokens = result;
            this.collectionLoading = false;
            return resolve(this.getPageState());
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  hasNextPage() {
    const moreAvailableToGet =
      this.count > this.currentPage * this.countPerPage;
    const moreToGetForPage =
      this.tokens.length <= (this.currentPage + 1) * this.countPerPage;
    return moreAvailableToGet && moreToGetForPage;
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
