<template>
  <div class="amount-info-container">
    <div class="eth-icon">
      <img src="@/assets/images/currency/eth.svg" />
    </div>
    <div class="amount-text-container">
      <p class="amount-text">
        {{ direction === 'to' ? '+' : '-' }} {{ amount }}
        <span>{{ currency.toUpperCase() }}</span>
      </p>
      <p class="address-text">Address: {{ concat(address) }}</p>
      <p v-if="currency !== state.network.type.name">
        via Contract address {{ contractAddr }}
      </p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    address: {
      type: String,
      default: ''
    },
    amount: {
      type: String,
      default: '0'
    },
    currency: {
      type: String,
      default: 'ETH'
    },
    direction: {
      type: String,
      default: 'to'
    },
    contractAddr: {
      type: String,
      default: 'to'
    }
  },
  methods: {
    concat(addr) {
      const locAddr = addr;
      return `${locAddr.substr(0, 11)}...${locAddr.substr(
        locAddr.length - 4,
        locAddr.length
      )}`;
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'AmountInfoComponent.scss';
</style>
