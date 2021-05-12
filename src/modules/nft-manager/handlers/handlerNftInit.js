import configs from './config/configNft';
import API from './handlerApi';
// import NftCollection from './handlerNftCollection';
// import Vue from 'vue';

export default class Nft {
  constructor(environment = {}) {
    this.active = true;
    this.network = environment.network || { type: { name: configs.mainnet } };
    this.activeAddress = environment.address;
    this.setAvailableContracts = environment.setAvailableContracts;
    this.web3 = environment.web3;
    this.apollo = environment.apollo;
    this.openSeaLambdaUrl = configs.url;
    this.nftConfig = {};
    this.selectedContract = '';
    this.detailsFor = {};
    this.ownedTokenBasicDetails = [];

    this.api = new API({
      url: this.openSeaLambdaUrl,
      address: this.activeAddress,
      apollo: this.apollo
    });
  }

  static init(environment) {
    const create = new Nft(environment);
    return create.setup();
  }

  setSelectedContract(selectedContract) {
    this.selectedContract = selectedContract;
  }

  getOwnedTokenBasicDetails() {
    return this.ownedTokenBasicDetails;
  }

  async getFirstTokenSet(selectedContract) {
    return new Promise(resolve => {
      // if (!this.nftConfig[selectedContract]) {
      //   reject(
      //     Vue.$i18n
      //       ? Vue.$i18n.t('nftManager.none-owned', {
      //           selectedContract
      //         })
      //       : `NFT contract [${selectedContract}] not found for address`
      //   );
      // }
      this.nftConfig[selectedContract]
        .getNftDetails(selectedContract)
        .then(() => {
          if (this.nftConfig[selectedContract].count > 9) {
            this.nftConfig[selectedContract]
              .getNftDetails(selectedContract, 9, 18, true)
              .then(() => {
                resolve(this.nftConfig[selectedContract]);
              });
          } else {
            resolve(this.nftConfig[selectedContract]);
          }
        });
    });
  }

  getNext() {
    return this.nftConfig[this.selectedContract].getNext();
  }
  getPrevious() {
    return this.nftConfig[this.selectedContract].getPrevious();
  }
}
