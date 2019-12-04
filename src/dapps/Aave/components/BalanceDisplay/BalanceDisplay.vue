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
      <span v-if="title !== 'Earnings'">
        <p class="balance">${{getUSDBalance()}}</p>
        <p class="eth-balance"> {{ balance }} {{ $t('common.currency.eth') }}</p>
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
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    balance: {
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
    }
  },
  computed: {
    ...mapState(['online'])
  },
  mounted() {
    console.error('hello', this.balance, typeof this.balance)
    if (this.online) this.getEthPrice();
  },
  methods: {
    getUSDBalance() {
      let usdBalance = 0;
      if (this.balance) {
        usdBalance = new BigNumber(
          new BigNumber(this.balance).times(
            new BigNumber(this.ethPrice)
          )
        ).toFixed(2);
      }
      return usdBalance;
    },
    async getEthPrice() {
      const price = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=ETH'
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
        });
      this.ethPrice =
        typeof price === 'object' ? price.data.ETH.quotes.USD.price : 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'BalanceDisplay.scss';
</style>
