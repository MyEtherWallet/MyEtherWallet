export default class NameManager {
  constructor(network, address) {
    this.network = network;
    this.address = address;
  }

  search(name) {
    return new Promise((resolve, reject) => {
      if (this.tldSupported(name)) {
      }
      reject(
        new Error(`TLD: ${this.getTld(name)} is not supported in this network!`)
      );
    });
  }

  tldSupported(network, name) {
    if (network.hasOwnProperty('ens')) {
      const tld = this.getTld(name);
      const isSupported = network.type.ens.supportedTld.find(item => {
        return tld === item;
      });

      return isSupported ? true : false;
    }
    return false;
  }

  getTld(name) {
    const splitName = name.split('.');

    return splitName[splitName.length - 1];
  }
}
