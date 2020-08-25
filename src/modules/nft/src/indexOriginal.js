import utils from 'web3-utils';
import fetch from 'node-fetch';
const endPointUrl =
  'https://72oj41m8eb.execute-api.us-west-2.amazonaws.com/dev';
// const endPointUrl = 'https://localhost:3000/local'

export default class Nft {
  constructor(environment = {}) {
    this.active = true;
    this.network = environment.network || { type: { name: 'ETH' } };
    this.activeAddress = environment.address;
    this.nftUrl = `${endPointUrl}getImage`;
    this.openSeaLambdaUrl = endPointUrl;
    this.countPerPage = 9;
    this.currentPage = 1;
    this.nftConfig = {};
    this.countsRetrieved = false;
    this.showDetails = false;
    this.reLoading = false;
    this.selectedContract = '';
    this.detailsFor = {};
    this.nftTokens = {};
    this.ownedTokens = [];
    this.sentUpdate = 0;
    this.customNFTs = [];
    this.forRemoval = {};
    this.collectionLoading = false;
    this.fetchingOwnedTokens = true;
    this.nftObjectClone = {};
    this.nftToShowList = [];
    this.retryCount = 0;
    this.startIndex = 0;
    this.endIndex = 9;
  }

  static async init(environment) {
    const create = new Nft(environment);
    await create.setup();
    return create;
  }

  //======================================================================
  selectNftsToShow() {
    try {
      if (this.nftConfig[this.selectedContract]) {
        if (!this.nftConfig[this.selectedContract].tokens) return [];
        return this.nftConfig[this.selectedContract].tokens.length >
          this.countPerPage
          ? this.nftConfig[this.selectedContract].tokens.slice(
              this.startIndex,
              this.endIndex
            )
          : this.nftConfig[this.selectedContract].tokens;
      }
      return [];
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
      return [];
    }
  }
  // hasLoaded(nft) {
  //   this.$set(nft, 'loaded', true);
  // }
  hasImage(nft) {
    if (nft.customNft || nft.image === '') {
      return true;
    }
    if (nft.loaded) {
      return true;
    }
  }
  getImage(nft) {
    // if (nft.customNft || nft.image === '') {
    //   return placeholderImage;
    // }
    return `${this.openSeaLambdaUrl}/getImage?contract=${nft.contract}&tokenId=${nft.token_id}`;
  }
  removeSentNft(nft) {
    this.nftObjectClone = utils._.clone(this.nftConfig[nft.contract]);
    this.nftConfig[nft.contract].tokens = this.nftConfig[
      nft.contract
    ].tokens.filter(entry => {
      return entry.id !== nft.id;
    });
    if (this.nftConfig[nft.contract].tokens) {
      if (this.nftConfig[nft.contract].tokens.length === 0)
        this.sentUpdate += 1;
    }
    this.showDetails = false;
  }
  resetNFT(nft) {
    if (Object.keys(this.nftObjectClone).length > 0) {
      this.nftConfig[nft.contract] = this.nftObjectClone;
    }
  }
  changeSelectedContract(selectedContract) {
    this.selectedContract = selectedContract;
    this.showDetails = false;
  }

  async getTokens() {
    return new Promise((resolve, reject) => {
      fetch(`${this.openSeaLambdaUrl}/nft?address=${this.activeAddress}`, {
        mode: 'cors',
        cache: 'no-cache',
        method: 'GET',
        'Cache-Control': 'no-cache'
        /*body: JSON.stringify({
          jsonrpc: '2.0',
          method: '',
          params: {
            address: this.activeAddress
          },
          id: 83
        })*/
      })
        .then(data => data.json())
        .then(newData => {
          console.log(newData); // todo remove dev item
          resolve(newData);
        })
        .catch(error => {
          // eslint-disable-next-line
          console.error(error);
          this.retryCount++;
          if (this.retryCount < 3) {
            setTimeout(() => {
              resolve(this.getTokens());
            }, 1000);
          } else {
            reject(error);
          }
        });
    });
  }

  async setup() {
    const nftData = {};
    let selectedContract;
    if (this.network.type.name === 'ETH') {
      const configData = await this.getTokens();
      if (!configData.error) {
        configData.tokenContracts.forEach(data => {
          nftData[data.contractIdAddress] = data;

          if (nftData[data.contractIdAddress]) {
            nftData[data.contractIdAddress].contract = data.contractIdAddress;
            nftData[data.contractIdAddress].count = data.owned_asset_count;
            nftData[data.contractIdAddress].startIndex = 0;
            nftData[data.contractIdAddress].priorIndex = 0;
            nftData[data.contractIdAddress].currentIndex = 0;
            nftData[data.contractIdAddress].loadedTo = 0;
          }
        });
        console.log('nftData', nftData); // todo remove dev item
        this.nftConfig = { ...nftData };
        selectedContract = Object.keys(this.nftConfig)[0];
        this.selectedContract = Object.keys(this.nftConfig)[0];

        this.reLoading = false;
        this.countsRetrieved = true;
        console.log(selectedContract); // todo remove dev item
        return selectedContract;
      }
    }
  }

  async getFirstTokenSet(selectedContract) {
    return new Promise(resolve => {
      this.getNftDetails(selectedContract).then(result => {
        this.nftConfig[this.selectedContract].tokens = result;
        this.getNftDetails(selectedContract, 9, 18, true).then(result => {
          this.nftConfig[selectedContract].tokens = result;
          resolve();
        });
      });
    });
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
        address: this.activeAddress,
        contractAddresses: this.nftConfig[contract].contracts,
        startIndex,
        endIndex
      };
    } else {
      params = {
        address: this.activeAddress,
        contractAddresses: this.nftConfig[contract].contracts
      };
    }
    console.log('params', params); // todo remove dev item
    return await fetch(`${this.openSeaLambdaUrl}/nft`, {
      mode: 'cors',
      cache: 'no-cache',
      method: 'POST',
      'Cache-Control': 'no-cache',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: '',
        params,
        id: 83
      })
    })
      .then(data => data.json())
      .then(data => {
        console.log('data', data); // todo remove dev item
        return data.find(item => {
          return item.contractIdAddress === contract;
        });
      })
      .then(data => {
        let allTokens = [];
        allTokens = data.tokens.map(item => {
          return {
            description: item.description,
            name: item.name,
            token_id: item.token_id,
            contract: item.contract
          };
        });

        if (!preFetch) this.fetchingOwnedTokens = false;
        this.nftConfig[contract].tokens = allTokens;
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
    this.getNftDetails(selectedContract, startIndex, endIndex).then(result => {
      this.nftConfig[selectedContract].tokens = result;
      this.collectionLoading = false;
    });
  }
  getNext() {
    this.getNftsToShow();
    this.currentPage++;
    if (
      this.nftConfig[this.selectedContract].tokens.length <
      this.currentPage * this.countPerPage
    ) {
      this.collectionLoading = true;
      this.incrementTokenList();
    }
  }
  getPrevious() {
    if (this.currentPage >= 1) {
      this.currentPage--;
    }
  }
  showNftDetails(nft) {
    this.detailsFor = nft;
    this.showDetails = true;
  }
}
