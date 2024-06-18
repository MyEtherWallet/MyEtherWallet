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

<script setup>
import TheWrapperDapp from '@/dapps/TheWrapperDapp.vue';
import { COINBASE_STAKING_ROUTES, SUPPORTED_NETWORKS } from './configs';
import { ref } from 'vue';

// data
const header = {
  title: 'ETH Staking Powered By Coinbase',
  subtext: 'Stake any amount of ETH and begin earning rewards.'
};
const headerImg = require('@/assets/images/icons/dapps/icon-dapp-coinbase.svg');
const validNetworks = SUPPORTED_NETWORKS;
const tabs = [
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

const activeTab = ref(0);
</script>
