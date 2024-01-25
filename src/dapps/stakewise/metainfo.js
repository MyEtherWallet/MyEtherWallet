import { STAKEWISE_ROUTES } from './configsRoutes';
const layout = () =>
  import(/* webpackChunkName: "dapp-stakewise" */ './TheStakewiseLayout');
import ModuleStakewiseRewards from './modules/ModuleStakewiseRewards';
import ModuleStakewiseStake from './modules/ModuleStakewiseStake';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
export default {
  title: 'Stakewise',
  subtitle: 'Unstaking only',
  description: '',
  tag: '#DeFi',
  rightIconType: 'mew',
  rightIcon: 'stakewise',
  path: STAKEWISE_ROUTES.CORE.PATH,
  networks: SUPPORTED_NETWORKS,
  layout,
  release: '04/14/2022',
  defaultName: STAKEWISE_ROUTES.CORE.NAME,
  meta: {
    noAuth: false,
    title: 'Liquid Ethereum Staking | MyEtherWallet',
    description:
      'Stake your Ethereum without a full lockup period. Earn rewards with liquid tokens.'
  },
  children: [
    {
      name: STAKEWISE_ROUTES.CORE.NAME,
      path: '',
      component: ModuleStakewiseStake,
      meta: {
        noAuth: false,
        title: 'Liquid Ethereum Staking | MyEtherWallet',
        description:
          'Stake your Ethereum without a full lockup period. Earn rewards with liquid tokens.'
      }
    },
    {
      name: STAKEWISE_ROUTES.STAKE.NAME,
      path: STAKEWISE_ROUTES.STAKE.PATH,
      component: ModuleStakewiseStake,
      meta: {
        noAuth: false,
        title: 'Liquid Ethereum Staking | MyEtherWallet',
        description:
          'Stake your Ethereum without a full lockup period. Earn rewards with liquid tokens.'
      }
    },
    {
      path: STAKEWISE_ROUTES.REWARDS.PATH,
      name: STAKEWISE_ROUTES.REWARDS.NAME,
      component: ModuleStakewiseRewards,
      meta: {
        noAuth: false,
        title: 'Claim Crypto Staking Rewards | MyEtherWallet ',
        description:
          'Deposit your crypto rewards into your crypto wallet. Claim your staking rewards.'
      }
    }
  ]
};
