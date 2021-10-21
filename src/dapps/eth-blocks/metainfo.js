import { ETH_BLOCKS_ROUTE, blockGuard } from './configsRoutes';
import { ETH } from '@/utils/networks/types';
import layout from './TheEthBlocksLayout';
import ModuleEthBlocksMyBlocks from './modules/ModuleEthBlocksMyBlocks';
import ModuleEthBlocksMint from './modules/ModuleEthBlocksMint';
import ModuleEthBlockInfo from './modules/ModuleEthBlockInfo';

export default {
  title: 'ETH Blocks',
  subtitle: 'Mint stunning QR art-pieces based on your favorite blocks.',
  tag: '#NFT',
  rightIconType: 'mew',
  rightIcon: 'stake',
  path: ETH_BLOCKS_ROUTE.CORE.PATH,
  networks: [ETH],
  layout,
  defaultName: ETH_BLOCKS_ROUTE.CORE.NAME,
  meta: {
    noAuth: false
  },
  children: [
    {
      name: ETH_BLOCKS_ROUTE.CORE.NAME,
      path: '', //selected tab by default
      component: ModuleEthBlocksMint
    },
    {
      path: ETH_BLOCKS_ROUTE.MY_BLOCKS.PATH,
      name: ETH_BLOCKS_ROUTE.MY_BLOCKS.NAME,
      component: ModuleEthBlocksMyBlocks
    },
    {
      path: ETH_BLOCKS_ROUTE.BLOCK.PATH,
      name: ETH_BLOCKS_ROUTE.BLOCK.NAME,
      props: true,

      beforeEnter: blockGuard,
      component: ModuleEthBlockInfo
    }
  ]
};
