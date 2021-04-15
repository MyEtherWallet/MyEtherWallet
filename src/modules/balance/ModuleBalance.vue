<template>
  <div v-if="network.type.name === 'ETH'">
    <!--
  =====================================================================================
    display if the user has an eth balance > 0
  =====================================================================================
  -->
    <mew-module
      v-if="!showBuyEth"
      class="pa-7"
      :subtitle="subtitle"
      :title="title"
      :icon="network.type.icon"
      :caption="convertedBalance"
      :has-elevation="true"
      :has-full-height="true"
      icon-align="left"
    >
      <template #rightHeaderContainer>
        <div class="d-flex align-center">
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
              @click.native="navigateToSend"
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
      v-else
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
      chartData: [],
      activeButton: 0
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
    this.initChart();
  },
  methods: {
    initChart() {
      let count = 0;
      const checker = () => {
        this.onToggle(this.chartButtons[count]).then(res => {
          if (count >= 3) {
            this.onToggle(this.chartButtons[count]);
            this.activeButton = count;
            // a single point basically looks the same as an empty chart
          } else if (res.length <= 1) {
            count++;
            checker();
          } else {
            this.activeButton = count;
          }
        });
      };
      checker();
    },
    onToggle(e) {
      switch (e) {
        case this.chartButtons[0]:
          return this.setDataYesterday();
        case this.chartButtons[1]:
          return this.setDataWeek();
        case this.chartButtons[2]:
          return this.setDataMonth();
        case this.chartButtons[3]:
          return this.setDataYear();
        default:
          return this.setDataMonth();
      }
    },
    getBalanceHistory(interval, duration) {
      return this.handlerBalance
        .getBalanceHistory(interval, duration)
        .then(res => {
          this.chartData = res;
          return res;
        });
    },
    setDataMonth() {
      const timeString = new Date();
      const lastMonth = timeString.getTime() - 1000 * 60 * 60 * 24 * 31;
      this.key = '1m';
      return this.getBalanceHistory(lastMonth, 'days');
    },
    setDataYear() {
      const timeString = new Date();
      const lastYear = timeString.getTime() - 1000 * 60 * 60 * 24 * 365;
      this.key = '1y';
      return this.getBalanceHistory(lastYear, 'days');
    },
    setDataWeek() {
      const timeString = new Date();
      const lastWeek = timeString.getTime() - 1000 * 60 * 60 * 24 * 7;
      this.key = '1w';
      return this.getBalanceHistory(lastWeek, 'days');
    },
    setDataYesterday() {
      const timeString = new Date();
      const yesterday = timeString.getTime() - 1000 * 60 * 60 * 24 * 1;
      this.key = '1d';
      return this.getBalanceHistory(yesterday, 'hours');
    },
    navigateToSend() {
      this.$router.push({ name: 'SendTX' });
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
