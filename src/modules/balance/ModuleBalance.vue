<template>
  <div class="module-balance">
    <!--
    =====================================================================================
      display if the user has an eth balance > 0
    =====================================================================================
    -->
    <loader v-if="loadingWalletInfo" />

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

<script>
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';

import {
  formatPercentageValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';

import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { DASHBOARD } from '@/modules/analytics-opt-in/handlers/configs/events.js';
export default {
  components: {
    Loader: () => import('./ModuleBalanceLoader'),
    BalanceChart: () => import('@/modules/balance/components/BalanceChart'),
    BalanceEmptyBlock: () => import('./components/BalanceEmptyBlock')
  },
  mixins: [handlerAnalytics],
  data() {
    return {
      chartButtons: ['1D', '1W', '1M', '1Y'],
      chartData: [],
      timeString: '',
      scale: '',
      activeButton: 0
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'loadingWalletInfo']),
    ...mapGetters('global', ['network', 'hasSwap', 'getFiatValue']),
    ...mapGetters('wallet', ['balanceInETH', 'balanceInWei']),
    ...mapGetters('external', [
      'fiatValue',
      'balanceFiatValue',
      'networkTokenUSDMarket'
    ]),
    ...mapGetters('global', ['isEthNetwork', 'network']),
    priceChangeArrow() {
      return this.priceChange ? 'mdi-arrow-up-bold' : 'mdi-arrow-down-bold';
    },
    priceChange() {
      return this.networkTokenUSDMarket.price_change_percentage_24h > 0;
    },
    /**
     * Computed property returns formated eth value of the wallet balance
     * ie: $12.45 per 1 ETH
     */
    title() {
      return `${formatFloatingPointValue(this.balanceInETH).value} ${
        this.network.type.currencyName
      }`;
    },
    sendText() {
      return `Send ${this.network.type.currencyName}`;
    },
    swapText() {
      return `Swap ${this.network.type.currencyName}`;
    },
    subtitle() {
      return `My ${this.network.type.currencyName} Balance`;
    },
    /**
     * Computed property returns formated eth wallet balance value in USD
     * ie: $12.45 per 1 ETH
     */
    convertedBalance() {
      if (this.fiatLoaded) {
        return this.getFiatValue(this.balanceFiatValue);
      }
      return '';
    },
    /**
     * Computed property returns formated 24 hours percentage change
     * ie: $12.45 per 1 ETH
     */
    formatChange() {
      if (this.fiatLoaded) {
        return formatPercentageValue(
          this.networkTokenUSDMarket.price_change_percentage_24h
        ).value;
      }
      return '';
    },
    /**
     * Computed property returns formats Fiat Price
     * ie: $12.45 per 1 ETH
     */
    formatFiatPrice() {
      if (this.fiatLoaded) {
        return this.getFiatValue(this.fiatValue);
      }
      return '';
    },
    /**
     * Computed property returns whether or not fiat info is loaded
     */
    fiatLoaded() {
      return (
        !!this.networkTokenUSDMarket &&
        !!this.networkTokenUSDMarket.price_change_percentage_24h &&
        !!this.balanceFiatValue &&
        !!this.fiatValue
      );
    },
    /**
     * Determines whether or not to show empty block
     * @return {boolean}
     */
    hasBalance() {
      return BigNumber(this.balanceInWei).gt(0);
    }
  },
  watch: {
    chartData: {
      handler: function () {},
      deep: true
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      let count = 0;
      const checker = () => {
        this.onToggle(this.chartButtons[count]);
        setTimeout(() => {
          if (count >= 3) {
            this.onToggle(this.chartButtons[count]);
            this.activeButton = count;
            // a single point basically looks the same as an empty chart
          } else if (this.chartData.length <= 1) {
            count++;
            checker();
          } else {
            this.activeButton = count;
          }
        }, 1000);
      };
      checker();
    },
    onToggle(e) {
      switch (e) {
        case this.chartButtons[0]:
          this.setDataYesterday();
          break;
        case this.chartButtons[1]:
          this.setDataWeek();
          break;
        case this.chartButtons[2]:
          this.setDataMonth();
          break;
        case this.chartButtons[3]:
          this.setDataYear();
          break;
        default:
          this.setDataMonth();
      }
    },
    setDataMonth() {
      const timeString = new Date();
      this.timeString = timeString.getTime() - 1000 * 60 * 60 * 24 * 31;
      this.scale = 'days';
    },
    setDataYear() {
      const timeString = new Date();
      this.timeString = timeString.getTime() - 1000 * 60 * 60 * 24 * 365;
      this.scale = 'days';
    },
    setDataWeek() {
      const timeString = new Date();
      this.timeString = timeString.getTime() - 1000 * 60 * 60 * 24 * 7;
      this.scale = 'days';
    },
    setDataYesterday() {
      const timeString = new Date();
      this.timeString = timeString.getTime() - 1000 * 60 * 60 * 24 * 1;
      this.scale = 'hours';
    },
    navigateToSend() {
      this.$router.push({ name: ROUTES_WALLET.SEND_TX.NAME });
    },
    navigateToSwap() {
      this.trackDashboardAmplitude(DASHBOARD.SWAP_BALANCE);
      this.$router.push({ name: ROUTES_WALLET.SWAP.NAME });
    }
  }
};
</script>
