import {
  ETH_BLOCKS_ROUTE,
  blockGuard,
  myBlocksProps,
  dateSearchGuard
} from './configsRoutes';
const layout = () =>
  import(/* webpackChunkName: "dapp-blocks" */ './TheEthBlocksLayout');
import ModuleEthBlocksMyBlocks from './modules/ModuleEthBlocksMyBlocks';
import ModuleEthBlocksMint from './modules/ModuleEthBlocksMint';
import ModuleEthBlockInfo from './modules/ModuleEthBlockInfo';
import ModuleEthBlocksDateSearch from './modules/ModuleEthBlocksDateSearch';
import ModuleEthBlockBatchMinting from './modules/ModuleEthBlockBatchMinting';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
export default {
  title: 'ETH Blocks',
  subtitle: 'Mint stunning QR art-pieces based on your favorite blocks',
  tag: '#NFT',
  rightIconType: 'mew',
  rightIcon: 'ethBlocks',
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
      path: ETH_BLOCKS_ROUTE.DATE_SEARCH.PATH,
      name: ETH_BLOCKS_ROUTE.DATE_SEARCH.NAME,
      component: ModuleEthBlocksDateSearch,
      beforeEnter: dateSearchGuard
    },
    {
      path: ETH_BLOCKS_ROUTE.BLOCK.PATH,
      name: ETH_BLOCKS_ROUTE.BLOCK.NAME,
      props: true,
      beforeEnter: blockGuard,
      component: ModuleEthBlockInfo
    },
    {
      path: ETH_BLOCKS_ROUTE.BATCH_MINTING.PATH,
      name: ETH_BLOCKS_ROUTE.BATCH_MINTING.NAME,
      props: true,
      component: ModuleEthBlockBatchMinting
    }
  ]
};
