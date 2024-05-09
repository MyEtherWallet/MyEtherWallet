<template>
  <div class="mew-component--moon-pay">
    <mew-popup
      :show="open"
      :has-buttons="false"
      :has-title="false"
      :has-padding="false"
      max-width="450"
      :left-btn="leftBtn"
      scrollable
      has-body-content
    >
      <div v-if="step === 0">
        <mew-tabs
          v-if="open"
          :items="tabItems"
          :active-tab="activeTab"
          active-color="greenPrimary"
          has-underline
          class="pt-3"
          :class="addTokenPadding ? 'top-container' : ''"
          @onTab="onTab"
        >
          <template #tabContent1>
            <buy-eth-component
              :order-handler="orderHandler"
              :tab="activeTab"
              :default-currency="defaultCurrency"
              :in-wallet="inWallet"
              :supported-buy="supportedNetwork"
              @selectedCurrency="setSelectedCurrency"
              @openProviders="openProviders"
              @selectedFiat="setSelectedFiat"
              @hideMoonpay="hideMoonpay"
              @simplexQuote="setSimplexQuote"
              @toAddress="setToAddress"
              @success="buySuccess"
              @openTokenSelect="checkTokenPadding"
            />
          </template>
          <template v-if="sellSupported" #tabContent2>
            <sell-eth-component
              :order-handler="orderHandler"
              :tab="activeTab"
              :in-wallet="inWallet"
              :default-currency="defaultCurrency"
              @selectedCurrency="setSelectedCurrency"
            />
          </template>
        </mew-tabs>
      </div>
      <BuyProviderComponent
        v-if="step === 1"
        :order-handler="orderHandler"
        :in-wallet="inWallet"
        :only-simplex="onlySimplex"
        :selected-currency="selectedCurrency"
        :selected-fiat="selectedFiat"
        :buy-obj="buyObj"
        :simplex-quote="simplexQuote"
        :to-address="toAddress"
        @close="step = 0"
        @openProviders="openProviders"
        @reset="reset"
      />
    </mew-popup>
  </div>
</template>

<script setup>
import {
  defineAsyncComponent,
  defineProps,
  ref,
  defineEmits,
  watch,
  computed
} from 'vue';
import { isEmpty } from 'lodash';

import { ETH, BSC, MATIC } from '@/utils/networks/types';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';

import handler from './handlers/handlerOrder';
import { BUY_SELL } from '@/modules/analytics-opt-in/handlers/configs/events';
import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';

import { useRoute } from 'vue-router/composables';
import { storeToRefs } from 'pinia';

const BuyEthComponent = defineAsyncComponent(() =>
  import('./components/BuyComponent')
);
const SellEthComponent = defineAsyncComponent(() =>
  import('./components/SellComponent')
);
const BuyProviderComponent = defineAsyncComponent(() =>
  import('./components/BuyProviderComponent.vue')
);

// emits
const emit = defineEmits(['close']);

// injections/use
const { trackBuySell } = useAmplitude();
const { tokensList } = useWalletStore();
const { contractToToken, setNetworkTokens } = useExternalStore();
const route = useRoute();

const { network } = storeToRefs(useGlobalStore);
const { address } = storeToRefs(useWalletStore);

// props
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
});

// data
const isOpen = ref(false);
const activeTab = ref(0);
const orderHandler = ref({});
const selectedCurrency = ref({});
const selectedFiat = ref({});
const onlySimplex = ref(false);
const buyObj = ref({});
const step = ref(0);
const simplexQuote = ref({});
const toAddress = ref('');
const addTokenPadding = ref(false);

// computed
const sellSupported = computed(() => {
  return network.type.name === ETH.name;
});
const inWallet = computed(() => {
  return route.fullPath.includes('/wallet') && !route.meta.noAuth;
});
const defaultCurrency = computed(() => {
  if (isEmpty(selectedCurrency.value) && supportedNetwork.value) {
    if (inWallet.value) {
      return tokensList[0];
    }
    const token = contractToToken(MAIN_TOKEN_ADDRESS);
    token.value = token.symbol;
    return token;
  } else if (isEmpty(selectedCurrency.value) || !supportedNetwork.value) {
    return selectedCurrency.value;
  }
  return selectedCurrency.value;
});
const supportedNetwork = computed(() => {
  return (
    network.type.name === ETH.name ||
    network.type.name === BSC.name ||
    network.type.name === MATIC.name
  );
});
const leftBtn = computed(() => {
  return {
    method: close
  };
});
const tabItems = computed(() => {
  if (sellSupported.value) {
    return [
      {
        name: `Buy`
      },
      {
        name: `Sell`
      }
    ];
  }
  return [{ name: 'Buy' }];
});

// watch
watch(
  () => props.open,
  newVal => {
    isOpen.value = newVal;
    if (newVal) {
      orderHandler.value = new handler();
    }
    selectedCurrency.value = {};
    selectedCurrency.value = defaultCurrency;
  }
);
watch(
  () => address,
  () => {
    selectedCurrency.value = defaultCurrency;
  }
);
watch(
  () => network,
  () => {
    selectedCurrency.value = {};
    selectedCurrency.value = defaultCurrency;
    setTokens();
  }
);

// methods
const onTab = val => {
  trackBuySell(val === 0 ? BUY_SELL.BUY_TAB : BUY_SELL.SELL_TAB);
  selectedCurrency.value = {};
  selectedCurrency.value = defaultCurrency;
  activeTab.value = val;
};
const setTokens = async () => {
  if (!inWallet.value) {
    const tokenMap = new Map();
    const tokens = await network.type.tokens;
    tokens.forEach(token => {
      tokenMap.set(token.address.toLowerCase(), token);
    });
    setNetworkTokens(tokenMap);
  }
};
const close = () => {
  activeTab.value = 0;
  step.value = 0;
  onlySimplex.value = false;
  emit('close', false);
  trackBuySell(BUY_SELL.BUY_SELL_CLOSED);
};
const setSelectedCurrency = e => {
  if (selectedCurrency.value.symbol !== e.symbol) {
    const event =
      activeTab.value === 0 ? BUY_SELL.BUY_INPUT : BUY_SELL.SELL_INPUT;
    trackBuySell(event, {
      old: selectedCurrency.value.symbol,
      new: e.symbol
    });
  }
  selectedCurrency.value = e;
};
const setSelectedFiat = e => {
  if (e.name === 'CAD') {
    selectedCurrency.value = defaultCurrency;
  }
  selectedFiat.value = e;
};
const openProviders = val => {
  step.value = val;
};
const setBuyObj = val => {
  buyObj.value = val;
};
const setSimplexQuote = val => {
  simplexQuote.value = val;
};
const setToAddress = val => {
  toAddress.value = val;
};
const reset = () => {
  selectedCurrency.value = defaultCurrency;
  selectedFiat.value = {
    name: 'USD',
    value: 'USD',
    // eslint-disable-next-line
    img: require(`@/assets/images/currencies/USD.svg`)
  };
  onlySimplex.value = false;
};
const hideMoonpay = val => {
  onlySimplex.value = val;
};
const buySuccess = items => {
  setSimplexQuote(items[0]);
  setToAddress(items[1]);
  setBuyObj(items[2]);
  openProviders(items[3]);
  setSelectedCurrency(items[4]);
  setSelectedFiat(items[5]);
  trackBuySell(BUY_SELL.BUY_NOW_BUTTON);
};
const checkTokenPadding = isOpen => {
  if (inWallet.value) {
    addTokenPadding.value = isOpen;
  } else addTokenPadding.value = false;
};
</script>

<style lang="scss" scoped>
.top-container {
  min-height: 540px;
}
</style>
