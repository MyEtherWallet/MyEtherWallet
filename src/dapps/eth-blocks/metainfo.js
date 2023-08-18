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
    noAuth: false,
    title: 'ETH Blocks NFT Collection From MyEtherWallet | Mint NFTs',
    description:
      'Mint your favorite Ethereum block as a commemorative NFT. ETH Blocks is the original NFT collection from MEW.'
  },
  children: [
    {
      name: ETH_BLOCKS_ROUTE.CORE.NAME,
      path: '', //selected tab by default
      component: ModuleEthBlocksMint,
      meta: {
        noAuth: false,
        title: 'ETH Blocks NFT Collection From MyEtherWallet | Mint NFTs',
        description:
          'Mint your favorite Ethereum block as a commemorative NFT. ETH Blocks is the original NFT collection from MEW.'
      }
    },
    {
      path: ETH_BLOCKS_ROUTE.MY_BLOCKS.PATH,
      name: ETH_BLOCKS_ROUTE.MY_BLOCKS.NAME,
      component: ModuleEthBlocksMyBlocks,
      props: myBlocksProps,
      meta: {
        noAuth: false,
        title: 'View Your ETH Blocks NFTs | MyEtherWallet NFT Collection',
        description:
          'View your ETH Blocks on MyEtherWallet. Own a piece of Ethereum history.'
      }
    },
    {
      path: ETH_BLOCKS_ROUTE.DATE_SEARCH.PATH,
      name: ETH_BLOCKS_ROUTE.DATE_SEARCH.NAME,
      component: ModuleEthBlocksDateSearch,
      beforeEnter: dateSearchGuard,
      meta: {
        noAuth: false,
        title: 'ETH Blocks NFT Collection From MyEtherWallet | Mint NFTs',
        description:
          'Mint your favorite Ethereum block as a commemorative NFT. ETH Blocks is the original NFT collection from MEW.'
      }
    },
    {
      path: ETH_BLOCKS_ROUTE.BLOCK.PATH,
      name: ETH_BLOCKS_ROUTE.BLOCK.NAME,
      props: true,
      beforeEnter: blockGuard,
      component: ModuleEthBlockInfo,
      meta: {
        noAuth: false,
        title: 'ETH Blocks NFT Collection From MyEtherWallet | Mint NFTs',
        description:
          'Mint your favorite Ethereum block as a commemorative NFT. ETH Blocks is the original NFT collection from MEW.'
      }
    },
    {
      path: ETH_BLOCKS_ROUTE.BATCH_MINTING.PATH,
      name: ETH_BLOCKS_ROUTE.BATCH_MINTING.NAME,
      props: true,
      component: ModuleEthBlockBatchMinting,
      meta: {
        noAuth: false,
        title: 'Mint Batch NFTs | ETH Block NFTs by MEW',
        description:
          'Want to mint several NFTs by MyEtherWallet all at once? NFT batch minting is found here.'
      }
    }
  ]
};
