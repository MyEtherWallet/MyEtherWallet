/* eslint-disable */
import Maker, { USD, DAI } from '@makerdao/dai';
import McdPlugin, { ETH, MKR } from '@makerdao/dai-plugin-mcd';
import configPlugin from '@makerdao/dai-plugin-config';
import networkConfig from './references/config';
import { networkNameToId } from './utils/network';
import MewPlugin from 'mew-maker-plugin';

let _maker;

export function getMaker() {
  if (_maker === undefined) throw new Error('Maker has not been instatiated');
  return _maker;
}

export async function instantiateMaker({
                                         web3,
                                         network,
                                         testchainId,
                                         backendEnv
                                       }) {
  const mcdPluginConfig = {
    network: network === 'test' ? 'testnet' : network,
    prefetch: false
  };

  const config = {
    log: false,
    plugins: [[McdPlugin, mcdPluginConfig], MewMakerPlugin],
    smartContract: {
      addContracts: {}
    },
    provider: { inject: web3.currentProvider },
    web3: {
      pollingInterval: network === 'testnet' ? 100 : null
    },
    multicall: true
  };
  //
  // // Use the config plugin, if we have a testchainConfigId
  // if (testchainId) {
  //   delete config.provider;
  //   config.plugins.push([configPlugin, { testchainId, backendEnv }]);
  // } else if (!rpcUrl) {
  //   rpcUrl = networkConfig.rpcUrls[networkNameToId(network)];
  //   if (!rpcUrl) throw new Error(`Unsupported network: ${network}`);
  //   config.provider.url = rpcUrl;
  // }

  const maker = await Maker.create('inject', config);

  // for debugging
  window.maker = maker;

  return maker;
}

export { USD, DAI, MKR, ETH };
