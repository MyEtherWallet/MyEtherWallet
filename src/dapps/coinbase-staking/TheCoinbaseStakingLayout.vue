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
        title: 'ETH Staking Powered By Coinbase',
        subtext: 'Stake any amount of ETH and begin earning rewards. ',
        dappLink:
          'https://help.myetherwallet.com/en/articles/8843926-stake-eth-with-coinbase-in-mew-portfolio'
      },
      activeTab: 0,
      headerImg: require('@/assets/images/icons/dapps/icon-dapp-coinbase.svg'),
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
