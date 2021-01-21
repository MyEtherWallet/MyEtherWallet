import { tldSupported, getTld } from './helpers';

const ADDRESS_URL =
  'https://nft2.mewapi.io/tokens?owner={{address}}&chain=mainnet';
const ETH_REGISTRAR = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85';
import PermanentNameModule from './modules/PermanentNameModule';
import FifsNameModule from './modules/FifsNameModule';

export default class ENSManager {
  constructor(network, address, web3, ens, gasPrice) {
    this.network = network;
    this.address = address;
    this.web3 = web3;
    this.gasPrice = gasPrice;
    if (
      !network.type.hasOwnProperty('ens') &&
      !network.type.ens.hasOwnProperty('registry')
    ) {
      throw new Error('Network does not support ENS!');
    }
    this.ens = ens;
  }

  searchName(name) {
    return new Promise((resolve, reject) => {
      if (tldSupported(this.network, name)) {
        switch (this.network.type.ens.registrarType) {
          case 'permanent':
            resolve(
              new PermanentNameModule(
                name,
                this.address,
                this.network,
                this.web3,
                this.ens,
                this.gasPrice
              )
            );
            break;
          case 'fifs':
            resolve(
              new FifsNameModule(
                name,
                this.address,
                this.network,
                this.web3,
                this.ens,
                this.gasPrice
              )
            );
            break;
          default:
            reject(
              new Error(
                `TLD: ${getTld(name)} is not supported in this network!`
              )
            );
        }
      }
      reject(
        new Error(`TLD: ${getTld(name)} is not supported in this network!`)
      );
    });
  }

  async getAllNamesForAddress() {
    // fetch all the names for the address here
    return new Promise((resolve, reject) => {
      const addressFetch = fetch(
        ADDRESS_URL.replace('{{address}}', this.address)
      )
        .then(res => {
          return res.json();
        })
        .catch(reject);

      addressFetch.then(response => {
        const ensResponse = response[ETH_REGISTRAR];
        resolve(
          ensResponse.tokens.map(item => {
            return new PermanentNameModule(
              item.name,
              this.address,
              this.network,
              this.web3,
              this.ens
            );
          })
        );
      });
    });
  }
}
