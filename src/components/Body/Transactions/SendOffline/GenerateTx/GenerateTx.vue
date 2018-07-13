<template>
  <div class="generate-info">
    <div class="wrap">

      <div class="send-form">
        <div class="form-block amount-to-address">
          <div class="amount">
            <div class="title">
              <h4>Amount</h4>
            </div>
            <div class="dropdown-select-search-1">
              <v-select :options="coinType" v-model="selectedCoinType"></v-select>
              <i class="fa fa-search" aria-hidden="true"></i>
            </div>
            <div class="the-form amount-number">
              <input type="number" placeholder="Deposit Amount" v-on:keyup="stateSetter('depositAmount', userInputDepositAmount)" v-model="userInputDepositAmount">
              <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
            </div>
          </div>
          <div class="to-address">
            <div class="title">
              <h4>To Address</h4>
              <img class="icon" src="~@/assets/images/icons/avatar.svg">
              <p v-on:click="copyToAddress" class="copy-button linker-1 prevent-user-select">Copy</p>
            </div>
            <div class="the-form address-block">
              <textarea id="to-address" name="name" placeholder="Please Enter The Address" v-on:keyup="stateSetter('toAddress', userInputToAddress)" v-model="userInputToAddress"></textarea>
              <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
            </div>
          </div> <!-- .to-address -->
        </div> <!-- .form-block .amount-to-address -->
        <div class="error-message-container">
          <p>You don't have enough funds</p>
        </div>
      </div> <!-- .send-form -->

      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <div class="title-helper">
              <h4>Data</h4>
              <div class="tooltip-box-1">
                <b-btn id="exPopover4"></b-btn>
                <b-popover target="exPopover4" triggers="hover focus" placement="top">
                  <template slot="title">MetaMask</template>
                  <img class="icon" src="~@/assets/images/icons/button-metamask.svg">
                  MetaMask is a <strong>bridge</strong> that allows you to visit the distributed web of tomorrow in your browser today.
                  It allows you to <strong>run Ethereum dApps right in your browser without running a full Ethereum node.</strong>
                  MetaMask includes a secure identity vault, providing a user interface to manage your identities on different sites and sign blockchain transactions.
                </b-popover>
              </div>
            </div>
          </div>
        </div>
        <div class="the-form gas-amount">
          <input type="number" name="" value="" placeholder="e.g. 0x65746865726d696e652d657531" v-on:keyup="stateSetter('data', userInputData)" v-model="userInputData">
          <div class="good-button-container">
            <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
          </div>
        </div>
      </div>

      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <div class="title-helper">
              <h4>Speed of Transaction</h4>
              <div class="tooltip-box-1">
                <b-btn id="exPopover1"></b-btn>
                <b-popover target="exPopover1" triggers="hover focus" placement="top">
                  <template slot="title">MetaMask</template>
                  <img class="icon" src="~@/assets/images/icons/button-metamask.svg">
                  MetaMask is a <strong>bridge</strong> that allows you to visit the distributed web of tomorrow in your browser today.
                  It allows you to <strong>run Ethereum dApps right in your browser without running a full Ethereum node.</strong>
                  MetaMask includes a secure identity vault, providing a user interface to manage your identities on different sites and sign blockchain transactions.
                </b-popover>
              </div>
            </div>
            <p>Transcation Fee: 0.000013 ETH ($1.234)</p>
          </div>
          <div class="buttons">
            <div class="small-circle-button-green-border" v-on:click="setGasAmount('gweiSlow')">
              Slow
            </div>
            <div class="small-circle-button-green-border active" v-on:click="setGasAmount('gweiRegular')">
              Regular
            </div>
            <div class="small-circle-button-green-border" v-on:click="setGasAmount('gweiFast')">
              Fast
            </div>
          </div>
        </div>
        <div class="the-form gas-amount">
          <input type="number" name="" value="" placeholder="Gas Amount" v-on:keyup="stateSetter('speedOfTransaction', userInputSpeedOfTransaction)" v-model="userInputSpeedOfTransaction">
          <div class="good-button-container">
            <p>Gwei</p>
            <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
          </div>
        </div>
      </div>

      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <div class="title-helper">
              <h4>Nonce</h4>
              <div class="tooltip-box-1">
                <b-btn id="exPopover2"></b-btn>
                <b-popover target="exPopover2" triggers="hover focus" placement="top">
                  <template slot="title">MetaMask</template>
                  <img class="icon" src="~@/assets/images/icons/button-metamask.svg">
                  MetaMask is a <strong>bridge</strong> that allows you to visit the distributed web of tomorrow in your browser today.
                  It allows you to <strong>run Ethereum dApps right in your browser without running a full Ethereum node.</strong>
                  MetaMask includes a secure identity vault, providing a user interface to manage your identities on different sites and sign blockchain transactions.
                </b-popover>
              </div>
            </div>
          </div>
        </div>
        <div class="the-form gas-amount">
          <input type="number" name="" value="" placeholder="Gas Amount" v-on:keyup="stateSetter('nonce', userInputNonce)" v-model="userInputNonce">
          <div class="good-button-container">
            <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
          </div>
        </div>
      </div>

      <div class="send-form">
        <div class="title-container">
          <div class="title">
            <div class="title-helper">
              <h4>Gas Limit</h4>
              <div class="tooltip-box-1">
                <b-btn id="exPopover3"></b-btn>
                <b-popover target="exPopover3" triggers="hover focus" placement="top">
                  <template slot="title">MetaMask</template>
                  <img class="icon" src="~@/assets/images/icons/button-metamask.svg">
                  MetaMask is a <strong>bridge</strong> that allows you to visit the distributed web of tomorrow in your browser today.
                  It allows you to <strong>run Ethereum dApps right in your browser without running a full Ethereum node.</strong>
                  MetaMask includes a secure identity vault, providing a user interface to manage your identities on different sites and sign blockchain transactions.
                </b-popover>
              </div>
            </div>
          </div>
        </div>
        <div class="the-form gas-amount">
          <input type="number" name="" value="" placeholder="Gas Amount" v-on:keyup="stateSetter('gasLimit', userInputGasLimit)" v-model="userInputGasLimit">
          <div class="good-button-container">
            <p>Gwei</p>
            <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
          </div>
        </div>
      </div>

      <div class="submit-button-container">
        <div class="submit-button large-round-button-green-filled clickable">
          Generate
        </div>
        <p>Have any issues? <a href="/">Learn more</a></p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedCoinType: this.stateGetter('coinType'),
      userInputDepositAmount: this.stateGetter('depositAmount'),
      userInputToAddress: this.stateGetter('toAddress'),
      userInputSpeedOfTransaction: this.stateGetter('speedOfTransaction'),
      userInputNonce: this.stateGetter('nonce'),
      userInputData: this.stateGetter('data'),
      userInputGasLimit: this.stateGetter('gasLimit'),
      coinType: [
        {label: 'ETH', value: 'eth'},
        {label: '$FFC', value: 'ffc'},
        {label: '$FYX', value: 'fyx'},
        {label: '0xBTC', value: 'oxbtc'}
      ]
    }
  },
  methods: {
    copyToAddress: function () {
      document.querySelector('#to-address').select()
      document.execCommand('copy')
    },
    stateSetter: function (state, data) {
      this.$store.state.state.sendOfflineData.stateSetter(state, data)
    },
    stateGetter: function (state, data) {
      return this.$store.state.state.sendOfflineData.stateGetter(state)
    },
    setGasAmount: function (speedName) {
      var speedVal = this.stateGetter(speedName)
      this.stateSetter('speedOfTransaction', speedVal)
      this.userInputSpeedOfTransaction = speedVal
    }
  },
  watch: {
    selectedCoinType: function (val) {
      this.stateSetter('coinType', {label: val.label, value: val.value})
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "GenerateTx.scss";
</style>
