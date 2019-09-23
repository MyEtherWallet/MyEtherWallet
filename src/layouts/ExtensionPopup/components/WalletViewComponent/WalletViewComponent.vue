<template>
  <div class="wallet-view-container">
    <div class="wallet-view-info">
      <div>
        <blockie :address="address" width="50px" height="50px" />
      </div>
      <div>
        <p class="name-address">
          <span v-show="name !== ''" class="name"
            >{{ name.length > 14 ? concatName : name }} </span
          ><br />
          <span>{{ concatAddr }}</span>
        </p>
      </div>
    </div>
    <div class="wallet-view-balance">
      <p>Balance:</p>
      <p v-if="network.type.name === 'ETH'" class="converted-balance">
        $ {{ convertedBalance }}
      </p>
      <p class="balance">
        <span> {{ concatBalance }} </span> {{ network.type.name }}
      </p>
    </div>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie';
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';
export default {
  components: {
    blockie: Blockie
  },
  props: {
    address: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    balance: {
      type: String,
      default: '0'
    },
    usd: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(['network']),
    concatName() {
      return `${this.name.substring(0, 14)}...`;
    },
    concatAddr() {
      return `${this.address.substr(0, 18)}...${this.address.substr(
        this.address.length - 4,
        this.address.length
      )}`;
    },
    concatBalance() {
      const balance = new BigNumber(this.balance).toFixed(5);
      return new BigNumber(this.balance).gt(0) ? balance : this.balance;
    },
    convertedBalance() {
      return new BigNumber(this.balance).times(this.usd).toFixed(5);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'WalletViewComponent.scss';
</style>
