<template>
  <div class="balance-wrapper">
    <div
      :class="[
        'balance-container',
        title === 'Earnings' ? 'earnings-container-height' : 'border-bottom'
      ]"
    >
      <div class="title-container">
        <p class="title">{{ title }}</p>
        <span v-if="title === 'Earnings'" class="key-container">
          <div class="apr-circle"></div>
          <span>{{ $t('dappsAave.apr') }}</span>
          <div class="total-circle"></div>
          <span>{{ $t('dappsAave.total') }}</span>
        </span>
      </div>
      <i v-show="loadingHome" class="fa fa-spinner fa-spin" />
      <span v-if="title !== 'Earnings' && !loadingHome">
        <p class="balance">${{ convertToFixed(balanceUsd) }}</p>
        <p class="eth-balance">
          {{ convertToFixed(balanceEth) }} {{ $t('common.currency.eth') }}
        </p>
      </span>
      <div v-if="title === 'Earnings'" class="earnings-container">
        <p v-if="earningsBalance === 0" class="no-data">
          {{ $t('dappsAave.no-data') }}
        </p>
      </div>
    </div>
    <div v-if="title !== 'Earnings'" class="composition-container">
      <div class="row">
        <span class="title">{{ $t('dappsAave.composition') }}</span>
        <div v-if="title !== 'Aggregated Balance'">
          <span class="percentage">{{ compositionPercentage }}</span>
          <span class="available">{{ $t('dappsAave.available') }}</span>
        </div>
        <div class="composition-bar"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    balanceEth: {
      type: String,
      default: ''
    },
    balanceUsd: {
      type: String,
      default: ''
    },
    compositionPercentage: {
      type: Number,
      default: 100
    },
    earningsBalance: {
      type: Number,
      default: 0
    },
    loadingHome: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    convertToFixed(val) {
      if (!val) {
        return 0;
      }
      return val.slice(0, val.indexOf('.') + 5);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'BalanceDisplay.scss';
</style>
