<template>
  <div class="modal-container">
    <b-modal
      ref="signConfirmation"
      hide-footer
      centered
      class="bootstrap-modal-wide confirmation-modal nopadding"
      title="Confirmation">
      <div class="modal-content qrcode-modal">
        <div class="tx-info">
          <div class="tx-data tx-from">
            <div class="address-info">
              <p class="address-title">Signing Address</p>
              <p>{{ from }}</p>
            </div>
          </div>
          <div class="direction">
            <img src="~@/assets/images/icons/right-arrow.svg">
          </div>
          <div class="tx-data tx-to">
            <div class="address-info">
              <p class="address-title">Message</p>
              <p>{{ messageToSign }}</p>
            </div>
          </div>
        </div>
        <div class="submit-button-container">
          <div class="flex-center-align">
            <div class="button-with-helper">
              <div
                ref="ConfirmAndSendButton"
                :class="[signedMessage !== ''? '': 'disabled','submit-button large-round-button-green-filled clickable']"
                @click="signMessage">
                Confirm Signing
              </div>
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
          <p class="learn-more">Have any issues? <a href="/">Learn more</a></p>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    confirmSignMessage: {
      type: Function,
      default: function() {}
    },
    signedMessage: {
      type: String,
      default: ''
    },
    messageToSign: {
      type: String,
      default: ''
    },
    from: {
      type: String,
      default: ''
    },
    isHardwareWallet: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modalDetailInformation: false,
      transactionSigned: false
    };
  },
  computed: {
    signedMessageSignature() {
      if (this.signedMessage) {
        return this.signedMessage;
      } else if (this.isHardwareWallet) {
        return 'Please Approve on Hardware Wallet';
      }
      return '';
    }
  },
  methods: {
    signMessage() {
      if (this.signedMessage !== '') {
        this.confirmSignMessage();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ConfirmModal';
</style>
