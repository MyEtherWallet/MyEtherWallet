<template>
  <div class="mew6-component--module-balance">
    <!--
  =====================================================================================
    display if the user has an eth balance > 0
  =====================================================================================
  -->
    <v-skeleton-loader
      v-if="loading"
      class="mx-auto module-balance-loader"
      width="100%"
      min-height="352px"
      max-width="100%"
      type="card"
    ></v-skeleton-loader>
    <mew-module
      v-if="hasBalance && !loading"
      :subtitle="subtitle"
      :title="title"
      :has-body-padding="false"
      :icon="network.type.icon"
      :caption="convertedBalance"
      :has-elevation="true"
      :has-full-height="true"
      icon-align="left"
    >
      <template v-if="network.type.name === 'ETH'" #rightHeaderContainer>
        <div class="d-flex align-center ml-8 mt-3 mt-sm-0">
          <mew-toggle
            :button-group="chartButtons"
            :on-toggle-btn-idx="activeButton"
            @onBtnClick="onToggle"
          />
          <!-- not sure what this button is for, commented out for now -->
          <!-- <mew-button
            btn-size="small"
            icon-type="mdi"
            icon="mdi-dots-vertical"
            btn-style="transparent"
            color-theme="secondary"
          /> -->
        </div>
      </template>
      <template #moduleBody>
        <balance-chart
          v-if="network.type.name === 'ETH'"
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
              <div class="font-weight-bold">{{ network.type.name }} PRICE</div>
              <div
                :class="[
                  'ml-2 font-weight-regular',
                  priceChange ? 'primary--text' : 'error--text'
                ]"
              >
                {{ formatChange }}
              </div>
              <v-icon
                :class="[
                  priceChange ? 'primary--text' : 'error--text',
                  'body-2'
                ]"
                >{{ priceChangeArrow }}</v-icon
              >
            </div>
            <div class="ml-sm-5">
              {{ formatFiatPrice }} / 1 {{ network.type.name }}
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
      v-if="!hasBalance && !loading"
      :network-type="network.type.name"
      :is-eth="isEthNetwork"
    />
  </div>
</template>

<script>
import BalanceChart from '@/modules/balance/components/BalanceChart';
import BalanceEmptyBlock from './components/BalanceEmptyBlock';
import handlerBalanceHistory from './handlers/handlerBalanceHistory.mixin';
import { mapGetters, mapState } from 'vuex';
import {
  formatPercentageValue,
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import BigNumber from 'bignumber.js';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
export default {
  components: {
    BalanceChart,
    BalanceEmptyBlock
  },
  mixins: [handlerBalanceHistory],
  data() {
    return {
      chartButtons: ['1D', '1W', '1M', '1Y'],
      chartData: [],
      timeString: '',
      scale: '',
      activeButton: 0,
      loading: true
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapGetters('global', ['network', 'hasSwap']),
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
        this.network.type.name
      }`;
    },
    sendText() {
      return `Send ${this.network.type.currencyName}`;
    },
    swapText() {
      return `Swap ${this.network.type.currencyName}`;
    },
    subtitle() {
      return `My ${this.network.type.name} Balance`;
    },
    /**
     * Computed property returns formated eth wallet balance value in USD
     * ie: $12.45 per 1 ETH
     */
    convertedBalance() {
      if (this.fiatLoaded) {
        return `${this.networkTokenUSDMarket.symbol}${
          formatFiatValue(this.balanceFiatValue).value
        }`;
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
        return `${this.networkTokenUSDMarket.symbol}${
          formatFiatValue(this.fiatValue).value
        }`;
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
            this.loading = false;
            // a single point basically looks the same as an empty chart
          } else if (this.chartData.length <= 1) {
            count++;
            checker();
          } else {
            this.activeButton = count;
            this.loading = false;
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
      this.$router.push({ name: ROUTES_WALLET.SWAP.NAME });
    }
  }
};
</script>
<style lang="scss">
.module-balance-loader {
  .v-skeleton-loader__image {
    height: 352px;
  }
}
</style>
