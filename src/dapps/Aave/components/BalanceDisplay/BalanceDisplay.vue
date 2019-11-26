<template>
  <div class="balance-wrapper">
    <div :class="['balance-container', title === 'Earnings' ? 'earnings-container-height' : 'border-bottom']">
      <div class="title-container">
        <p class="title">{{ title }}</p>
        <span class="key-container" v-if="title === 'Earnings'">
          <div class="apr-circle"></div>
          <span>{{$t('dappsAave.apr')}}</span>
          <div class="total-circle"></div>
          <span>{{$t('dappsAave.total')}}</span>
        </span>
      </div>
      <span v-if="title !== 'Earnings'">
        <p class="balance">$ {{balance}} </p>
        <p class="eth-balance">0 {{ $t('common.currency.eth') }}</p>
      </span>
      <div class="earnings-container" v-if="title === 'Earnings'">
        <p class="no-data" v-if="earningsBalance === 0">{{$t('dappsAave.no-data')}}</p>
      </div>
    </div>
    <div class="composition-container" v-if="title !== 'Earnings'">
      <div class="row">
        <span class="title">{{ $t('dappsAave.composition') }}</span>
        <div v-if="title !== 'Aggregated Balance'">
          <span class="percentage">{{compositionPercentage}}</span>
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
    balance: {
      type: String,
      default: '0.00'
    },
    compositionPercentage: {
      type: String,
      default: '100%'
    },
    earningsBalance: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'BalanceDisplay.scss';
</style>
