<template>
  <b-modal ref="mewConnect" hide-footer class="bootstrap-modal modal-mew-connect"
           title="Access by MEW Connect" centered>
    <div class="modal-icon">
      <qrcode :value="QrCode" :options="{ size: 200 }"></qrcode>
      <!--<img class="icon" src="~@/assets/images/icons/qr-code.jpg">-->
    </div>
    <div class="d-block content-container text-center">
      <h3 class="modal-large-text">Please use MEWconnect App to scan the QR code above</h3>
    </div>
    <div class="appstore-button-container">
      <img src="~@/assets/images/icons/appstore.png">
      <img src="~@/assets/images/icons/playstore.png">
      <p>Do not have our App? Download now.</p>
    </div>
    <div class="support">
      <router-link to="/">
        <div class="support-content">
          <div class="support-icon"><img src="~@/assets/images/icons/help-center.svg"></div>
          <div class="support-label"><h5>Customer Support</h5></div>
        </div>
      </router-link>
    </div>
  </b-modal>
</template>

<script>
import { MewConnectWallet } from '@/helpers/web3-overide/hardware'

export default {
  props: ['networkAndAddressOpen'],
  data () {
    return {
      QrCode: ''
    }
  },
  mounted () {
    this.$refs.mewConnect.$on('show', () => {
      const wallet = new MewConnectWallet()
      console.log(wallet) // todo remove dev item
      this.setup(wallet)
      console.log('modal shown') // todo remove dev item
      wallet.signalerConnect()
        .then(() => {
          this.$store.dispatch('decryptWallet', wallet)
          this.$router.push({path: 'interface'})
        })
        .catch(_error => {
          console.error(_error)
        })
    })
    this.$refs.mewConnect.$on('hidden', () => {
      console.log('modal hidden') // todo remove dev item
    })
  },
  methods: {
    setup (wallet) {
      wallet.registerListener('codeDisplay', this.codeDisplay)
      wallet.registerListener('RtcConnectedEvent', this.rtcConnected)
      wallet.registerListener('RtcClosedEvent', this.rtcClosed)
      // wallet.registerListener('address', makeWallet)
      // const mewConnect = wallet.getMewConnect()
      // mewConnect.on('codeDisplay', this.codeDisplay)
    },
    codeDisplay (qrCode) {
      this.QrCode = qrCode
    },
    rtcConnected () {
      console.log('RTC Connected') // todo remove dev item
    },
    rtcClosed () {
      console.log('RTC Closed') // todo remove dev item
    }
  }
};
</script>

<style lang="scss" scoped>
@import "MewConnectModal.scss";
</style>
