import { COINBASE_STAKING_ROUTES, SUPPORTED_NETWORKS } from './configs';
const layout = () =>
  import(/* webpackChunkName: "dapp-stakewise" */ './TheCoinbaseStakingLayout');
import ModuleCoinbaseStaking from './modules/ModuleCoinbaseStaking';
import ModuleCoinbaseUnstaking from './modules/ModuleCoinbaseUnstaking';
import icon from '@/assets/images/icons/dapps/icon-dapp-coinbase.png';
export default {
  title: 'ETH Staking',
  subtitle: 'Powered by Coinbase',
  description: 'Stake any amount of ETH and begin earning rewards',
  tag: '#DeFi',
  rightIconType: 'img',
  rightIcon: icon,
  path: COINBASE_STAKING_ROUTES.CORE.PATH,
  networks: SUPPORTED_NETWORKS,
  layout,
  release: '01/22/2024',
  defaultName: COINBASE_STAKING_ROUTES.CORE.NAME,
  meta: {
    noAuth: false,
    title: 'Partial Ethereum staking | MyEtherWallet',
    description: 'Stake your Ethereum without a full lockup period.'
  },
  children: [
    {
      name: COINBASE_STAKING_ROUTES.CORE.NAME,
      path: '',
      component: ModuleCoinbaseStaking,
      meta: {
        noAuth: false,
        title: 'Partial Ethereum staking | MyEtherWallet',
        description: 'Stake your Ethereum without a full lockup period.'
      }
    },
    {
      name: COINBASE_STAKING_ROUTES.STAKE.NAME,
      path: COINBASE_STAKING_ROUTES.STAKE.PATH,
      component: ModuleCoinbaseStaking,
      meta: {
        noAuth: false,
        title: 'Partial Ethereum staking | MyEtherWallet',
        description: 'Stake your Ethereum without a full lockup period.'
      }
    },
    {
      name: COINBASE_STAKING_ROUTES.UNSTAKE.NAME,
      path: COINBASE_STAKING_ROUTES.UNSTAKE.PATH,
      component: ModuleCoinbaseUnstaking,
      meta: {
        noAuth: false,
        title: 'Partial Ethereum staking | MyEtherWallet',
        description: 'Unstake your staked ETH'
      }
    }
  ]
};
