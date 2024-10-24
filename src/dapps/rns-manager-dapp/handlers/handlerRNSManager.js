import { ethers, BigNumber, Contract, utils, constants } from 'ethers';
import NameResolver from '@enkryptcom/name-resolution';

import { RSKRegistrar } from './helpers/rskRegistrar';

// Reverse Lookup
const ROOTSTOCK_RPC_NODE = 'https://public-node.rsk.co';

// REF: https://developers.rsk.co/rif/rns/architecture/registry/
const RNS_REGISTRY_ADDRESS = '0xcb868aeabd31e2b66f74e9a55cf064abb31a4ad5';

const stripHexPrefix = hex => hex.slice(2);

const RNS_REGISTRY_ABI = [
  'function resolver(bytes32 node) public view returns (address)'
];

const rskOwnerAddress = '0x45d3e4fb311982a06ba52359d44cb4f5980e0ef1';
const fifsAddrRegistrarAddress = '0xd9c79ced86ecf49f5e4a973594634c83197c35ab';
const rifTokenAddress = '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5';

export default class RNSManager {
  constructor(signer) {
    const rskRegistrar = new RSKRegistrar(
      rskOwnerAddress,
      fifsAddrRegistrarAddress,
      rifTokenAddress,
      signer
    );

    this.rskRegistrar = rskRegistrar;
    this.RNSProvider = new ethers.providers.JsonRpcProvider(ROOTSTOCK_RPC_NODE);
    this.rnsRegistryContract = new Contract(
      RNS_REGISTRY_ADDRESS,
      RNS_REGISTRY_ABI,
      this.RNSProvider
    );
  }

  searchName(name) {
    return this.rskRegistrar.available(name);
  }

  async fetchPrice(name, duration) {
    const price = await this.rskRegistrar.price(name, BigNumber.from(duration));
    return { bn: price, eth: ethers.utils.formatEther(price) };
  }

  async resolveReverseName(address) {
    const reverseRecordHash = utils.namehash(
      `${stripHexPrefix(address)}.addr.reverse`
    );
    const resolverAddress = await this.rnsRegistryContract.resolver(
      reverseRecordHash
    );

    if (resolverAddress === constants.AddressZero) {
      return null;
    }

    const nameResolverContract = new NameResolver({
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

    const name = await nameResolverContract.resolveReverseName(
      reverseRecordHash
    );

    if (name === undefined) {
      return null;
    }

    return name;
  }
}
