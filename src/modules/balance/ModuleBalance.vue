<template>
  <div>
    <!--
  =====================================================================================
    display if the user has an eth balance > 0
  =====================================================================================
  -->
    <!-- TODO: mew-module: need to add icon height, add full-height prop & remove auto-height class-->
    <mew-module
      v-if="!showBuyEth"
      class="auto-height pa-7"
      :subtitle="subtitle"
      :title="title"
      :caption="convertedBalance"
      icon-align="left"
    >
      <template #rightHeaderContainer>
        <div class="d-flex align-center">
          <!-- TODO: mew-toggle: add prop to control-->
          <mew-toggle :button-group="chartButtons" @onBtnClick="onToggle" />
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
        <balance-chart :data="chartData" class="full-width mt-5" />
        <v-row class="align-center">
          <v-col class="d-flex align-center justify-center">
            <div class="font-weight-bold">{{ network.type.name }} PRICE</div>
            <div class="ml-2 font-weight-regular text-color--mew-green">
              ${{ ETHUSDValue.price_change_24h }}
            </div>
            <v-icon
              :class="[
                priceChange ? 'primary--text' : 'light_red--text error-text',
                'body-2'
              ]"
              >{{ priceChangeArrow }}</v-icon
            >
            <div class="ml-5">
              {{ ETHUSDValue.symbol + ETHUSDValue.value }} / 1
              {{ network.type.currenyName }} ETH
            </div>
          </v-col>
          <v-col class="text-right">
            <mew-button
              :has-full-width="false"
              title="Send Transaction"
              btn-size="xlarge"
              @click.native="navigateToSwap"
            />
          </v-col>
        </v-row>
      </template>
    </mew-module>
    <!--
    =====================================================================================
      display if the user has no eth balance
    =====================================================================================
    -->
    <balance-empty-block
      :network-type="network.type.name"
      :is-eth="isEthNetwork"
    />
  </div>
</template>

<script>
import BalanceChart from '@/modules/balance/components/BalanceChart';
import BalanceEmptyBlock from './components/BalanceEmptyBlock';
import handlerBalance from './handlers/handlerBalance';
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';

export default {
  components: {
    BalanceChart,
    BalanceEmptyBlock
  },
  data() {
    return {
      chartButtons: ['1D', '1W', '1M', '1Y'],
      chartData: []
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapGetters('global', ['network']),
    ...mapGetters('wallet', ['balanceInETH']),
    ...mapState('external', ['ETHUSDValue']),
    ...mapGetters('global', ['isEthNetwork', 'network']),
    showBuyEth() {
      return this.balanceInETH <= 0;
    },
    priceChangeArrow() {
      return this.priceChange > 0 ? 'mdi-arrow-up-bold' : 'mdi-arrow-down-bold';
    },
    priceChange() {
      return this.ETHUSDValue.price_change_24h > 0;
    },
    title() {
      return `${this.balanceInETH} ${this.network.type.name}`;
    },
    subtitle() {
      return `My ${this.network.type.name} Balance`;
    },
    convertedBalance() {
      const converted = BigNumber(this.balanceInETH).times(
        this.ETHUSDValue.value
      );
      return `$ ${converted.toFixed(2)}`;
    }
  },
  watch: {
    chartData: {
      handler: function () {},
      deep: true
    }
  },
  mounted() {
    this.handlerBalance = new handlerBalance(this.$apollo, this.address);
    this.setDataYesterday();
  },
  methods: {
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
    getBalanceHistory(interval, duration) {
      this.handlerBalance.getBalanceHistory(interval, duration).then(res => {
        this.chartData = res;
      });
    },
    setDataMonth() {
      const timeString = new Date();
      const lastMonth = timeString.getTime() - 1000 * 60 * 60 * 24 * 31;
      this.key = '1m';
      this.getBalanceHistory(lastMonth, 'days');
    },
    setDataYear() {
      const timeString = new Date();
      const lastYear = timeString.getTime() - 1000 * 60 * 60 * 24 * 365;
      this.key = '1y';
      this.getBalanceHistory(lastYear, 'days');
    },
    setDataWeek() {
      const timeString = new Date();
      const lastWeek = timeString.getTime() - 1000 * 60 * 60 * 24 * 7;
      this.key = '1w';
      this.getBalanceHistory(lastWeek, 'days');
    },
    setDataYesterday() {
      const timeString = new Date();
      const yesterday = timeString.getTime() - 1000 * 60 * 60 * 24 * 1;
      this.key = '1d';
      this.getBalanceHistory(yesterday, 'hours');
    }
  }
};
</script>
<style class="scss">
/* remove after updating mew-module */
.auto-height {
  height: auto !important;
}
</style>
