<template>
  <div class="modal-container">
    <b-modal ref="confirmation" hide-footer centered class="bootstrap-modal-wide confirmation-modal nopadding" title="Confirmation">
      <div class="modal-content qrcode-modal">
        <div class="tx-info">
          <div class="tx-data tx-from">
            <!-- <img src="~@/assets/images/icons/eth.svg">
            <h3>1.00000 <span>ETH</span></h3> -->
            <div class="address-info">
              <p class="address-title">From Address</p>
              <p>{{from}}</p>
            </div>
          </div>
          <div class="direction" v-show="to !== '' && to !== undefined">
            <img src="~@/assets/images/icons/right-arrow.svg">
          </div>
          <div class="tx-data tx-to" v-show="to !== '' && to !== undefined">
            <!-- <img src="~@/assets/images/icons/btc.svg">
            <h3>0.006345 <span>BTC</span></h3> -->
            <div class="address-info">
              <p class="address-title">To Address</p>
              <p>{{to}}</p>
            </div>
          </div>
        </div>
        <div class="detail-info">
          <div class="info">
            <h4>Detail Information</h4>
            <div class="sliding-switch-white">
              <label class="switch">
                <input type="checkbox" v-on:click="modalDetailInformation = !modalDetailInformation" />
                <span class="slider round"></span>
              </label>
            </div>
          </div>
          <div class="expended-info" v-if="modalDetailInformation">
            <div class="grid-block">
              <p>Network</p><p>{{$store.state.network.type.name}} by {{$store.state.network.service}}</p>
            </div>
            <div class="grid-block">
              <p>Gas Limit</p><p>{{gas}} wei</p>
            </div>
            <div class="grid-block">
              <p>Gas Price</p><p>{{ gasPrice }} gwei</p>
            </div>
            <div class="grid-block">
              <p>Transaction Fee</p><p> {{fee}} ETH</p>
            </div>
            <div class="grid-block">
              <p>Nonce</p><p>{{nonce}}</p>
            </div>
            <div class="grid-block">
              <p>Data</p><p>{{data}}</p>
            </div>
          </div>
        </div>

        <div class="submit-button-container">
          <div class="flex-center-align">
            <div class="button-with-helper">
              <div class="submit-button large-round-button-green-filled clickable" v-on:click="sendTx">
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
// eslint-disable-next-line
const unit = require('ethjs-unit')

export default {
  props: ['fee', 'signedTx', 'data', 'from', 'gas', 'gasPrice', 'nonce', 'to', 'value', 'showSuccess'],
  data () {
    return {
      modalDetailInformation: false
    }
  },
  methods: {
    sendTx () {
      this.$store.state.web3.eth.sendSignedTransaction(this.signedTx).once('transactionHash', (hash) => {
        this.$store.dispatch('addNotification', [this.from, hash, 'Transaction Hash'])
      }).on('receipt', (res) => {
        this.$store.dispatch('addNotification', [this.from, res, 'Transaction Receipt'])
      }).on('error', (err) => {
        console.log(err)
        this.$store.dispatch('addNotification', [this.from, err, 'Transaction Error'])
      })

      this.$refs.confirmation.hide()
      this.showSuccess()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "ConfirmModal.scss";
</style>
