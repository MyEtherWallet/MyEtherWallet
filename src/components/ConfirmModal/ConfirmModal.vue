<template>
  <div class="modal-container">
    <success-modal message="Your transaction is converting. A notification will be sent to you when it is completed." linkMessage="Ok"></success-modal>
    <b-modal ref="confirmation" hide-footer centered class="bootstrap-modal-wide confirmation-modal nopadding" title="Confirmation">
      <div class="modal-content qrcode-modal">
        <div class="tx-info">
          <div class="tx-data tx-from">
            <img src="~@/assets/images/icons/eth.svg">
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
            <img src="~@/assets/images/icons/btc.svg">
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
</template>

<script>
import SuccessModal from '@/components/SuccessModal'

export default {
  components: {
    'success-modal': SuccessModal
  },
  data () {
    return {
      modalDetailInformation: false
    }
  },
  methods: {
    successModalOpen () {
      this.$children[0].$refs.success.show()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "ConfirmModal.scss";
</style>
