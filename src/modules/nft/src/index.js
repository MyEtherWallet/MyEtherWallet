import utils from 'web3-utils';
import configs from './config';
import API from './api';
import NftCollection from './nftCollection';

// const endPointUrl = 'https://localhost:3000/local'

export default class Nft {
  constructor(environment = {}) {
    this.active = true;
    this.network = environment.network || { type: { name: 'ETH' } };
    this.activeAddress = environment.address;
    this.tokenSetUpdateHook = environment.tokenSetUpdateHook;
    this.nftUrl = `${configs.url}getImage`;
    this.openSeaLambdaUrl = configs.url;
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

    this.api = new API({
      url: this.openSeaLambdaUrl,
      address: this.activeAddress
    });
  }

  static async init(environment) {
    const create = new Nft(environment);
    await create.setup();
    return create;
  }

  //======================================================================
  setSelectedContract(selectedContract) {
    this.selectedContract = selectedContract;
  }

  async getActiveTokenSet(selectedContract) {
    if (!this.nftConfig[selectedContract].initialSetRetrieved) {
      await this.nftConfig[selectedContract].getNftDetails();
    }
    return this.nftConfig[selectedContract];
  }

  getActiveTokenSetSync(selectedContract) {
    if (!this.nftConfig[selectedContract].initialSetRetrieved) {
      this.nftConfig[selectedContract].getNftDetails();
    }
    return this.nftConfig[selectedContract];
  }

  selectNftsToShow() {
    try {
      if (this.nftConfig[this.selectedContract]) {
        return this.nftConfig[this.selectedContract].selectNftsToShow();
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
  async getNftDetails(
    contract,
    startIndex = -1,
    endIndex = -1,
    preFetch = false
  ) {
    if (!preFetch) this.fetchingOwnedTokens = true;
    return this.nftConfig[contract].getNftDetails(
      contract,
      startIndex,
      endIndex,
      preFetch
    );
    //
    // let params;
    // if (startIndex >= 0 && endIndex >= 0) {
    //   params = {
    //     address: this.activeAddress,
    //     contractAddresses: this.nftConfig[contract].contracts,
    //     startIndex,
    //     endIndex
    //   };
    // } else {
    //   params = {
    //     address: this.activeAddress,
    //     contractAddresses: this.nftConfig[contract].contracts
    //   };
    // }
    //
    // const tokenParse = item => {
    //   return {
    //     description: item.description,
    //     name: item.name,
    //     token_id: item.token_id,
    //     contract: item.contract
    //   };
    // };
    //
    // return await this.api.getNftDetailsApi(contract, params).then(data => {
    //   let allTokens = [];
    //   allTokens = data.tokens.map(tokenParse);
    //
    //   if (!preFetch) this.fetchingOwnedTokens = false;
    //   this.nftConfig[contract].tokens = allTokens;
    //   return allTokens;
    // });
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

  async setup() {
    const nftData = {};
    let selectedContract;
    if (this.network.type.name === 'ETH') {
      const configData = await this.api.getTokens();
      if (!configData.error) {
        configData.tokenContracts.forEach(data => {
          nftData[data.contractIdAddress] = new NftCollection({
            details: data,
            api: this.api,
            address: this.activeAddress
          });

          // if (nftData[data.contractIdAddress]) {
          //   nftData[data.contractIdAddress].contract = data.contractIdAddress;
          //   nftData[data.contractIdAddress].count = data.owned_asset_count;
          //   nftData[data.contractIdAddress].startIndex = 0;
          //   nftData[data.contractIdAddress].priorIndex = 0;
          //   nftData[data.contractIdAddress].currentIndex = 0;
          //   nftData[data.contractIdAddress].loadedTo = 0;
          // }
        });
        this.nftConfig = { ...nftData };
        selectedContract = Object.keys(this.nftConfig)[0];
        this.selectedContract = Object.keys(this.nftConfig)[0];

        this.reLoading = false;
        this.countsRetrieved = true;
        return selectedContract;
      }
    }
  }

  async getFirstTokenSet(selectedContract) {
    return new Promise(resolve => {
      this.nftConfig[this.selectedContract]
        .getNftDetails(selectedContract)
        .then(() => {
          // this.nftConfig[this.selectedContract].tokens = result;
          this.nftConfig[this.selectedContract]
            .getNftDetails(selectedContract, 9, 18, true)
            .then(() => {
              // this.nftConfig[selectedContract].tokens = result;
              resolve();
            });
        });
    });
  }

  // async getNftsToShow() {
  //   this.nftToShowList = this.selectNftsToShow();
  // }
  // incrementTokenList() {
  //   const startIndex = this.currentPage * this.countPerPage - this.countPerPage;
  //   const endIndex = this.currentPage * this.countPerPage;
  //   const selectedContract = this.selectedContract;
  //   return this.getNftDetails(selectedContract, startIndex, endIndex).then(
  //     result => {
  //       this.nftConfig[selectedContract].tokens = result;
  //       console.log(
  //         'this.nftConfig[selectedContract]',
  //         this.nftConfig[selectedContract]
  //       ); // todo remove dev item
  //       this.collectionLoading = false;
  //       this.tokenSetUpdateHook(this.selectNftsToShow());
  //       return this.selectNftsToShow();
  //     }
  //   );
  // }
  getNext() {
    return this.nftConfig[this.selectedContract].getNext();
    // this.getNftsToShow();
    // this.currentPage++;
    // if (
    //   this.nftConfig[this.selectedContract].tokens.length <
    //   this.currentPage * this.countPerPage
    // ) {
    //   this.collectionLoading = true;
    //   return this.incrementTokenList();
    // }
  }
  getPrevious() {
    return this.nftConfig[this.selectedContract].getPrevious();
    // if (this.currentPage >= 1) {
    //   this.currentPage--;
    // }
  }
  showNftDetails(nft) {
    this.detailsFor = nft;
    this.showDetails = true;
  }
}
