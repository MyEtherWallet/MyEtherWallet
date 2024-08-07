import ENS from './resolvers/ens';
import UNS from './resolvers/uns';
import normalise from '@/core/helpers/normalise';
import { isAddress, toChecksumAddress } from '@/core/helpers/addressUtils.js';
import { ROOTSTOCK, ROOTSTOCKTESTNET } from '@/utils/networks/types';
import { createWeb3Name } from '@web3-name-sdk/core';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export default class NameResolver {
  constructor(network, web3) {
    this.network = network;
    this.web3 = web3;
    this.ens = new ENS(this.network, this.web3);
    this.uns = new UNS();
    this.web3Name = createWeb3Name();
  }
  isValidName(name) {
    const splitName = name.split('.');
    if (splitName.length > 1) {
      name = normalise(name);
      return name.indexOf('.') > 0;
    }
    return false;
  }
  async resolveName(name) {
    if (!this.isValidName(name)) throw new Error('Invalid Address!');
    name = normalise(name);
    let address = await this.ens.resolveName(name);
    if (address === ZERO_ADDRESS) {
      address = await this.uns.resolveName(name);
    }
    if (
      this.network.type.chainID === ROOTSTOCK.chainID ||
      this.network.type.chainID === ROOTSTOCKTESTNET.chainID
    ) {
      address = toChecksumAddress(address);
    }
    if (isAddress(address) && address !== ZERO_ADDRESS) {
      return address;
    }
    throw new Error('Invalid Address!');
  }

  async resolveAddress(address) {
    if (isAddress(address) && address !== ZERO_ADDRESS) {
      const resolvedName = await this.ens.resolveAddress(address);
      if (!resolvedName.name) {
        const unsDomain = await this.uns.resolveAddress(address);
        if (unsDomain) {
          resolvedName.name = unsDomain;
        } else {
          const domainName = await this.web3Name.getDomainName({
            address,
            queryChainIdList: [this.network.type.chainID]
          });
          resolvedName.name = domainName;
        }
      }
      return resolvedName;
    }
  }
}
