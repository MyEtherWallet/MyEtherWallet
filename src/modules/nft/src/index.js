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
    this.setAvailableContracts = environment.setAvailableContracts;
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
    this.ownedTokenBasicDetails = [];

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

  getOwnedTokenBasicDetails(){
  return this.ownedTokenBasicDetails;
  }

  async getActiveTokenSet(selectedContract) {
    if (
      !this.nftConfig[selectedContract].initialSetRetrieved ||
      this.nftConfig[selectedContract].tokens.length === 0
    ) {
      await this.nftConfig[selectedContract].getNftDetails();
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
          this.ownedTokenBasicDetails.push({
            name: data.name,
            count: data.owned_asset_count,
            contract: data.contractIdAddress
          });
          nftData[data.contractIdAddress] = new NftCollection({
            details: data,
            api: this.api,
            address: this.activeAddress
          });
        });
        this.nftConfig = { ...nftData };
        selectedContract = Object.keys(this.nftConfig)[0];
        this.selectedContract = Object.keys(this.nftConfig)[0];
        this.setAvailableContracts(Object.keys(this.nftConfig));
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
          this.nftConfig[this.selectedContract]
            .getNftDetails(selectedContract, 9, 18, true)
            .then(() => {
              resolve(this.nftConfig[this.selectedContract]);
            });
        });
    });
  }

  getNext() {
    return this.nftConfig[this.selectedContract].getNext();
  }
  getPrevious() {
    return this.nftConfig[this.selectedContract].getPrevious();
  }
  showNftDetails(nft) {
    this.detailsFor = nft;
    this.showDetails = true;
  }
}
