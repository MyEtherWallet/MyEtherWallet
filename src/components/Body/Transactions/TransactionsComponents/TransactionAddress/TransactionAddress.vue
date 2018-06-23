<template>
  <div class="transaction-address">
    <div class="wrap">

      <div class="info-block address">
        <div class="block-image">
          <img class="icon" src="~@/assets/images/icons/avatar.svg">
        </div>
        <div class="block-content">
          <h2>Address</h2>
          <p class="address">{{this.eth.address}}</p>
          <div class="icon-container">
            <b-btn v-b-tooltip.hover title="I'm a tooltip!" class="custom-tooltip">
              <img src="~@/assets/images/icons/printer-white.svg">
            </b-btn>
            <b-btn v-b-tooltip.hover title="I'm a tooltip!" class="custom-tooltip">
              <img src="~@/assets/images/icons/copy.svg">
            </b-btn>
            <b-btn v-b-tooltip.hover title="I'm a tooltip!" class="custom-tooltip">
              <img src="~@/assets/images/icons/change.svg">
            </b-btn>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      eth: {address: ''},
      web3: {}
    }
  },
  created(){
    var Web3 = require('web3');
    this.web3 = new Web3(new Web3.providers.HttpProvider('https://infuranet.infura.io'));
  },
  mounted () {
    this.eth.address = sessionStorage.address;
  }
}
</script>

<style lang="scss" scoped>
  @import "TransactionAddress.scss";
</style>
