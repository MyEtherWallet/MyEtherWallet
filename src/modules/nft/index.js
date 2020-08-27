import Nft from './src';
export default class NFT {
  constructor({ network, address }) {
    this.network = network;
    this.address = address;
    this.nft = new Nft({
      network: this.network,
      address: this.address,
      tokenSetUpdateHook: this.updateActiveTokenSet.bind(this),
      setAvailableContracts: this.setAvailableContracts.bind(this)
    });

    this.availableContracts = [];
    this.selectedContract = {};
    this.activeTokenSet = [];
    this.currentActive = '';
    this.currentPageState = '';
    this.onDeckTokenSet = [];
    this.loading = false;
  }

  async init(selectedContractOverride) {
    let selectedContract = await this.nft.setup();
    if (selectedContractOverride) {
      selectedContract = selectedContractOverride;
    }
    this.selectedContract = selectedContract;
    this.loading = true;
    this.currentActive = await this.nft.getFirstTokenSet(selectedContract);
    this.currentPageState = this.currentActive.getPageState();
    this.loading = false;
  }

  // isReady() {
  //   return new Promise(resolve => {
  //     this.readyPromise = resolve;
  //   });
  // }

  getAvailableContracts() {
    return this.availableContracts;
  }

  async setActiveContract(contractAddress) {
    if (!contractAddress) return this.selectedContract;
    this.loading = true;
    this.currentActive = await this.nft.getActiveTokenSet(contractAddress);
    this.loading = false;
    console.log('setActiveContract', this.currentActive.name, this.activeTokenSet.length); // todo remove dev item
    this.selectedContract = contractAddress;
    return this.selectedContract;
  }

  getPageValues() {
    if (!this.loading) {
      this.currentPageState = this.currentActive.getPageState();
      this.activeTokenSet = this.currentPageState.tokens;
    }
    console.log('getPageValues', this.currentActive.name, this.activeTokenSet.length); // todo remove dev item
    return this.currentPageState;
  }

  async nextPage(){
    return this.currentActive.getNext();
  }

  priorPage(){
    this.currentActive.getPrevious();
  }

  selectNftsToShow() {
    return this.nft.selectNftsToShow();
  }

  switchToTokenSet(contractAddress) {
    this.nft.getActiveTokenSet(contractAddress);
  }

  getActiveContract(contractAddress) {
    this.currentActive = this.nft.getActiveTokenSet(contractAddress);
    return this.nft.getActiveTokenSet(contractAddress);
  }

  setSelectedContract(contractAddress) {
    this.nft.setSelectedContract(contractAddress);
  }

  updateActiveTokenSet(tokenSet) {
    this.activeTokenSet = tokenSet;
  }

  setAvailableContracts(contracts) {
    this.availableContracts = contracts;
  }

  incrementPage() {
    return this.nft.getNext();
  }
}
