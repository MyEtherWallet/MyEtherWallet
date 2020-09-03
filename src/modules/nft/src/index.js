import configs from './config';
import API from './api';
import NftCollection from './nftCollection';

export default class Nft {
  constructor(environment = {}) {
    this.active = true;
    this.network = environment.network || { type: { name: 'ETH' } };
    this.activeAddress = environment.address;
    this.setAvailableContracts = environment.setAvailableContracts;
    this.web3 = environment.web3;
    this.nftUrl = `${configs.url}getImage`;
    this.openSeaLambdaUrl = configs.url;
    this.nftConfig = {};
    this.selectedContract = '';
    this.detailsFor = {};
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

  setSelectedContract(selectedContract) {
    this.selectedContract = selectedContract;
  }

  getOwnedTokenBasicDetails() {
    return this.ownedTokenBasicDetails;
  }

  hasImage(nft) {
    if (nft.customNft || nft.image === '') {
      return true;
    }
    if (nft.loaded) {
      return true;
    }
  }

  async setup() {
    return new Promise((resolve, reject) => {
      const nftData = {};
      let selectedContract;
      if (this.network.type.name === 'ETH') {
        return this.api.getTokens().then(configData => {
          if (!configData.error) {
            try {
              configData.tokenContracts.forEach(data => {
                nftData[data.contractIdAddress] = new NftCollection({
                  details: data,
                  api: this.api,
                  address: this.activeAddress,
                  web3: this.web3
                });
                this.ownedTokenBasicDetails.push(
                  nftData[data.contractIdAddress].getPanelDetails()
                );
              });
              this.nftConfig = { ...nftData };
              selectedContract = Object.keys(this.nftConfig)[0];
              this.selectedContract = Object.keys(this.nftConfig)[0];
              this.setAvailableContracts(Object.keys(this.nftConfig));
              return resolve(selectedContract);
            } catch (e) {
              reject(e);
            }
          } else {
            reject(configData.error)
          }
        });
      }
      reject(Error('Nft Module is only available on mainnet'))
    });
  }

  async getFirstTokenSet(selectedContract) {
    return new Promise((resolve, reject) => {
      if (!this.nftConfig[selectedContract]) {
        reject(`NFT contract [${selectedContract}] not found for address`);
      }
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
