<template>
  <div class="overview-container">
    <div class="header">
      <i18n tag="p" class="title" path="dappsAave.token-overview">
        <span slot="token" class="title">{{ token.symbol }}</span>
      </i18n>
      <img
        v-if="token.symbol !== undefined && !getIcon(token.symbol)"
        class="token-icon"
        :src="iconFetcher(token.symbol)"
      />
      <span
        v-if="token && getIcon(token.symbol)"
        :class="['cc', getIcon(token.symbol), 'cc-icon', 'currency-symbol']"
      ></span>
    </div>
    <div class="body-container">
      <div class="left-container">
        <p>{{ $t('dappsAave.utilization-rate') }}</p>
        <p>{{ $t('dappsAave.total-liquidity') }}</p>
        <p>{{ $t('dappsAave.avail-liquidity') }}</p>
        <p v-if="token.stableBorrowRateEnabled">
          {{ $t('dappsAave.stable-rate') }}
        </p>
        <p>{{ $t('dappsAave.variable-rate') }}</p>
      </div>
      <div class="right-container">
        <p>{{ convertToFixed(token.utilizationRate * 100) }}%</p>
        <p>{{ convertToFixed(token.totalLiquidity) }} {{ token.symbol }}</p>
        <p>{{ convertToFixed(token.availableLiquidity) }} {{ token.symbol }}</p>
        <p v-if="token.stableBorrowRateEnabled" class="stable-text">
          {{ convertToFixed(token.stableBorrowRate * 100) }}%
        </p>
        <p class="variable-text">
          {{ convertToFixed(token.variableBorrowRate * 100) }}%
        </p>
      </div>
    </div>
    <div class="footer-container">
      <div class="footer-header">
        <p class="title">{{ $t('dappsAave.historical-rate') }}</p>
      </div>
      <p
        v-if="rateHistory.labels && rateHistory.labels.length === 0"
        class="info"
      >
        {{ $t('dappsAave.no-data') }}
      </p>
      <historical-graph class="mt-3 mr-4" :rate-history="rateHistory" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import '@/assets/images/currency/coins/asFont/cryptocoins.css';
import '@/assets/images/currency/coins/asFont/cryptocoins-colors.css';
import { hasIcon } from '@/partners';
import HistoricalRatesGraph from '@/dapps/Aave/components/HistoricalRatesGraph';

export default {
  components: {
    'historical-graph': HistoricalRatesGraph
  },
  computed: {
    ...mapState('aave', ['token', 'rateHistory'])
  },
  methods: {
    iconFetcher(currency) {
      let icon;
      try {
        // eslint-disable-next-line
        icon = require(`@/assets/images/currency/coins/AllImages/${currency.toUpperCase()}.svg`);
      } catch (e) {
        // eslint-disable-next-line
        return require(`@/assets/images/icons/web-solution.svg`);
      }
      return icon;
    },
    getIcon(currency) {
      return hasIcon(currency);
    },
    convertToFixed(val) {
      if (!val || val == 0) {
        return 0;
      }
      return new BigNumber(val).toFixed(2).toString();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'TokenOverview.scss';
</style>
