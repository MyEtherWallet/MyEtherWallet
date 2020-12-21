<template>
  <div class="amount-info-container">
    <div class="eth-icon">
      <img src="@/assets/images/currency/eth.svg" />
    </div>
    <div class="amount-text-container">
      <p class="amount-text">
        {{ directionSymbol }} {{ concattedAmount }}
        <span>{{ currency.toUpperCase() }}</span>
      </p>
      <p class="address-text">
        {{ $t('common.addr') }}:
        {{ displayedAddress }}
      </p>
      <p v-if="isContract">
        {{ $t('common.via-contract-address') }} {{ concat(address) }}
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
    receiver: {
      type: String,
      default: ''
    }
  },
  computed: {
    concattedAmount() {
      return `${this.amount}`.substring(0, 5);
    },
    directionSymbol() {
      return this.direction === 'to' ? '+' : '-';
    },
    displayedAddress() {
      return this.currency !== this.$store.state.main.network.type.name &&
        this.direction === 'to'
        ? this.concat(this.receiver)
        : this.concat(this.address);
    },
    isContract() {
      return (
        this.currency !== this.$store.state.main.network.type.name &&
        this.direction === 'to'
      );
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
