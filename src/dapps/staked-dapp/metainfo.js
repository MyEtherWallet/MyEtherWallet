import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { SUPPORTED_NETWORKS } from './handlers/supportedNetworks';
const layout = () =>
  import(/* webpackChunkName: "dapp-staked" */ './TheStakedLayout');
import { stakedRouterGuard } from '@/core/router/helpers';
export default {
  title: 'Staked',
  subtitle: '',
  description: 'Stake full validators with 32 ETH or more',
  tag: '#DeFi',
  staking: true,
  rightIconType: 'mew',
  rightIcon: 'stake',
  name: ROUTES_WALLET.STAKED.NAME,
  path: ROUTES_WALLET.STAKED.PATH,
  networks: SUPPORTED_NETWORKS,
  layout,
  release: '05/4/2023',
  meta: {
    noAuth: false,
    title: 'Stake Your Ethereum | Full Validator Staking | MyEtherWallet',
    description:
      'Earn rewards on your Ethereum with Staking. Help secure the Ethereum network and earn crypto.'
  },
  children: [
    {
      path: ROUTES_WALLET.STAKED_STATUS.PATH,
      name: ROUTES_WALLET.STAKED_STATUS.NAME,
      beforeEnter: stakedRouterGuard,
      meta: {
        noAuth: false,
        title: 'Stake Your Ethereum | Full Validator Staking | MyEtherWallet',
        description:
          'Earn rewards on your Ethereum with Staking. Help secure the Ethereum network and earn crypto.'
      }
    },
    {
      path: ROUTES_WALLET.STAKED_1.PATH,
      name: ROUTES_WALLET.STAKED_1.NAME,
      beforeEnter: stakedRouterGuard,
      meta: {
        noAuth: false,
        title: 'Stake Your Ethereum | Full Validator Staking | MyEtherWallet',
        description:
          'Earn rewards on your Ethereum with Staking. Help secure the Ethereum network and earn crypto.'
      }
    },
    {
      path: ROUTES_WALLET.STAKED_2.PATH,
      name: ROUTES_WALLET.STAKED_2.NAME,
      beforeEnter: stakedRouterGuard,
      meta: {
        noAuth: false,
        title: 'Stake Your Ethereum | Full Validator Staking | MyEtherWallet',
        description:
          'Earn rewards on your Ethereum with Staking. Help secure the Ethereum network and earn crypto.'
      }
    },
    {
      path: ROUTES_WALLET.STAKED_3.PATH,
      name: ROUTES_WALLET.STAKED_3.NAME,
      beforeEnter: stakedRouterGuard,
      meta: {
        noAuth: false,
        title: 'Stake Your Ethereum | Full Validator Staking | MyEtherWallet',
        description:
          'Earn rewards on your Ethereum with Staking. Help secure the Ethereum network and earn crypto.'
      }
    },
    {
      path: ROUTES_WALLET.STAKED_4.PATH,
      name: ROUTES_WALLET.STAKED_4.NAME,
      beforeEnter: stakedRouterGuard,
      meta: {
        noAuth: false,
        title: 'Stake Your Ethereum | Full Validator Staking | MyEtherWallet',
        description:
          'Earn rewards on your Ethereum with Staking. Help secure the Ethereum network and earn crypto.'
      }
    }
  ]
};
