<template>
  <div class="module-tokens-value">
    <white-sheet class="px-5 px-lg-7 py-5 d-flex justify-space-between">
      <v-row dense>
        <v-col cols="12">
          <div :class="[draggable ? 'ml-7' : '', 'mew-heading-2 mb-3']">
            {{ tokenTitle }}
          </div>
        </v-col>
        <v-col v-if="showTokens" cols="12" class="mt-3">
          <v-row
            v-for="(token, idx) in tokens"
            :key="idx"
            justify="start"
            style="max-height: 48px"
          >
            <v-col cols="2">
              <mew-token-container
                size="medium"
                :img="token.img"
                class="token-shadow"
              ></mew-token-container>
            </v-col>
            <v-col cols="6" class="mt-2 token-balance textDark--text"
              >{{ token.balancef }} {{ token.symbol }}</v-col
            >
            <v-col
              cols="4"
              align="right"
              class="token-value mt-2 textDark--text"
            >
              {{ token.usdBalancef }}
            </v-col>
          </v-row>
          <v-row justify="start">
            <v-col cols="7">
              <div class="more-tokens textDark--text">
                {{ getText }}
              </div>
            </v-col>
            <v-col v-if="tokenCount > 0" align="right" cols="5">
              <div class="tokens-link" @click="checkLink">See All</div>
            </v-col>
            <v-col v-if="tokenCount === 0 && canBuy" align="right" cols="5">
              <div class="tokens-link" @click="checkLink">Buy Crypto</div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </white-sheet>
    <app-modal
      title="My Tokens"
      :close="handleTokensPopup"
      :show="showPopup"
      :has-buttons="false"
      scrollable
      width="700"
      @close="handleTokensPopup"
    >
      <template #dialogBody>
        <div class="mew-heading-3 mb-3 textDark--text px-4">
          Total Value: {{ totalTokenValues }}
        </div>
        <module-tokens class="pa-0" dense @trade="handleTokensPopup" />
      </template>
    </app-modal>
  </div>
</template>

<script setup>
import { defineProps, computed, ref, defineAsyncComponent } from 'vue';
import { toBN } from 'web3-utils';

import { useBuySell } from '@/core/composables/buyMore';
import {
  global as useGlobalStore,
  external as useExternalStore,
  wallet as useWalletStore
} from '@/core/store/index.js';

const ModuleTokens = defineAsyncComponent(() =>
  import('@/modules/balance/ModuleTokens')
);

// props
defineProps({
  draggable: {
    type: Boolean,
    default: false
  }
});

// injections/use
const { openBuySell } = useBuySell();
const { getFiatValue, network } = useGlobalStore();
const { totalTokenFiatValue } = useExternalStore();
const { tokensList, loadingWalletInfo } = useWalletStore();

// data
const showPopup = ref(false);

// computed
const canBuy = computed(() => {
  return network.type.canBuy;
});
const tokenTitle = computed(() => {
  return `My Token${tokenCount.value !== 1 ? 's' : ''}`;
});
const totalTokenValues = computed(() => {
  return getFiatValue(totalTokenFiatValue);
});
const tokens = computed(() => {
  const tokens = tokensList
    .reduce((arr, token) => {
      if (token && token.balance.gt(toBN(0))) {
        arr.push(token);
      }
      return arr;
    }, [])
    .slice(0, 5);
  return tokens;
});
const moreTokensCount = computed(() => {
  return tokenCount.value - tokens.value.length;
});
const showTokens = computed(() => {
  return !loadingWalletInfo;
});
const getText = computed(() => {
  if (showTokens.value) {
    const count =
      moreTokensCount.value > 0 ? moreTokensCount.value : tokenCount.value;
    return `${
      moreTokensCount.value > 0 ? `+${moreTokensCount.value}` : tokenCount.value
    } token${count !== 1 ? 's' : ''}`;
  }
  return '';
});
const tokenCount = computed(() => {
  if (tokensList.length > 0 && tokensList[0].balance.eq(toBN(0))) {
    return tokensList.length - 1;
  }
  return tokensList.length;
});
// methods
const handleTokensPopup = () => {
  showPopup.value = !showPopup.value;
};
const checkLink = () => {
  if (tokenCount.value > 0) handleTokensPopup();
  else openBuySell('ModuleTokensValue');
};
</script>
<style lang="scss" scoped>
.circled-total {
  border-radius: 50%;
  width: 32px;
  height: 32px;
  padding-top: 6px !important;
  color: #05c0a5;
  border: 1px dashed #05c0a5;
  text-align: center;
  cursor: pointer;
  font-size: 10px;
}
.circled-total:hover {
  background-color: var(--v-greyLight-base);
}
.token-shadow {
  box-sizing: border-box;
  box-shadow: inset 0px 0px 0px 1px #ffffff;
  filter: drop-shadow(0px 4px 10px rgba(24, 43, 75, 0.1));
  border-radius: 100px;
}
.tokens-link {
  width: 81px;
  height: 24px;

  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.25px;
  cursor: pointer;

  color: #05c0a5;
}
.more-tokens {
  height: 24px;

  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.25px;

  color: #081d34;
}
.token-balance {
  width: 84px;
  height: 20px;

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;

  color: #081d34;
}
.token-value {
  width: 54px;
  height: 20px;

  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;

  color: #081d34;
}
</style>
