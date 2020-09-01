import Nft from './src';
export default class NFT {
  constructor({ network, address, web3, errorHandler }) {
    this.network = network;
    this.address = address;
    this.web3 = web3;
    this.errorHandler = errorHandler || console.error;
    this.nft = new Nft({
      network: this.network,
      address: this.address,
      tokenSetUpdateHook: this.updateActiveTokenSet.bind(this),
      setAvailableContracts: this.setAvailableContracts.bind(this),
      web3: this.web3,
      errorHandler: this.errorHandler
    });
    this.availableContracts = [];
    this.selectedContract = {};
    this.activeTokenSet = [];
    this.currentActive = '';
    this.currentPageState = '';
    this.activateResolver = '';
    this.ready = false;
  }

  async init(selectedContractOverride) {
    try {
      let selectedContract = await this.nft.setup();
      if (selectedContractOverride) {
        selectedContract = selectedContractOverride;
      }
      this.selectedContract = selectedContract;
      this.currentActive = await this.nft.getFirstTokenSet(selectedContract);
      this.currentPageState = this.currentActive.getPageState();
      this.ready = true;
    } catch (e) {
      this.errorHandler(e);
    }
  }

  get currentActiveContract() {
    return this.currentActive.contract;
  }

  send(to, tokenId) {
    return this.currentActive.send(to, tokenId);
  }

  removeSentNft(tokenId) {
    this.currentActive.removeSentNft(tokenId);
  }

  getAvailableContracts() {
    return this.nft.getOwnedTokenBasicDetails();
  }

  setActiveContract(contractAddress) {
    return new Promise(resolve => {
      // if (!contractAddress) return this.selectedContract;
      if (!this.nft.nftConfig[contractAddress]) {
        this.errorHandler('No NFTs found for contract address');
        resolve();
      }
      this.activateResolver = resolve;
      this.currentActive = this.nft.nftConfig[contractAddress];
      this.nft.nftConfig[contractAddress].activate();
    });
  }

  async getPageValues() {
    try {
      this.currentPageState = await this.currentActive.getPageState();
      return this.currentPageState;
    } catch (e) {
      this.errorHandler(e);
      return {
        name: 'unknown',
        currentPage: 0,
        count: 0,
        tokens: []
      };
    }
  }

  hasNextPage() {
    // if (!this.currentActive) return false;
    try {
      return this.currentActive.hasNextPage();
    } catch (e) {
      this.errorHandler(e);
    }
  }

  async nextPage() {
    try {
      return this.currentActive.getNext();
    } catch (e) {
      this.errorHandler(e);
    }
  }

  priorPage() {
    try {
      return this.currentActive.getPrevious();
    } catch (e) {
      this.errorHandler(e);
    }
  }

  selectNftsToShow() {
    try {
      return this.currentActive.selectNftsToShow();
    } catch (e) {
      this.errorHandler(e);
    }
  }

  updateActiveTokenSet(tokenSet) {
    try {
      if (this.activateResolver) {
        this.activateResolver(tokenSet);
      }
      this.activeTokenSet = tokenSet;
    } catch (e) {
      this.errorHandler(e);
    }


  }

  setAvailableContracts(contracts) {
    this.availableContracts = contracts;
  }
}
