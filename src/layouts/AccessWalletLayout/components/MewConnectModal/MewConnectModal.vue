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
    </div>
    <div class="d-block content-container text-center">
      <h3 class="modal-large-text">Please use MEWconnect App to scan the QR code above</h3>
    </div>
    <div class="appstore-button-container">
      <img src="~@/assets/images/icons/appstore.png">
      <p>Do not have our App? Download now.</p>
    </div>
    <customer-support/>
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import { MewConnectWallet } from '@/wallets';

export default {
  components: {
    'customer-support': CustomerSupport
  },
  data() {
    return {
      QrCode: ''
    };
  },
  mounted() {
    this.$refs.mewConnect.$on('show', () => {
      new MewConnectWallet(this.codeDisplay)
        .then(wallet => {
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
    codeDisplay(qrCode) {
      this.QrCode = qrCode;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MewConnectModal-desktop.scss';
@import 'MewConnectModal-tablet.scss';
@import 'MewConnectModal-mobile.scss';
</style>
