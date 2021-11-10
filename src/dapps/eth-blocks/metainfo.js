import { ETH_BLOCKS_ROUTE, blockGuard } from './configsRoutes';
import layout from './TheEthBlocksLayout';
import ModuleEthBlocksMyBlocks from './modules/ModuleEthBlocksMyBlocks';
import ModuleEthBlocksMint from './modules/ModuleEthBlocksMint';
import ModuleEthBlockInfo from './modules/ModuleEthBlockInfo';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
export default {
  title: 'ETH Blocks',
  subtitle: 'Mint stunning QR art-pieces based on your favorite blocks.',
  tag: '#NFT',
  rightIconType: 'mew',
  rightIcon: 'ethBlocks',
  path: ETH_BLOCKS_ROUTE.CORE.PATH,
  networks: SUPPORTED_NETWORKS,
  isNew: true,
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
      name: ETH_BLOCKS_ROUTE.MINT.NAME,
      path: ETH_BLOCKS_ROUTE.MINT.PATH,
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
