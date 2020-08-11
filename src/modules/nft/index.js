import Nft from './src';
export default class NFT {
  constructor({ network, address }) {
    this.network = network;
    this.address = address;
    this.nft =  new Nft({ network: this.network, address: this.address });
  }
  async init(){
    await this.nft.setup();
  }
  selectNftsToShow() {
    return this.nft.selectNftsToShow();
  }
}
