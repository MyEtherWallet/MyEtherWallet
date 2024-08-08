import NameResolver from '@enkryptcom/name-resolution';

import normalise from '@/core/helpers/normalise';
import { isAddress, toChecksumAddress } from '@/core/helpers/addressUtils.js';
import { ROOTSTOCK, ROOTSTOCKTESTNET } from '@/utils/networks/types';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export default class Resolver {
  constructor(network) {
    this.network = network;
    this.resolver = new NameResolver({
      ens: {
        node: 'https://nodes.mewapi.io/rpc/eth'
      },
      sid: {
        node: {
          bnb: 'https://nodes.mewapi.io/rpc/bsc',
          arb: 'https://nodes.mewapi.io/rpc/arb'
        }
      }
    });
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
    let address = await this.resolver.resolveAddress(
      name,
      this.network.type.ensEnkryptType
    );
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
      const resolvedName = await this.resolver.resolveReverseName(address);
      return resolvedName;
    }
  }
}
