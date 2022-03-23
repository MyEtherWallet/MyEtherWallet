import Configs from './configs';

const stakewise = {
  localStore: true,
  stakewiseTxs: { ETH: [], GOERLI: [] },
  validatorApr: '0',
  poolSupply: '0',
  stakingFee: '0',
  stateVersion: Configs.VERSION.stakewise
};

export default stakewise;
