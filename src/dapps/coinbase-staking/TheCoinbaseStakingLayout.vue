<template>
  <the-wrapper-dapp
    :is-new-header="true"
    :dapp-img="headerImg"
    :banner-text="header"
    :tab-items="tabs"
    :active-tab="activeTab"
    :valid-networks="validNetworks"
    top-strip
  >
  </the-wrapper-dapp>
</template>

<script>
import { COINBASE_STAKING_ROUTES, SUPPORTED_NETWORKS } from './configs';

export default {
  name: 'TheCoinbaseStakingLayout',
  components: {
    TheWrapperDapp: () => import('@/dapps/TheWrapperDapp.vue')
  },
  data() {
    return {
      header: {
        title: 'Coinbase Staking',
        subtext: 'Stake any amount of ETH and begin earning rewards.'
      },
      activeTab: 0,
      headerImg: require('@/assets/images/icons/dapps/icon-dapp-stakewise.svg'),
      validNetworks: SUPPORTED_NETWORKS
    };
  },
  computed: {
    tabs() {
      return [
        {
          name: 'Stake',
          route: { name: COINBASE_STAKING_ROUTES.CORE.NAME },
          id: 0
        },
        {
          name: 'Unstake',
          route: { name: COINBASE_STAKING_ROUTES.UNSTAKE.NAME },
          id: 1
        }
      ];
    }
  }
};
</script>
