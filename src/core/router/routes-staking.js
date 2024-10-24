const Staking = () =>
  import(
    /* webpackChunkName: "stake" */ '@/modules/staking/ModuleStakingCenter.vue'
  );
export default [
  {
    path: '',
    name: 'Stake',
    component: Staking
  }
];
