<template>
  <div class="module-balance">
    <!--
    =====================================================================================
      display if the user has an eth balance > 0
    =====================================================================================
    -->
    <module-balance-loader v-if="loadingWalletInfo" />

    <mew-module
      v-if="hasBalance && !loadingWalletInfo"
      :subtitle="subtitle"
      :title="title"
      :has-body-padding="false"
      :icon="network.type.icon"
      :caption="convertedBalance"
      :has-elevation="true"
      :has-full-height="true"
      icon-align="left"
      class="bgWalletBlock"
    >
      <template v-if="false" #rightHeaderContainer>
        <div class="d-flex align-center ml-8 mt-3 mt-sm-0">
          <mew-toggle
            :button-group="chartButtons"
            :on-toggle-btn-idx="activeButton"
            @onBtnClick="onToggle"
          />
        </div>
      </template>
      <template #moduleBody>
        <balance-chart
          v-if="false"
          :data="chartData"
          class="full-width mt-5 pa-md-3"
        />
        <div
          class="pa-3 pa-sm-7 d-block d-md-flex align-center justify-space-between"
        >
          <div
            class="d-flex flex-column flex-sm-row align-center justify-center"
          >
            <div class="d-flex align-center">
              <div class="font-weight-bold">
                {{ network.type.currencyName }} PRICE
              </div>
              <div
                :class="[
                  'ml-2 font-weight-regular',
                  priceChange ? 'greenPrimary--text' : 'redPrimary--text'
                ]"
              >
                {{ formatChange }}
              </div>
              <v-icon
                :class="[
                  priceChange ? 'greenPrimary--text' : 'redPrimary--text',
                  'body-2'
                ]"
                >{{ priceChangeArrow }}</v-icon
              >
            </div>
            <div class="ml-sm-5">
              {{ formatFiatPrice }} / 1 {{ network.type.currencyName }}
            </div>
          </div>
          <div class="text-center text-md-right mt-4 mt-md-0">
            <mew-button
              :has-full-width="false"
              :title="sendText"
              btn-size="large"
              btn-style="transparent"
              class="mr-3"
              @click.native="navigateToSend"
            />
            <mew-button
              v-if="hasSwap"
              :has-full-width="false"
              :title="swapText"
              btn-size="large"
              btn-style="outline"
              @click.native="navigateToSwap"
            />
          </div>
        </div>
      </template>
    </mew-module>
    <!--
    =====================================================================================
      display if the user has no eth balance
    =====================================================================================
    -->
    <balance-empty-block
      v-if="!hasBalance && !loadingWalletInfo"
      :network-type="network.type.currencyName"
      :is-eth="isEthNetwork"
    />
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, onMounted, computed } from 'vue';
import BigNumber from 'bignumber.js';

import {
  formatPercentageValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { DASHBOARD } from '@/modules/analytics-opt-in/handlers/configs/events.js';
import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';

import { useRouter } from 'vue-router/composables';

const ModuleBalanceLoader = defineAsyncComponent(() =>
  import('./ModuleBalanceLoader')
);
const BalanceChart = defineAsyncComponent(() =>
  import('@/modules/balance/components/BalanceChart')
);
const BalanceEmptyBlock = defineAsyncComponent(() =>
  import('./components/BalanceEmptyBlock')
);

// injections/use
const { trackDashboardAmplitude } = useAmplitude();
const { network, hasSwap, getFiatValue, isEthNetwork } = useGlobalStore();
const { loadingWalletInfo, balanceInETH, balanceInWei } = useWalletStore();
const { fiatValue, balanceFiatValue, networkTokenUSDMarket } =
  useExternalStore();
const router = useRouter();

// data
const chartButtons = ['1D', '1W', '1M', '1Y'];
const chartData = ref([]);
const timeString = ref('');
const scale = ref('');
const activeButton = ref(0);

// computed
const priceChangeArrow = computed(() => {
  return priceChange.value ? 'mdi-arrow-up-bold' : 'mdi-arrow-down-bold';
});
const priceChange = computed(() => {
  return networkTokenUSDMarket.value.price_change_percentage_24h > 0;
});
/**
 * Computed property returns formated eth value of the wallet balance
 * ie: $12.45 per 1 ETH
 */
const title = computed(() => {
  return `${formatFloatingPointValue(balanceInETH.value).value} ${
    network.value.type.currencyName
  }`;
});
const sendText = computed(() => {
  return `Send ${network.value.type.currencyName}`;
});
const swapText = computed(() => {
  return `Swap ${network.value.type.currencyName}`;
});
const subtitle = computed(() => {
  return `My ${network.value.type.currencyName} Balance`;
});
/**
 * Computed property returns formated eth wallet balance value in USD
 * ie: $12.45 per 1 ETH
 */
const convertedBalance = computed(() => {
  if (fiatLoaded.value) {
    return getFiatValue(balanceFiatValue.value);
  }
  return '';
});
/**
 * Computed property returns formated 24 hours percentage change
 * ie: $12.45 per 1 ETH
 */
const formatChange = computed(() => {
  if (fiatLoaded.value) {
    return formatPercentageValue(
      networkTokenUSDMarket.value.price_change_percentage_24h
    ).value;
  }
  return '';
});
/**
 * Computed property returns formats Fiat Price
 * ie: $12.45 per 1 ETH
 */
const formatFiatPrice = computed(() => {
  if (fiatLoaded.value) {
    return getFiatValue(fiatValue.value);
  }
  return '';
});
/**
 * Computed property returns whether or not fiat info is loaded
 */
const fiatLoaded = computed(() => {
  return (
    !!networkTokenUSDMarket.value &&
    !!networkTokenUSDMarket.value.price_change_percentage_24h &&
    !!balanceFiatValue.value &&
    !!fiatValue.value
  );
});
/**
 * Determines whether or not to show empty block
 * @return {boolean}
 */
const hasBalance = computed(() => {
  return BigNumber(balanceInWei.value).gt(0);
});

// mounted
onMounted(() => {
  initChart();
});

// methods
const initChart = () => {
  let count = 0;
  const checker = () => {
    onToggle(chartButtons[count]);
    setTimeout(() => {
      if (count >= 3) {
        onToggle(chartButtons[count]);
        activeButton.value = count;
        // a single point basically looks the same as an empty chart
      } else if (chartData.value.length <= 1) {
        count++;
        checker();
      } else {
        activeButton.value = count;
      }
    }, 1000);
  };
  checker();
};
const onToggle = e => {
  switch (e) {
    case chartButtons[0]:
      setDataYesterday();
      break;
    case chartButtons[1]:
      setDataWeek();
      break;
    case chartButtons[2]:
      setDataMonth();
      break;
    case chartButtons[3]:
      setDataYear();
      break;
    default:
      setDataMonth();
  }
};
const setDataMonth = () => {
  const locTimeString = new Date();
  timeString.value = locTimeString.getTime() - 1000 * 60 * 60 * 24 * 31;
  scale.value = 'days';
};
const setDataYear = () => {
  const locTimeString = new Date();
  timeString.value = locTimeString.getTime() - 1000 * 60 * 60 * 24 * 365;
  scale.value = 'days';
};
const setDataWeek = () => {
  const locTimeString = new Date();
  timeString.value = locTimeString.getTime() - 1000 * 60 * 60 * 24 * 7;
  scale.value = 'days';
};
const setDataYesterday = () => {
  const locTimeString = new Date();
  timeString.value = locTimeString.getTime() - 1000 * 60 * 60 * 24 * 1;
  scale.value = 'hours';
};
const navigateToSend = () => {
  router.push({ name: ROUTES_WALLET.SEND_TX.NAME });
};
const navigateToSwap = () => {
  trackDashboardAmplitude(DASHBOARD.SWAP_BALANCE);
  router.push({ name: ROUTES_WALLET.SWAP.NAME });
};
</script>
