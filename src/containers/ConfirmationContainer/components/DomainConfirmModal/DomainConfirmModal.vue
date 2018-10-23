<template>
  <div class="domain-confirm-modal">
    <b-modal
      ref="domainconfirmation"
      hide-footer
      centered
      class="bootstrap-modal-wide confirmation-modal nopadding"
      title="Confirmation">
      <div class="modal-content qrcode-modal">
        <div class="tx-info">
          <div class="tx-data tx-from">
            <div class="amount-box">
              <img 
                class="currency-icon" 
                src="~@/assets/images/currency/eth.svg">
              <h3>1.00000 <span>ETH</span></h3>
            </div>
            <div class="address-info">
              <p class="address-title">From Address</p>
              <p>0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D{{ from }}</p>
            </div>
          </div>
          <div
            class="direction">
            <img src="~@/assets/images/icons/right-arrow.svg">
          </div>
          <div
            class="tx-data tx-to">
            <div class="amount-box">
              <img 
                class="currency-icon" 
                src="~@/assets/images/currency/btc.svg">
              <h3>0.006345 <span>BTC</span></h3>
            </div>
            <div class="address-info">
              <p class="address-title">To Address</p>
              <p>1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9{{ to }}</p>
            </div>
          </div>
        </div>
        <div class="detail-info">
          <div class="info">
            <h4>Detail Information</h4>
            <div class="sliding-switch-white">
              <label class="switch">
                <input
                  type="checkbox"
                  @click="modalDetailInformation = !modalDetailInformation" >
                <span class="slider round"/>
              </label>
            </div>
          </div>
          <div
            v-if="modalDetailInformation"
            class="expended-info">
            <div class="grid-block">
              <p>Network</p><p>{{ $store.state.network.type.name }} by {{ $store.state.network.service }}</p>
            </div>
            <div class="grid-block">
              <p>Gas Limit</p><p>{{ gas }} wei</p>
            </div>
            <div class="grid-block">
              <p>Gas Price</p><p>{{ gasPrice }} gwei</p>
            </div>
            <div class="grid-block">
              <p>Transaction Fee</p><p> {{ fee }} ETH</p>
            </div>
            <div class="grid-block">
              <p>Nonce</p><p>{{ nonce }}</p>
            </div>
            <div class="grid-block">
              <p>Data</p><p>{{ data }}</p>
            </div>
          </div>
        </div>

        <div class="submit-button-container">
          <div class="flex-center-align">
            <div class="button-with-helper">

              <standard-button 
                :options="buttonContinue"
                @click.native="continueAccess"
              />

              <!--
              <div
                ref="ConfirmAndSendButton"
                :class="[signedTx !== ''? '': 'disabled','submit-button large-round-button-green-filled clickable']"
                @click="sendTx">
                Confirm and Send
              </div>
            -->
              <div class="tooltip-box-2">
                <b-btn id="exPopover9">
                  <img
                    class="icon"
                    src="~@/assets/images/icons/qr-code.svg">
                </b-btn>
                <b-popover
                  target="exPopover9"
                  triggers="hover focus"
                  placement="top">
                  <div class="qrcode-contents">
                    <p class="qrcode-title">Scan QR code to send/swap instantly</p>
                    <div class="qrcode-block">
                      <qrcode
                        :options="{ size: 100 }"
                        value="Hello, World!"/>
                    </div>
                    <p class="qrcode-helper">What is that?</p>
                  </div>
                </b-popover>
              </div>
            </div>
          </div>
          <p class="learn-more">Having issues? <a href="/">Help Center</a></p>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
// eslint-disable-next-line
const unit = require('ethjs-unit');

export default {
  props: {
    confirmSendTx: {
      type: Function,
      default: function() {}
    },
    fee: {
      type: Number,
      default: 0
    },
    signedTx: {
      type: String,
      default: ''
    },
    data: {
      type: String,
      default: ''
    },
    from: {
      type: String,
      default: ''
    },
    gas: {
      type: Number,
      default: 0
    },
    gasPrice: {
      type: Number,
      default: 0
    },
    nonce: {
      type: Number,
      default: 0
    },
    to: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      default: 0
    },
    isHardwareWallet: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      buttonContinue: {
        title: 'Confirm and Send',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true
      },
      modalDetailInformation: false,
      transactionSigned: false
    };
  },
  computed: {
    signedTransaction() {
      if (this.signedMessage) {
        return this.signedMessage;
      } else if (this.isHardwareWallet) {
        return 'Please Approve on Hardware Wallet';
      }
      return '';
    }
  },
  mounted() {
    //this.$refs.domainconfirmation.show();
  },
  methods: {
    sendTx() {
      if (this.signedTx !== '') {
        this.confirmSendTx();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DomainConfirmModal.scss';
</style>
