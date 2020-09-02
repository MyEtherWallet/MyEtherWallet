import configs from './config';
import utils from 'web3-utils';
import Sender from './senders';

export default class NftCollection {
  constructor(props) {
    this.tokenSetUpdateHook = props.tokenSetUpdateHook;
    this.address = props.address;
    this.api = props.api;
    this.web3 = props.web3;
    this.errorHandler = props.errorHandler || console.error;
    const details = props.details;

    this.name = details.name;
    this.symbol = details.symbol;
    this.contracts = details.contracts;
    this.contract = details.contractIdAddress;
    this.currentPage = 1;
    this.countPerPage = configs.countPerPage || 9;
    this.selectedContract = details.contractIdAddress;
    this.nftConfig = props.details;
    this.count = details.owned_asset_count;
    this.startIndex = 0;
    this.endIndex = 9;
    this.priorIndex = 0;
    this.currentIndex = 0;
    this.loadedTo = 0;
    this.initialSetRetrieved = false;
    this.tokens = details.tokens;
    this.nftToShowList = [];
    this.isActive = false;
    this.sender = new Sender({
      web3: this.web3,
      address: this.address,
      contractAddresses: this.contracts,
      tokens: this.tokens
    });
  }

  getRetrievedCount() {
    return this.tokens.length;
  }

  getTokens() {
    return this.tokens;
  }

  activate() {
    return this.getFirstTokenSet();
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
      .on('error', err => {
        this.resetNFT();
        this.errorHandler(err);
      });
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
    if (this.tokens.length === 0) {
      await this.getNftDetails();
    }
    return {
      name: this.name,
      currentPage: this.currentPage,
      count: this.count,
      tokens: this.selectNftsToShow()
    };
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
      return this.tokens.length > this.countPerPage
        ? this.tokens.slice(startIndex, endIndex)
        : this.tokens;
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
      return [];
    }
  }

  async getNftDetails(contract, startIndex = -1, endIndex = -1) {
    try {
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

      return await this.api
        .getNftDetailsApi(this.contract, params)
        .then(data => {
          let allTokens = [];
          if (!this.initialSetRetrieved) {
            this.initialSetRetrieved = true;
          }
          if (!data) {
            return this.tokens;
          }
          allTokens = data.tokens.map(tokenParse);

          this.tokens = allTokens;

          return allTokens;
        });
    } catch (e) {
      this.errorHandler(e);
    }
  }

  async getNftsToShow() {
    this.nftToShowList = this.selectNftsToShow();
  }

  async getFirstTokenSet() {
    return new Promise((resolve, reject) => {
      this.getNftDetails()
        .then(() => {
          this.tokenSetUpdateHook(this.tokens);
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
        if (this.tokens.length >= this.count) {
          this.startIndex = startIndex;
          this.endIndex = endIndex;
          resolve(this.getPageState());
          return;
        }
        if (this.collectionLoading) {
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
