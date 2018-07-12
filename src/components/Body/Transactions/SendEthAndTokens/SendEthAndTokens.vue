<template>
  <div class="send-eth-and-tokens">

    <!-- .modal-container ************************ -->
    <div class="modal-container">
      <b-modal ref="confirmation" hide-footer centered class="bootstrap-modal-wide confirmation-modal nopadding" title="Confirmation">
        <div class="modal-content qrcode-modal">
          <div class="tx-info">
            <div class="tx-data tx-from">
              <img src="~@/assets/images/icons/eth2.svg">
              <h3>1.00000 <span>ETH</span></h3>
              <div class="address-info">
                <p class="address-title">From Address</p>
                <p>0x834rf8i34bh983ubg9i34uekrnegoin5o4inoet</p>
              </div>
            </div>
            <div class="direction">
              <img src="~@/assets/images/icons/right-arrow.svg">
            </div>
            <div class="tx-data tx-to">
              <img src="~@/assets/images/icons/btc2.svg">
              <h3>0.006345 <span>BTC</span></h3>
              <div class="address-info">
                <p class="address-title">To Address</p>
                <p>8734fg8734rg938hg034jg0394gj0394g</p>
              </div>
            </div>
          </div>
          <div class="detail-info">
            <div class="info">
              <h4>Detail Information</h4>
              <div class="sliding-switch-white">
                <label class="switch">
                  <input type="checkbox" v-on:click="modalDetailInformation = !modalDetailInformation">
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
            <div class="expended-info" v-if="modalDetailInformation">
              <div class="grid-block">
                <p>Network</p><p>ETH by etherapi.com</p>
              </div>
              <div class="grid-block">
                <p>Gas Limit</p><p>ETH by etherapi.com</p>
              </div>
              <div class="grid-block">
                <p>Gas Price</p><p>2100000 GWEI (0.00321 ETH=$1.234)</p>
              </div>
              <div class="grid-block">
                <p>Max Transaction Fee</p><p>441000 GWEI (0.000441)</p>
              </div>
              <div class="grid-block">
                <p>Nonce</p><p>0</p>
              </div>
              <div class="grid-block">
                <p>Data</p><p>None</p>
              </div>
            </div>
          </div>

          <div class="submit-button-container">
            <div class="flex-center-align">
              <div class="button-with-helper">
                <div class="submit-button large-round-button-green-filled clickable" v-on:click="successModalOpen">
                  Confirm and Send
                </div>
                <div class="tooltip-box-2">
                  <b-btn id="exPopover9">
                    <img class="icon" src="~@/assets/images/icons/qr-code.svg">
                  </b-btn>
                  <b-popover target="exPopover9" triggers="hover focus" placement="top">
                    <div class="qrcode-contents">
                      <p class="qrcode-title">Scan QR code to send/swap instantly</p>
                      <div class="qrcode-block">
                        <qrcode value="Hello, World!" :options="{ size: 100 }"></qrcode>
                      </div>
                      <p class="qrcode-helper">What is that?</p>
                    </div>
                  </b-popover>
                </div>
              </div>
            </div>
            <p class="learn-more">Have any issues? <a href="/">Learn more</a></p>
          </div>
        </div>
      </b-modal>
    </div>

    <b-modal ref="success" centered hide-footer hide-header class="bootstrap-modal success-modal">
      <div class="d-block text-center">
        <i class="check-icon fa fa-check" aria-hidden="true"></i>
        <h2 class="title">Succeed</h2>
      </div>
      <p class="text-center">Your transaction is converting. A notification will be sent to you when it is completed.</p>
      <div class="button-container">
        <b-btn class="mid-round-button-green-filled close-button" @click="hideModal">
          Ok
        </b-btn>
      </div>
    </b-modal>
    <!-- .modal-container ************************ -->

    <vue-header></vue-header>
    <div class="wrap">
      <div class="side-nav">
        <transactions-side-menu></transactions-side-menu>
      </div>
      <div class="contents">
        <div class="tx-contents">
          <div class="">
            <transaction-address />
          </div>
          <div class="">
            <transaction-balance />
          </div>
          <div class="">
            <transaction-network />
          </div>
          <div class="main-content">
            <div class="content-title">
              <h2>Send ETH & Tokens</h2>
            </div>

            <div class="send-form">
              <div class="form-block amount-to-address">
                <div class="amount">
                  <div class="title">
                    <h4>Amount</h4>
                  </div>
                  <div class="dropdown-select-search-1">
                    <v-select :options="coinType"></v-select>
                    <i class="fa fa-search" aria-hidden="true"></i>
                  </div>
                  <div class="the-form amount-number">
                    <input v-on:keyup="amountValidator(amount)" v-model="amount" type="number" placeholder="Amount">
                    <i v-if="!amountValidationMarker" class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
                    <i v-if="amountValidationMarker" class="fa fa-check-circle good-button" aria-hidden="true"></i>
                  </div>
                  <div class="error-message-container">
                    <p>You don't have enough funds</p>
                  </div>
                </div>
                <div class="to-address">
                  <div class="title">
                    <h4>To Address</h4>
                    <div class="blockies-image">
                      <div class="blockies" id="to-address-blockies" >
                        <div class="inset-shadow"></div>
                      </div>
                    </div>
                    <p v-on:click="copyToClipboard('address')" class="copy-button prevent-user-select">Copy</p>
                  </div>
                  <div class="the-form address-block">
                    <textarea v-on:keyup="toAddressValidator(toAddress)" v-model="toAddress" id="address" name="name"></textarea>
                    <i v-if="!toAddressValidationMarker" id="to-address-validation-marker" class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
                    <i v-if="toAddressValidationMarker" id="to-address-validation-marker" class="fa fa-check-circle good-button" aria-hidden="true"></i>
                  </div>
                  <div v-if="!toAddressValidationMarker && toAddress != ''" class="error-message-container">
                    <p>Invalid address</p>
                  </div>
                </div> <!-- .to-address -->
              </div> <!-- .form-block .amount-to-address -->
            </div> <!-- .send-form -->

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
                  <div class="small-circle-button-green-border"
                      v-on:click="gasAmount = 7; txSpeedButtonStatus.slow = true; txSpeedButtonStatus.reg = false; txSpeedButtonStatus.fast = false;"
                      v-if="!txSpeedButtonStatus.slow">
                    Slow
                  </div>
                  <div class="small-circle-button-green-border active" v-if="txSpeedButtonStatus.slow">
                    Slow
                  </div>
                  <div class="small-circle-button-green-border"
                      v-on:click="gasAmount = 12; txSpeedButtonStatus.slow = false; txSpeedButtonStatus.reg = true; txSpeedButtonStatus.fast = false;"
                      v-if="!txSpeedButtonStatus.reg">
                    Regular
                  </div>
                  <div class="small-circle-button-green-border active" v-if="txSpeedButtonStatus.reg">
                    Regular
                  </div>
                  <div class="small-circle-button-green-border"
                      v-on:click="gasAmount = 24; txSpeedButtonStatus.slow = false; txSpeedButtonStatus.reg = false; txSpeedButtonStatus.fast = true;"
                      v-if="!txSpeedButtonStatus.fast">
                    Fast
                  </div>
                  <div class="small-circle-button-green-border active" v-if="txSpeedButtonStatus.fast">
                    Fast
                  </div>
                </div>
              </div>

              <div class="the-form gas-amount">
                <input type="number" placeholder="Gas Amount"
                    v-model="gasAmount.gweiValue"
                    v-on:keyup="txSpeedButtonStatus.slow = false; txSpeedButtonStatus.reg = false; txSpeedButtonStatus.fast = false; gasAmountValidator(gasAmount.gweiValue);">
                <div class="good-button-container">
                  <p>Gwei</p>
                  <i v-if="!gasAmount.gweiValidationMarker" class="fa fa-check-circle good-button not-good" aria-hidden="true"></i>
                  <i v-if="gasAmount.gweiValidationMarker" class="fa fa-check-circle good-button" aria-hidden="true"></i>
                </div>
              </div>
            </div>

            <div class="send-form advanced">
              <div class="advanced-content">
                <div class="title">
                  <h4>Advanced</h4>
                  <div class="toggle-button">
                    <span>Data & Gas Limited</span>
                    <!-- Rounded switch -->
                    <div class="sliding-switch-white">
                      <label class="switch">
                        <input type="checkbox" v-on:click="advancedExpend = !advancedExpend">
                        <span class="slider round"></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="input-container" v-if="advancedExpend">
                  <div class="the-form user-input">
                    <input type="number" name="" value="" placeholder="Add Data (e.g. 0x7834f874g298hf298h234f)">
                  </div>
                  <div class="the-form user-input">
                    <input type="number" name="" value="" placeholder="Gas Limit">
                  </div>
                </div>
              </div>

            </div>

            <div class="submit-button-container">
              <div class="submit-button large-round-button-green-filled clickable" v-on:click="confirmationModalOpen">
                Send Transaction
              </div>
              <p>Have any issues? <a href="/">Learn more</a></p>
            </div>

          </div>
          <div class="tokens">
            <transaction-tokens />
          </div>
        </div>
      </div>
    </div>
    <vue-footer></vue-footer>
  </div>
</template>

<script>
import validate from 'validate.js'
import web3 from 'web3'
import makeBlockie from 'ethereum-blockies-base64'
export default {
  data () {
    return {
      coinType: [
        {label: 'ETH', value: 'eth'},
        {label: '$FFC', value: 'ffc'},
        {label: '$FYX', value: 'fyx'},
        {label: '0xBTC', value: 'oxbtc'}
      ],
      txSpeedButtonStatus: {
        slow: false,
        reg: false,
        fast: false
      },
      gasAmount: {
        gweiValidationMarker: false,
        gweiValue: ''
      },
      advancedExpend: false,
      modalDetailInformation: false,
      toAddress: '',
      toAddressValidationMarker: false,
      amount: '',
      amountValidationMarker: false
    }
  },
  methods: {
    copyToClipboard: function (id) {
      document.querySelector('#' + id).select()
      document.execCommand('copy')
    },
    confirmationModalOpen () {
      this.$refs.confirmation.show()
    },
    successModalOpen () {
      this.$refs.success.show()
    },
    hideModal () {
      this.$refs.success.hide()
      this.processChange('process1')
    },
    toAddressValidator (address) {
      var validationValue = web3.utils.isAddress(address)
      var blockiesContainer = document.getElementById('to-address-blockies')
      // Remove bloickies
      blockiesContainer.innerHTML = ''

      if (validationValue) {
        // Add bloickies
        const img = new Image()
        img.src = makeBlockie(address)
        blockiesContainer.appendChild(img)
        this.toAddressValidationMarker = true
      } else {
        this.toAddressValidationMarker = false
      }

      // Show invalid address alert
      this.invalidToAddress = !validationValue
    },
    amountValidator (amount) {
      var valiValue = validate({duration: amount}, {duration: {numericality: {strict: true}}})

      if (typeof valiValue === 'undefined') {
        this.amountValidationMarker = true
      } else {
        this.amountValidationMarker = false
      }
    },
    gasAmountValidator (amount) {
      var valiValue = validate({duration: amount}, {duration: {numericality: {strict: true}}})

      if (typeof valiValue === 'undefined') {
        this.gasAmount.gweiValidationMarker = true
      } else {
        this.gasAmount.gweiValidationMarker = false
      }
    }
  },
  mounted () {
    window.scrollTo(0, 0)
    this.$store.state.state.pageStates.activeMenuSetter(['send', 'sendEth'])
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
  @import "SendEthAndTokens.scss";
</style>
