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
          .catch(reject)
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

  removeSentNft(tokenId) {
    this.currentActive.removeSentNft(tokenId);
  }

  getAvailableContracts() {
    return this.nft.getOwnedTokenBasicDetails();
  }

  setActiveContract(contractAddress) {
    return new Promise((resolve, reject) => {
      if (!this.nft.nftConfig[contractAddress]) {
        reject(Error('No NFTs found for contract address'));
      }
      this.currentActive = this.nft.nftConfig[contractAddress];
      resolve(this.nft.nftConfig[contractAddress].activate());
    });
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

  hasNextPage() {
    return this.currentActive.hasNextPage();
  }

  async nextPage() {
    return new Promise((resolve, reject) => {
      this.currentActive.getNext().then(resolve).catch(reject);
    });
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
}
