<template>
  <div>
    <!--
  =====================================================================================
    display if the user has an eth balance > 0
  =====================================================================================
  -->
    <!-- TODO: mew-module: add full-height prop & remove auto-height class-->
    <mew-module
      v-if="!showBuyEth"
      class="auto-height pa-7"
      :subtitle="subtitle"
      :title="title"
      :icon="network.type.icon"
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
    <v-sheet
      v-else
      class="module-no-balance pa-7"
      color="white"
      max-width="100%"
    >
      <div class="pa-12">
        <h2 class="mb-6">My {{ network.type.name }} balance is empty</h2>
        <mew-button
          :has-full-width="false"
          title="Buy ETH with a credit card"
          btn-size="xlarge"
          btn-link="https://ccswap.myetherwallet.com/#/"
        />
        <div class="d-flex align-center mt-4">
          <div>We accept credit card</div>
          <img
            v-if="!$vuetify.theme.dark"
            class="ml-2 mr-1"
            height="21"
            src="@/assets/images/icons/icon-visa-dark.png"
          />
          <img
            v-if="$vuetify.theme.dark"
            class="ml-2 mr-2"
            height="13"
            src="@/assets/images/icons/icon-visa-white.png"
          />
          <img
            height="18"
            src="@/assets/images/icons/icon-mastercard-mew.png"
          />
        </div>
        <div class="text-color--gray1 mt-12">
          Tip: You can also send your ETH here from another wallet!
        </div>
      </div>
    </v-sheet>
  </div>
</template>

<script>
import BalanceChart from '@/modules/balance/components/BalanceChart';
import handlerBalance from './handlers/handlerBalance';
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';

export default {
  components: {
    BalanceChart
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
.module-no-balance {
  background-image: url(~@/assets/images/backgrounds/bg-circle-triangle.png);
  background-position: right 60px bottom -1px;
  background-size: 245px;
  border-radius: 12px;
  left: 0;
  top: 0;
  width: 100%;
}

/* remove after updating mew-module */
.auto-height {
  height: auto !important;
}
</style>
