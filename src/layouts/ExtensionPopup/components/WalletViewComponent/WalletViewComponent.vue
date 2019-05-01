<template>
  <div class="wallet-view-container" @click="showFullAddr = !showFullAddr">
    <div class="wallet-view-info">
      <div>
        <blockie :address="address" width="50px" height="50px" />
      </div>
      <p class="name-address">
        <span class="name">{{ name }} </span><br />
        <span v-show="!showFullAddr">{{ concatAddr }}</span>
        <span v-show="showFullAddr">{{ address }}</span>
      </p>
      <i :class="[showFullAddr ? 'fa-chevron-up' : 'fa-chevron-down', 'fa']" />
    </div>
    <div class="wallet-view-balance">
      <p>Balance:</p>
      <p class="balance">
        <i v-show="!receivedBalance" class="fa fa-spinner fa-spin" />
        <span v-show="receivedBalance"> {{ concatBalance }} </span> ETH
      </p>
    </div>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie';
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
    }
  },
  data() {
    return {
      balance: 0,
      showFullAddr: false,
      receivedBalance: false
    };
  },
  computed: {
    concatAddr() {
      return `${this.address.substr(0, 10)}...${this.address.substr(
        this.address.length - 4,
        this.address.length
      )}`;
    },
    concatBalance() {
      const stringifiedBal = `${this.balance}`;
      return stringifiedBal.length > 11
        ? `${stringifiedBal.substr(0, 11)}...`
        : stringifiedBal;
    }
  },
  mounted() {
    this.fetchBalance();
  },
  methods: {
    async fetchBalance() {
      const balance = await document.web3.eth.getBalance(this.address);
      this.balance = document.web3.utils.fromWei(balance);
      this.receivedBalance = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'WalletViewComponent.scss';
</style>
