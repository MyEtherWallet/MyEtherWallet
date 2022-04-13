import { STAKEWISE_ROUTES } from './configsRoutes';
import layout from './TheStakewiseLayout';
import ModuleStakewiseRewards from './modules/ModuleStakewiseRewards';
import ModuleStakewiseStake from './modules/ModuleStakewiseStake';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
export default {
  title: 'Stakewise',
  subtitle: 'Stake any amount of ETH and begin earning rewards.',
  tag: '#DeFi',
  rightIconType: 'mew',
  rightIcon: 'stakewise',
  path: STAKEWISE_ROUTES.CORE.PATH,
  networks: SUPPORTED_NETWORKS,
  layout,
  release: '01/27/2022',
  defaultName: STAKEWISE_ROUTES.CORE.NAME,
  meta: {
    noAuth: false
  },
  children: [
    {
      name: STAKEWISE_ROUTES.CORE.NAME,
      path: '',
      component: ModuleStakewiseStake
    },
    {
      name: STAKEWISE_ROUTES.STAKE.NAME,
      path: STAKEWISE_ROUTES.STAKE.PATH,
      component: ModuleStakewiseStake
    },
    {
      path: STAKEWISE_ROUTES.REWARDS.PATH,
      name: STAKEWISE_ROUTES.REWARDS.NAME,
      component: ModuleStakewiseRewards
    }
  ]
};
