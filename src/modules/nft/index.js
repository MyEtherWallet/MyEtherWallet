import Nft from './src';

export default class NFT {
  constructor({ network, address, web3 }) {
    this.network = network;
    this.address = address;
    this.web3 = web3;
    this.nft = new Nft({
      network: this.network,
      address: this.address,
      setAvailableContracts: this.setAvailableContracts.bind(this),
      web3: this.web3
    });
    this.availableContracts = [];
    this.selectedContract = {};
    this.currentActive = '';
    this.currentPageState = '';
    this.ready = false;
  }

  init(selectedContractOverride) {
    return new Promise((resolve, reject) => {
      try {
        this.nft
          .setup()
          .then(selectedContract => {
            if (selectedContractOverride) {
              selectedContract = selectedContractOverride;
            }
            this.selectedContract = selectedContract;
            return this.nft.getFirstTokenSet(selectedContract);
          })
          .then(currentActive => {
            this.currentActive = currentActive;
            this.currentPageState = this.currentActive.getPageState();
            this.ready = true;
            resolve(this.currentPageState);
          })
          .catch(reject);
      } catch (e) {
        reject(e);
      }
    });
  }

  get currentActiveContract() {
    return this.currentActive.contract;
  }

  send(to, tokenId) {
    return this.currentActive.send(to, tokenId);
  }

  sendData(to, tokenId){
    return this.currentActive.sendData(to, tokenId);
  }

  txFeeETH(gasLimit, gasPrice){
    return this.currentActive.txFeeETH(gasLimit, gasPrice)
  }

  txFeeUSD(gasLimit, ethPrice, gasPrice){
    return this.currentActive.txFeeUSD(gasLimit, ethPrice, gasPrice)
  }

  removeSentNft(tokenId) {
    this.currentActive.removeSentNft(tokenId);
  }

  getTokenCount(){
    return this.currentActive.getTokenCount();
  }

  getAvailableContracts() {
    return this.nft.getOwnedTokenBasicDetails();
  }

  setActiveContract(contractAddress) {
    return new Promise((resolve, reject) => {
      if (!this.nft.nftConfig[contractAddress]) {
        reject(Error(''));
      }
      this.currentActive = this.nft.nftConfig[contractAddress];
      resolve(this.nft.nftConfig[contractAddress].activate());
    });
  }

  getActiveName(){
    return this.currentActive.name;
  }

  getPageValues() {
    return this.currentActive.getPageState().catch(() => {
      return {
        name: 'unknown',
        currentPage: 0,
        count: 0,
        tokens: []
      };
    });
  }

  hasPages(){
    return this.currentActive.countPerPage < this.currentActive.getTokenCount();
  }

  hasNextPage() {
    return this.currentActive.hasNextPage();
  }

  async nextPage() {
    if (this.currentActive.hasNextPage()) {
      return new Promise((resolve, reject) => {
        this.currentActive.getNext().then(resolve).catch(reject);
      });
    }
    return Promise.resolve();
  }

  priorPage() {
    return this.currentActive.getPrevious();
  }

  selectNftsToShow() {
    return this.currentActive.selectNftsToShow();
  }

  setAvailableContracts(contracts) {
    this.availableContracts = contracts;
  }

  getImageUrl(tokenId, contract) {
    if (!contract) contract = this.currentActive.contract;
    return this.currentActive.getImageUrl(contract, tokenId);
  }
}
