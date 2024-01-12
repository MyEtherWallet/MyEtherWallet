import { COINBASE_STAKING_ROUTES, SUPPORTED_NETWORKS } from './configs';
const layout = () =>
  import(/* webpackChunkName: "dapp-stakewise" */ './TheCoinbaseStakingLayout');
import ModuleCoinbaseStaking from './modules/ModuleCoinbaseStaking';
import ModuleCoinbaseUnstaking from './modules/ModuleCoinbaseUnstaking';
export default {
  title: 'Coinbase Staking',
  subtitle: 'Stake any amount of ETH and begin earning rewards',
  tag: '#DeFi',
  rightIconType: 'mew',
  rightIcon: 'stakewise',
  path: COINBASE_STAKING_ROUTES.CORE.PATH,
  networks: SUPPORTED_NETWORKS,
  layout,
  release: '01/18/2024',
  defaultName: COINBASE_STAKING_ROUTES.CORE.NAME,
  meta: {
    noAuth: false,
    title: 'Liquid Ethereum Staking | MyEtherWallet',
    description:
      'Stake your Ethereum without a full lockup period. Earn rewards with liquid tokens.'
  },
  children: [
    {
      name: COINBASE_STAKING_ROUTES.CORE.NAME,
      path: '',
      component: ModuleCoinbaseStaking,
      meta: {
        noAuth: false,
        title: 'Liquid Ethereum Staking | MyEtherWallet',
        description:
          'Stake your Ethereum without a full lockup period. Earn rewards with liquid tokens.'
      }
    },
    {
      name: COINBASE_STAKING_ROUTES.STAKE.NAME,
      path: COINBASE_STAKING_ROUTES.STAKE.PATH,
      component: ModuleCoinbaseStaking,
      meta: {
        noAuth: false,
        title: 'Liquid Ethereum Staking | MyEtherWallet',
        description:
          'Stake your Ethereum without a full lockup period. Earn rewards with liquid tokens.'
      }
    },
    {
      name: COINBASE_STAKING_ROUTES.UNSTAKE.NAME,
      path: COINBASE_STAKING_ROUTES.UNSTAKE.PATH,
      component: ModuleCoinbaseUnstaking,
      meta: {
        noAuth: false,
        title: 'Liquid Ethereum Unstaking | MyEtherWallet',
        description: 'Unstake your staked ETH'
      }
    }
  ]
};
