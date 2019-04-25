<template>
  <div class="wallet-view-container">
    <div class="wallet-view-info">
      <div>
        <blockie :address="address" width="50px" height="50px" />
      </div>
      <p class="name-address">
        <span>{{ name }} </span><br />
        {{ concatAddr }}
      </p>
    </div>
    <div class="wallet-view-balance"></div>
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
      balance: 0
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
