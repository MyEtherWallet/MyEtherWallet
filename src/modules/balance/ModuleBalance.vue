<template>
  <div v-if="network.type.name === 'ETH'">
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
      v-if="!showBuyEth && !loading"
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
            <div
              :class="[
                'ml-2 font-weight-regular',
                priceChange ? 'primary--text' : 'error--text'
              ]"
            >
              {{ ETHUSDValue.price_change_percentage_24h }}%
            </div>
            <v-icon
              :class="[priceChange ? 'primary--text' : 'error--text', 'body-2']"
              >{{ priceChangeArrow }}</v-icon
            >
            <div class="ml-5">
              {{ '$' + fiatValue }} / 1 {{ network.type.currenyName }} ETH
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
      v-if="showBuyEth && !loading"
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
import BigNumber from 'bignumber.js';

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
    ...mapGetters('global', ['network']),
    ...mapGetters('wallet', ['balanceInETH']),
    ...mapGetters('external', ['fiatValue']),
    ...mapState('external', ['ETHUSDValue']),
    ...mapGetters('global', ['isEthNetwork', 'network']),
    showBuyEth() {
      return this.balanceInETH <= 0 && this.chartData.length <= 0;
    },
    priceChangeArrow() {
      return this.priceChange ? 'mdi-arrow-up-bold' : 'mdi-arrow-down-bold';
    },
    priceChange() {
      return this.ETHUSDValue.price_change_percentage_24h > 0;
    },
    title() {
      return `${this.balanceInETH} ${this.network.type.name}`;
    },
    subtitle() {
      return `My ${this.network.type.name} Balance`;
    },
    convertedBalance() {
      const converted = BigNumber(this.balanceInETH).times(this.fiatValue);
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
      this.$router.push({ name: 'SendTX' });
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
