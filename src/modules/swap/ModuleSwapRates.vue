<template>
  <white-sheet :sideinfo="!mobile">
    <div class="px-5 px-lg-7 py-5">
      <div class="d-flex align-center justify-space-between">
        <span class="mew-heading-2">{{ $t('common.swap') }}</span>
        <mew-button
          btn-style="transparent"
          button-size="small"
          :title="$t('common.more') + '...'"
          @click.native="toSwap"
        />
      </div>
    </div>
    <div v-if="!loading && !error && hasSwapRates" class="pa-3">
      <div v-for="(data, key) in swapRates" :key="key">
        <v-sheet
          v-if="data.rate"
          color="buttonGrayLight"
          class="d-flex align-center justify-space-between border-radius--5px mt-1 py-3 px-4 cursor"
          @click="goToSwap(data)"
        >
          <div class="text-uppercase">
            1 {{ data.fromT.symbol }} / {{ data.rate }} {{ data.toT.symbol }}
          </div>
          <div class="d-flex align-center">
            <mew-token-container
              size="small"
              class="pa-1"
              :img="ethIcon"
            ></mew-token-container>
            <img
              width="18"
              class="mx-2"
              src="@/assets/images/icons/icon-swap-arrow-grey.png"
              alt="swap-icon"
            />
            <mew-token-container
              size="small"
              :img="
                require('@/assets/images/currencies/' +
                  data.toT.symbol.toLowerCase() +
                  '.png')
              "
            ></mew-token-container>
          </div>
        </v-sheet>
      </div>
    </div>
    <div
      v-if="loading"
      class="pa-3 pb-4 d-flex flex-column align-center justify-space-around"
    >
      <v-progress-circular indeterminate />
      <h3 class="ma-3">Loading swap pairs...</h3>
    </div>
    <div
      v-if="showTokenIssue"
      class="pa-3 pb-4 d-flex flex-column align-center justify-space-around"
    >
      <v-progress-circular indeterminate />
      <h3 class="ma-3">Having issues loading tokens.</h3>
      <h5 class="mb-2 cursor--pointer greenPrimary--text" @click="fetchRates">
        Try again?
      </h5>
    </div>
  </white-sheet>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

import ethIcon from '@/assets/images/networks/eth.svg';

import { STATIC_PAIRS } from '@/core/configs/commons';

import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { DASHBOARD } from '../analytics-opt-in/handlers/configs/events';
import handlerSwap from '@/modules/swap/handlers/handlerSwap';
import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';

import { useRoute, useRouter } from 'vue-router/composables';

// injections/use
const { trackDashboardAmplitude } = useAmplitude();
const { swapRates, setSwapRates } = useWalletStore();
const { isEthNetwork, network, web3 } = useGlobalStore();
const router = useRouter();
const route = useRoute();

// props
defineProps({
  mobile: {
    type: Boolean,
    default: false
  }
});

// data
const swapHandler = ref(null);
const loading = ref(true);
const error = ref(false);

// computed
const showTokenIssue = computed(() => {
  return (error.value || !hasSwapRates.value) && !loading.value;
});
const hasSwapRates = computed(() => {
  if (swapRates.value) {
    return swapRates.value.some(item => {
      return item.rate;
    });
  }
  return false;
});

// watchers
watch(
  () => web3,
  newVal => {
    setSwapHandler(newVal, network.value.type.name);
  }
);

// mounted
onMounted(() => {
  setSwapHandler(web3.value, network.value.type.name);
});

const setSwapHandler = val => {
  if (!isEthNetwork.value) return;
  swapHandler.value = new handlerSwap(val, network.value.type.name);
  loading.value = swapRates.value.length === 0;
  if (swapRates.value.length !== 0) return;
  fetchRates();
};
const fetchRates = () => {
  try {
    loading.value = true;
    swapHandler.value.getQuotesForSet(STATIC_PAIRS).then(res => {
      setSwapRates(
        STATIC_PAIRS.map((itm, idx) => {
          itm['rate'] =
            res[idx] &&
            res[idx].length !== 0 &&
            res[idx][0] &&
            res[idx][0]?.amount
              ? formatFloatingPointValue(res[idx][0]?.amount).value
              : false;
          return itm;
        })
      );
      loading.value = false;
    });
  } catch (e) {
    loading.value = false;
    error.value = true;
    Toast(e.message, {}, ERROR);
  }
};
const toSwap = () => {
  trackDashboardAmplitude(DASHBOARD.SWAP_PAIRS);
  navigateToSwap();
};
const goToSwap = data => {
  const obj = {
    fromToken: data.fromT.contract,
    toToken: data.toT.contract,
    amount: '1'
  };
  trackDashboardAmplitude(DASHBOARD.SWAP_PAIRS, {
    TokenPair: `${data.fromT.symbol} to ${data.toT.symbol}`
  });
  navigateToSwap(obj);
};
const navigateToSwap = query => {
  const obj = { name: 'Swap' };
  if (query) {
    obj['query'] = query;
  }
  if (route.name === 'Swap') {
    // this will allow vue to update query param
    // within the swap page when user clicks on the pairs again
    router.replace(obj);
  } else {
    router.push(obj);
  }
};
</script>

<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
