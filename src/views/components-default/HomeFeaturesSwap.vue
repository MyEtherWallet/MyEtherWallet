<template>
  <white-sheet
    class="mew-component--features-swap pa-6 pa-md-10"
    max-width="700px"
  >
    <div class="mew-heading-1 mb-3">{{ $t('home.features.swap.heading') }}</div>
    <div>
      {{ $t('home.features.swap.title') }}
    </div>
    <div class="mt-10">
      <v-row v-if="!loading && !error">
        <v-col
          v-for="(data, key) in swapData"
          :key="key"
          cols="12"
          md="6"
          style="padding: 4px !important"
        >
          <v-sheet
            v-if="data.rate"
            color="tableHeader"
            class="d-flex align-center justify-space-between border-radius--5px py-5 px-4 cursor cursor--pointer"
            @click="goToSwap(data)"
          >
            <div class="text-uppercase">
              1 {{ data.fromT.symbol }} / {{ data.rate }} {{ data.toT.symbol }}
            </div>
            <div class="d-flex align-center">
              <img
                width="22"
                :src="
                  require('@/assets/images/currencies/' +
                    data.fromT.symbol.toLowerCase() +
                    '.png')
                "
                alt="currency-icon"
              />
              <img
                width="18"
                class="mx-2"
                src="@/assets/images/icons/icon-swap-arrow-grey.png"
                alt="swap-icon"
              />
              <img
                width="22"
                :src="
                  require('@/assets/images/currencies/' +
                    data.toT.symbol.toLowerCase() +
                    '.png')
                "
                alt="eth-icon"
              />
            </div>
          </v-sheet>
        </v-col>
      </v-row>
      <mew-button
        title="Swap"
        btn-size="xlarge"
        class="mx-auto mt-12 d-block"
        @click.native="() => navigateToSwap()"
      />
    </div>
  </white-sheet>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { isEmpty } from 'lodash';

import { STATIC_PAIRS } from '@/core/configs/commons.js';

import handlerSwap from '@/modules/swap/handlers/handlerSwap';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { LANDING_PAGE } from '@/modules/analytics-opt-in/handlers/configs/events.js';

import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';

import { useRoute, useRouter } from 'vue-router/composables';

// injections/vue
const router = useRouter();
const route = useRoute();
const { trackLandingPageAmplitude } = useAmplitude();
const { network } = useGlobalStore();
const { web3 } = useWalletStore();

// data
const swapHandler = ref(null);
const swapData = ref(null);
const loading = ref(true);
const error = ref(false);

// watchers
watch(
  () => web3,
  newVal => {
    setSwapHandler(newVal);
  }
);

onMounted(() => {
  setSwapHandler(web3);
});

// methods
const setSwapHandler = web3 => {
  swapHandler.value = new handlerSwap(web3.value, network.value.type.name);
  fetchRates();
};

const fetchRates = () => {
  try {
    swapData.value = null;
    loading.value = true;
    swapHandler.value.getQuotesForSet(STATIC_PAIRS).then(res => {
      swapData.value = STATIC_PAIRS.map((itm, idx) => {
        itm['rate'] =
          res[idx].length === 0 || isEmpty(res[idx])
            ? false
            : formatFloatingPointValue(res[idx][0].amount).value;
        return itm;
      });
    });
  } catch (e) {
    loading.value = e;
    error.value = true;
    Toast(e.message, {}, ERROR);
  }
};

const goToSwap = data => {
  const obj = {
    fromToken: data.fromT.contract,
    toToken: data.toT.contract,
    amount: '1'
  };
  navigateToSwap(obj);
};

const navigateToSwap = query => {
  const obj = { name: ROUTES_WALLET.SWAP.NAME };
  if (query) {
    obj['query'] = query;
  }
  trackLandingPageAmplitude(LANDING_PAGE.SWAP_CLICKED);
  if (route.name === ROUTES_WALLET.SWAP.NAME) {
    // this will allow vue to update query param
    // within the swap page when user clicks on the pairs again
    router.replace(obj);
  } else {
    router.push(obj);
  }
};
</script>
