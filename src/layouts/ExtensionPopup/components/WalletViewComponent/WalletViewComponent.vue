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
      <p class="balance">1000 ETH</p>
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
      showFullAddr: false
    };
  },
  computed: {
    concatAddr() {
      return `${this.address.substr(0, 10)}...${this.address.substr(
        this.address.length - 4,
        this.address.length
      )}`;
    }
  },
  mounted() {
    window.web3.eth.getBalance(this.address).then(res => {
      this.balance = res;
    });
  }
};
</script>

<style lang="scss" scoped>
@import 'WalletViewComponent.scss';
</style>
