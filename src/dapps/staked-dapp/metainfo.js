import { ETH, GOERLI } from '@/utils/networks/types';
import layout from './TheStakedLayout';
export default {
  title: 'Stake on Eth2',
  subtitle: 'Stake your ETH on Ethereum 2.0 and watch your rewards grow',
  tag: '#DeFi',
  rightIconType: 'mew',
  rightIcon: 'stake',
  path: 'staked',
  networks: [ETH, GOERLI],
  layout
};
