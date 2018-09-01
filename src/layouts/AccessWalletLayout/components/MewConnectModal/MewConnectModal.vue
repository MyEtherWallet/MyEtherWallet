<template>
  <b-modal
    ref="mewConnect"
    hide-footer
    class="bootstrap-modal modal-mew-connect"
    title="Access by MEW Connect"
    centered>
    <div class="modal-icon">
      <qrcode
        :value="QrCode"
        :options="{ size: 200 }"/>
        <!--<img class="icon" src="~@/assets/images/icons/qr-code.jpg">-->
    </div>
    <div class="d-block content-container text-center">
      <h3 class="modal-large-text">Please use MEWconnect App to scan the QR code above</h3>
    </div>
    <div class="appstore-button-container">
      <img src="~@/assets/images/icons/appstore.png">
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
import { MewConnectWallet } from '@/wallets';

export default {
  props: {
    networkAndAddressOpen: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      QrCode: ''
    };
  },
  mounted() {
    this.$refs.mewConnect.$on('show', () => {
      const wallet = new MewConnectWallet();
      this.setup(wallet);
      wallet
        .signalerConnect()
        .then(() => {
          this.$store.dispatch('decryptWallet', wallet);
          this.$router.push({ path: 'interface' });
        })
        .catch(_error => {
          // eslint-disable-next-line
          console.error(_error);
        });
    });
    this.$refs.mewConnect.$on('hidden', () => {
      // disconnect socket if not connected (the socket should disconnect eventually in all cases)
    });
  },
  methods: {
    setup(wallet) {
      wallet.registerListener('codeDisplay', this.codeDisplay);
      wallet.registerListener('RtcConnectedEvent', this.rtcConnected);
      wallet.registerListener('RtcClosedEvent', this.rtcClosed);
    },
    codeDisplay(qrCode) {
      this.QrCode = qrCode;
    },
    rtcConnected() {
      // eslint-disable-next-line
      console.log('RTC Connected: replace with notification for user');
    },
    rtcClosed() {
      // eslint-disable-next-line
      console.log('RTC Closed: replace with notification for user');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MewConnectModal.scss';
</style>
