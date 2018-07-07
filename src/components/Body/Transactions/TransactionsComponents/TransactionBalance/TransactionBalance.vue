<template>
  <div class="transaction-info-blocks">

    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->
    <div class="modal-container">
      <!-- Modal (MEW Connect) ============================================================================================================================================ -->
      <b-modal ref="balance" hide-footer centered class="bootstrap-modal balance nopadding" title="Balance">
        <div class="content-block">
          <div class="flex-container">
            <h4 class="modal-title">Total Balance</h4>
            <div class="margin-left-auto total-balance-amount">
              <span>{{balance}}</span> ETH
            </div>
          </div>
        </div>
        <div class="content-block">
          <h4>Equivalent Values</h4>
          <div class="grid-3">
            <p>BTC: 122.00</p>
            <p>CHF: 5234.24</p>
            <p>REP: 42122.00</p>
            <p>USD: $234212.32</p>
            <p>EUR: €133422.32</p>
            <p>GBP: £634212.32</p>
          </div>
        </div>

      </b-modal>
    </div>
    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->

    <div v-on:click="balanceModalOpen" class="wrap">
      <div class="info-block balance">
        <div class="block-image">
          <img class="icon" src="~@/assets/images/icons/balance.svg">
        </div>
        <div class="block-content">
          <h2>Balance</h2>

          <h4>{{balance}} ETH</h4>
          <div class="icon-container">
            <img src="~@/assets/images/icons/more.svg">

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
      balance: 0
    }
  },
  methods: {
    balanceModalOpen () {
      this.$refs.balance.show()
    }
  },
  created (){
    var Web3 = require('web3');
    this.web3 = new Web3(new Web3.providers.HttpProvider('https://infuranet.infura.io'));
    this.eth = this.web3.eth.accounts.decrypt(JSON.parse(sessionStorage.ethEncrypt), sessionStorage.password);
    this.web3.eth.accounts.wallet.add(this.eth);
    this.web3.eth.defaultAccount = this.eth.address;
    this.getBalance();
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "TransactionBalance.scss";
</style>
