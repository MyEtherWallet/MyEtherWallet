import configs from './config';
import API from './api';
import NftCollection from './nftCollection';
import Vue from 'vue';

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

  async setup() {
    return new Promise((resolve, reject) => {
      const nftData = {};
      let selectedContract;
      if (this.network.type.name === configs.mainnet) {
        return this.api.getTokens().then(configData => {
          if (!configData.error) {
            try {
              const getDetails = async () => {
                for (let i = 0; i < configData.tokenContracts.length; i++) {
                  const data = configData.tokenContracts[i];
                  const details = await this.api.getContractDetails(
                    data.contractIdAddress
                  );
                  if (details.tokenContracts) {
                    if (Array.isArray(details.tokenContracts)) {
                      try {
                        data.name = details.tokenContracts[0].name;
                      } catch (e) {
                        data.name = 'Unknown Nft';
                      }
                    }
                  } else {
                    data.name = details.name;
                  }
                  nftData[data.contractIdAddress] = new NftCollection({
                    details: data,
                    api: this.api,
                    address: this.activeAddress,
                    web3: this.web3,
                    apollo: this.apollo
                  });
                  this.ownedTokenBasicDetails.push(
                    nftData[data.contractIdAddress].getPanelDetails()
                  );
                }
                return nftData;
              };
              getDetails().then(res => {
                this.nftConfig = { ...res };
                selectedContract = Object.keys(this.nftConfig)[0];
                this.selectedContract = Object.keys(this.nftConfig)[0];
                this.setAvailableContracts(Object.keys(this.nftConfig));
                return resolve(selectedContract);
              });
            } catch (e) {
              reject(e);
            }
          } else {
            reject(configData.error);
          }
        });
      }
      reject(
        Error(
          Vue.$i18n
            ? Vue.$i18n.t('nftManager.no-nfts-for-address')
            : 'Nft Module is only available on mainnet'
        )
      );
    });
  }

  async getFirstTokenSet(selectedContract) {
    return new Promise((resolve, reject) => {
      if (!this.nftConfig[selectedContract]) {
        reject(
          Vue.$i18n
            ? Vue.$i18n.t('nftManager.no-nfts-for-address', {
                selectedContract
              })
            : `NFT contract [${selectedContract}] not found for address`
        );
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
