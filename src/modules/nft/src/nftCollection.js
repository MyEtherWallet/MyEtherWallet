import configs from './config';

export default class NftCollection {
  constructor(props) {
    this.tokenSetUpdateHook = props.tokenSetUpdateHook;
    const details = props.details;
    this.address = props.address;
    this.name = details.name;
    this.symbol = details.symbol;
    this.api = props.api;
    this.contracts = details.contracts;
    this.contract = details.contractIdAddress;
    this.currentPage = 1;
    this.countPerPage = configs.countPerPage;
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
    // this.getNftDetails();
  }

  getRetrievedCount() {
    return this.tokens.length;
  }

  getTokens() {
    return this.tokens;
  }

  getPageState() {
    console.log(this.tokens.length); // todo remove dev item
    return {
      name: this.name,
      currentPage: this.currentPage,
      totalTokens: this.count,
      tokens: this.selectNftsToShow()
    };
  }

  selectNftsToShow() {
    try {
      if (!this.tokens) return [];
      return this.tokens.length > this.countPerPage
        ? this.tokens.slice(this.startIndex, this.endIndex)
        : this.tokens;
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
      return [];
    }
  }

  async getNftDetails(
    contract,
    startIndex = -1,
    endIndex = -1,
    preFetch = false
  ) {
    if (!preFetch) this.fetchingOwnedTokens = true;
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

    return await this.api.getNftDetailsApi(contract, params).then(data => {
      let allTokens = [];
      if (!this.initialSetRetrieved) {
        this.initialSetRetrieved = true;
      }
      if (!data) {
        return this.tokens;
      }
      allTokens = data.tokens.map(tokenParse);

      if (!preFetch) this.fetchingOwnedTokens = false;
      this.tokens = allTokens;

      return allTokens;
    });
  }

  async getNftsToShow() {
    this.nftToShowList = this.selectNftsToShow();
  }

  incrementTokenList() {
    if (this.tokens.length >= this.count) {
      return this.selectNftsToShow();
    }
    let startIndex = this.currentPage * this.countPerPage - this.countPerPage;
    let endIndex = this.currentPage * this.countPerPage;
    if (startIndex < 0) {
      startIndex = 0;
      endIndex = 9;
    }
    const selectedContract = this.selectedContract;
    return this.getNftDetails(selectedContract, startIndex, endIndex).then(
      result => {
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.tokens = result;
        this.collectionLoading = false;
        return this.getPageState();
      }
    );
  }

  getNext() {
    return new Promise(resolve => {
      this.getNftsToShow();
      this.currentPage++;
      if (this.tokens.length <= this.currentPage * this.countPerPage) {
        this.collectionLoading = true;
        return resolve(this.incrementTokenList());
      }
      return resolve(this.getPageState());
    });
  }

  getPrevious() {
    if (this.currentPage >= 1) {
      this.currentPage--;
      return this.getPageState();
    }
  }
}
