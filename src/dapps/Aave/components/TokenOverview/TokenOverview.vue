<template>
  <div class="overview-container">
    <div class="header">
      <i18n tag="p" class="title" path="dappsAave.token-overview">
        <span slot="token" class="title">{{ token.symbol }}</span>
      </i18n>
      <img
        v-if="token.symbol !== undefined && !getIcon(token.symbol)"
        class="token-icon"
        :src="
          require(`@/assets/images/currency/coins/AllImages/${token.symbol.toUpperCase()}.svg`)
        "
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
        <div class="key-container">
          <div class="key"></div>
          <p>{{ $t('dappsAave.apr') }}</p>
        </div>
      </div>
      <p class="info">{{ $t('dappsAave.no-data') }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import '@/assets/images/currency/coins/asFont/cryptocoins.css';
import '@/assets/images/currency/coins/asFont/cryptocoins-colors.css';
import { hasIcon } from '@/partners';

export default {
  computed: {
    ...mapState('aave', ['token'])
  },
  methods: {
    getIcon(currency) {
      return hasIcon(currency);
    },
    convertToFixed(val) {
      if (!val) {
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
