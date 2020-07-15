import {tldSupported, getTld} from './helpers';
const ADDRESS_URL = 'https://nft2.mewapi.io/tokens?owner={{address}}&chain=mainnet';
const ETH_REGISTRAR = '0x00000000'; //place holder, trying to figure out when I should fetch the registrar
export default class NameManager {
  constructor(network, address, web3) {
    this.network = network;
    this.address = address;
    this.web3 = web3;
  }

  searchName(name) {
    return new Promise((resolve, reject) => {
      if (tldSupported(name)) {

      }
      reject(
        new Error(`TLD: ${getTld(name)} is not supported in this network!`)
      );
    });
  }

  async getAllNamesForAddress() {
    // fetch all the names for the address here
    return new Promise((resolve, reject) => {
      const addressFetch = fetch(ADDRESS_URL.replace('{{address}}', this.address)).then(res => {
        return res.json()
      }).catch(reject);

      addressFetch.then(response => {
        const ensResponse = response[ETH_REGISTRAR];
        resolve(ensResponse.map(item => {
          return new ensNameModule(item.name) // something like this. Still needs polish
        }))
      })
    })
  }
}
