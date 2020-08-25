import configs from './config';

export default class NftCollection {
  constructor(props) {
    const details = props.details;
    this.address = props.address;
    this.api = props.api;
    this.contracts = details.contracts;
    this.contract = details.contractIdAddress;
    this.currentPage = 0;
    this.countPerPage = configs.countPerPage;
    this.selectedContract = details.contractIdAddress;
    this.nftConfig = props.details;
    this.count = details.owned_asset_count;
    this.startIndex = 0;
    this.endIndex = 9;
    this.priorIndex = 0;
    this.currentIndex = 0;
    this.loadedTo = 0;
    this.tokens = details.tokens;
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
    const startIndex = this.currentPage * this.countPerPage - this.countPerPage;
    const endIndex = this.currentPage * this.countPerPage;
    const selectedContract = this.selectedContract;
    return this.getNftDetails(selectedContract, startIndex, endIndex).then(
      result => {
        this.tokens = result;
        this.collectionLoading = false;
        // this.tokenSetUpdateHook(this.selectNftsToShow());
        return this.selectNftsToShow();
      }
    );
  }

  getNext() {
    this.getNftsToShow();
    this.currentPage++;
    if (this.tokens.length < this.currentPage * this.countPerPage) {
      this.collectionLoading = true;
      return this.incrementTokenList();
    }
  }

  getPrevious() {
    if (this.currentPage >= 1) {
      this.currentPage--;
    }
  }
}
