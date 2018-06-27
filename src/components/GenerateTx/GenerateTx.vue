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
              <v-select :options="['foo','bar']"></v-select>
              <i class="fa fa-search" aria-hidden="true"></i>
            </div>
            <div class="the-form amount-number">
              <input type="number" name="" value="" placeholder="Deposit Amount">
              <i class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
            </div>
          </div>
          <div class="to-address">
            <div class="title">
              <h4>To Address</h4>
              <img class="icon" src="~@/assets/images/icons/avatar.svg">
              <p v-on:click="copyToAddress" class="copy-button linker-1">Copy</p>
            </div>
            <div class="the-form address-block">
              <textarea id="to-address" name="name" placeholder="Please Enter The Address"></textarea>
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
          <input type="number" name="" value="" placeholder="e.g. 0x65746865726d696e652d657531">
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
            <div class="small-circle-button-green-border">
              Slow
            </div>
            <div class="small-circle-button-green-border active">
              Regular
            </div>
            <div class="small-circle-button-green-border">
              Fast
            </div>
          </div>
        </div>
        <div class="the-form gas-amount">
          <input type="number" name="" value="" placeholder="Gas Amount">
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
          <input type="number" name="" value="" placeholder="Gas Amount">
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
          <input type="number" name="" value="" placeholder="Gas Amount">
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
    }
  },
  methods: {
    copyToAddress: function () {
      document.querySelector('#to-address').select()
      document.execCommand('copy')
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "GenerateTx.scss";
</style>
