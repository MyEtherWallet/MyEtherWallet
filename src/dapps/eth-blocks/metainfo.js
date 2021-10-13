import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { ETH } from '@/utils/networks/types';
import layout from './TheEthBlocksLayout';
// import stakedRouterGuard from '@/core/router/helpers';
export default {
  title: 'Eth Blocks',
  subtitle: 'Mint stunning QR art-pieces based on your favorite blocks.',
  tag: '#NFT',
  rightIconType: 'mew',
  rightIcon: 'stake',
  name: ROUTES_WALLET.ETH_BLOCKS.NAME,
  path: ROUTES_WALLET.ETH_BLOCKS.PATH,
  networks: [ETH],
  layout,
  meta: {
    noAuth: false
  }
};
