import { ETH_BLOCKS_ROUTE, blockGuard, myBlocksProps } from './configsRoutes';
import layout from './TheStakewiseLayout';
import ModuleEthBlocksMyBlocks from './modules/ModuleEthBlocksMyBlocks';
import ModuleEthBlocksMint from './modules/ModuleEthBlocksMint';
import ModuleEthBlockInfo from './modules/ModuleEthBlockInfo';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
export default {
  title: 'Stakewise',
  subtitle: 'Stake any amount of ETH and begin earning rewards.',
  tag: '#NFT',
  rightIconType: 'mew',
  rightIcon: 'stakewise',
  path: ETH_BLOCKS_ROUTE.CORE.PATH,
  networks: SUPPORTED_NETWORKS,
  layout,
  release: '11/11/2021',
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
      component: ModuleEthBlocksMyBlocks,
      props: myBlocksProps
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
