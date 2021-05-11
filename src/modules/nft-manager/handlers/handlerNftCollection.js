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
    this.countPerPage = configs.countPerPage || 9;
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
      contractAddresses: this.contracts,
      tokens: this.tokens
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

  send(to, tokenId) {
    return this.sender
      .send(to, tokenId)
      .on('transactionHash', () => {
        this.removeSentNft(tokenId);
      })
      .on('error', err => {
        this.resetNFT();
        return err;
      });
  }

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

  async getPageState() {
    return new Promise((resolve, reject) => {
      try {
        if (this.tokens.length === 0) {
          return this.getNftDetails().then(resolve).catch(reject);
        }
        const startIndex = this.getStartIndex();
        const endIndex = this.getEndIndex();
        if (
          this.tokens.length <= this.getEndIndex() &&
          this.tokens.length <= this.getStartIndex()
        ) {
          return this.getNftDetails(this.contract, startIndex, endIndex)
            .then(resolve)
            .catch(reject);
        }
        return resolve({
          name: this.name,
          currentPage: this.currentPage,
          count: this.count,
          tokens: this.selectNftsToShow()
        });
      } catch (e) {
        if (this.failureRetryReset) {
          this.failureRetryReset = false;
          return reject(e);
        }
        this.failureRetryReset = true;
        this.currentPage = 1;
        return this.getPageState();
      }
    });
  }

  getStartIndex() {
    return this.currentPage * this.countPerPage - this.countPerPage;
  }

  getEndIndex() {
    const endIndex = this.currentPage * this.countPerPage;
    if (this.count > endIndex) {
      return endIndex;
    }
    return this.count;
  }

  selectNftsToShow() {
    let startIndex = this.getStartIndex();
    let endIndex = this.getEndIndex();

    if (startIndex < 0) {
      startIndex = 0;
      endIndex = 9;
    }
    try {
      if (!this.tokens) return [];
      return this.tokens.length > this.countPerPage
        ? this.tokens.slice(startIndex, endIndex)
        : this.tokens;
    } catch (e) {
      return [];
    }
  }

  getNftDetails(startIndex = -1, endIndex = -1) {
    return new Promise((resolve, reject) => {
      try {
        let params;
        if (startIndex >= 0 && endIndex >= 0 && endIndex <= this.count) {
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
          if (item.token_id) {
            if (item.token_id.length > 30) {
              item.name = `${item.token_id.slice(0, 6)}...${item.token_id.slice(
                -6
              )}`;
            } else {
              item.name = item.token_id;
            }
          }

          return {
            description: item.description,
            name: `#${item.name}`,
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
          .catch(err => {
            this.currentPage = this.currentPage - 1;
            reject(err);
          });
      } catch (e) {
        reject(e);
      }
    });
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
        const startIndex = this.getStartIndex();
        const endIndex = this.getEndIndex();
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
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  hasNextPage() {
    if (this.currentPage === 1 && this.count >= this.countPerPage) {
      return true;
    }
    const moreAvailableToGet =
      this.count > this.currentPage * this.countPerPage;
    const moreToGetForPage =
      this.tokens.length >= this.currentPage * this.countPerPage;
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

  hasPrevious() {
    return this.currentPage >= 2;
  }

  getPrevious() {
    if (this.currentPage >= 2) {
      this.currentPage--;
      return this.getPageState();
    }
    return this.getPageState();
  }
}
