<template>
  <div class="wallet-view-container">
    <div class="wallet-view-info">
      <div>
        <blockie :address="address" width="50px" height="50px" />
      </div>
      <div v-show="shouldConcat">
        <p class="name-address">
          <span v-show="name !== ''" class="name">{{ name }} </span><br />
          <span v-show="!showFullAddr">{{ concatAddr }}</span>
          <span v-show="showFullAddr">{{ address }}</span>
        </p>
        <i
          :class="[showFullAddr ? 'fa-chevron-up' : 'fa-chevron-down', 'fa']"
          @click="showFullAddr = !showFullAddr"
        />
      </div>
      <div v-show="!shouldConcat">
        <p class="name-address">
          <span v-show="name !== ''" class="name">{{ name }} </span><br />
          <span>{{ address }}</span>
        </p>
      </div>
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
    },
    shouldConcat: {
      type: Boolean,
      default: true
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
    if (window.web3) {
      this.fetchBalance();
    }
  },
  methods: {
    async fetchBalance() {
      if (this.address !== '0x') {
        const balance = await window.web3.eth.getBalance(this.address);
        this.balance = window.web3.utils.fromWei(balance);
        this.receivedBalance = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'WalletViewComponent.scss';
</style>
