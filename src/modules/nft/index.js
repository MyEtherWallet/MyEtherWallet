import Nft from './src';
export default class NFT {
  constructor({ network, address, web3 }) {
    this.network = network;
    this.address = address;
    this.web3 = web3;
    this.nft = new Nft({
      network: this.network,
      address: this.address,
      tokenSetUpdateHook: this.updateActiveTokenSet.bind(this),
      setAvailableContracts: this.setAvailableContracts.bind(this),
      web3: this.web3
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
    let selectedContract = await this.nft.setup();
    if (selectedContractOverride) {
      selectedContract = selectedContractOverride;
    }
    this.selectedContract = selectedContract;
    this.currentActive = await this.nft.getFirstTokenSet(selectedContract);
    this.currentPageState = this.currentActive.getPageState();
    this.ready = true;
  }

  get currentActiveContract(){
    return this.currentActive.contract
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
      if (!contractAddress) return this.selectedContract;
      this.activateResolver = resolve;
      this.currentActive = this.nft.nftConfig[contractAddress];
      this.nft.nftConfig[contractAddress].activate();
    });
  }

  async getPageValues() {
    this.currentPageState = await this.currentActive.getPageState();
    return this.currentPageState;
  }

  hasNextPage() {
    return this.currentActive.hasNextPage();
  }

  async nextPage() {
    return this.currentActive.getNext();
  }

  priorPage() {
    this.currentActive.getPrevious();
  }

  selectNftsToShow() {
    return this.currentActive.selectNftsToShow();
  }

  updateActiveTokenSet(tokenSet) {
    if (this.activateResolver) {
      this.activateResolver(tokenSet);
    }
    this.activeTokenSet = tokenSet;
  }

  setAvailableContracts(contracts) {
    this.availableContracts = contracts;
  }
}
