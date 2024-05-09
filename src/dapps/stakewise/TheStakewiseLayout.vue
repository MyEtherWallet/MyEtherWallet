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
import {
  defineAsyncComponent,
  computed,
  watch,
  ref,
  onMounted,
  onBeforeUnmount
} from 'vue';
import BigNumber from 'bignumber.js';
import { fromWei } from 'web3-utils';

import { STAKEWISE_ROUTES } from './configsRoutes';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
import { toBNSafe } from '@/core/helpers/numberFormatHelper';

import handler from './handlers/stakewiseHandler';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useStakewiseStore } from './store';
import { storeToRefs } from 'pinia';

const TheWrapperDapp = defineAsyncComponent(() =>
  import('@/dapps/TheWrapperDapp.vue')
);

// injections/use
const { isEthNetwork } = useGlobalStore();
const { address } = useWalletStore();
const {
  setPoolSupply,
  setStakingFee,
  setValidatorApr,
  setRewardBalance,
  setStakeBalance
} = useStakewiseStore();

const { web3 } = storeToRefs(useWalletStore());
const { network } = storeToRefs(useGlobalStore());

// data
const header = {
  title: 'Stakewise',
  subtext: 'Unstake only'
};
const headerImg = require('@/assets/images/icons/dapps/icon-dapp-stakewise.svg');
const validNetworks = SUPPORTED_NETWORKS;
const activeTab = ref(0);
const stakewiseHandler = ref({});
const fetchInterval = ref(null);

// computed
const isSupported = computed(() => {
  const isSupported = validNetworks.find(item => {
    return item.name === network.type.name;
  });
  return !!isSupported;
});
const tabs = computed(() => {
  const arr = [
    {
      name: 'Unstake ETH',
      route: { name: STAKEWISE_ROUTES.CORE.NAME },
      id: 0
    }
  ];

  return arr;
});

// watch
watch(
  () => web3,
  () => {
    clearInterval(fetchInterval.value);
    if (isSupported.value) {
      setup();
    }
  }
);
watch(
  () => network,
  () => {
    clearInterval(fetchInterval.value);
    if (isSupported.value) {
      setup();
    }
  }
);

// mounted
onMounted(() => {
  if (isSupported.value) {
    setup();
  }
});

// before Destroy
onBeforeUnmount(() => {
  clearInterval(fetchInterval.value);
});

// methods
const setup = () => {
  stakewiseHandler.value = new handler(web3, isEthNetwork);
  collectiveFetch();
  fetchInterval.value = setInterval(() => {
    collectiveFetch();
  }, 14000);
};
const collectiveFetch = () => {
  Promise.all([
    stakewiseHandler.value.getEthPool(),
    stakewiseHandler.value.getStakingFee(),
    stakewiseHandler.value.getValidatorApr(),
    stakewiseHandler.value.getSethBalance(address),
    stakewiseHandler.value.getRethBalance(address)
  ]).then(res => {
    setPoolSupply(res[0]);
    setStakingFee(res[1]);
    setValidatorApr(
      BigNumber(res[2]).minus(BigNumber(res[2]).times(0.1)).dp(2).toString()
    );
    setStakeBalance(fromWei(toBNSafe(res[3])));
    setRewardBalance(fromWei(toBNSafe(res[4])));
  });
};
</script>
