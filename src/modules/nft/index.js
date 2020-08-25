import Nft from './src';
export default class NFT {
  constructor({ network, address }) {
    this.network = network;
    this.address = address;
    this.nft = new Nft({
      network: this.network,
      address: this.address,
      tokenSetUpdateHook: this.updateActiveTokenSet.bind(this)
    });
    this.activeTokenSet = [];
  }
  async init(selectedContractOverride) {
    let selectedContract = await this.nft.setup();
    if (selectedContractOverride) {
      selectedContract = selectedContractOverride;
    }
    await this.nft.getFirstTokenSet(selectedContract);
  }
  selectNftsToShow() {
    return this.nft.selectNftsToShow();
  }

  setSelectedContract(contractAddress) {
    this.nft.setSelectedContract(contractAddress);
  }

  updateActiveTokenSet(tokenSet) {
    this.activeTokenSet = tokenSet;
  }

  incrementPage() {
    return this.nft.getNext();
  }
}
