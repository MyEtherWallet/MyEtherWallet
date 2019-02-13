<template>
  <b-modal
    ref="mewConnect"
    :title="$t('accessWallet.mewConnectTitle')"
    hide-footer
    class="bootstrap-modal modal-mew-connect"
    centered
  >
    <div class="modal-icon">
      <qrcode :value="QrCode" :options="{ size: 200 }" />
    </div>
    <div class="d-block content-container text-center">
      <h3 class="modal-large-text">{{ $t('accessWallet.mewConnectDesc1') }}</h3>
    </div>
    <div class="appstore-button-container">
      <a
        href="https://itunes.apple.com/us/app/mewconnect/id1391097156?mt=8"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="~@/assets/images/icons/appstore.svg" height="35" />
      </a>
      <a
        href="http://play.google.com/store/apps/details?id=com.myetherwallet.mewconnect"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="~@/assets/images/icons/google-play.svg" height="35" />
      </a>
      <p class="download-now">{{ $t('accessWallet.mewConnectDesc2') }}</p>
    </div>
    <customer-support />
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import { MewConnectWallet } from '@/wallets';
import { mapGetters } from 'vuex';
import { ErrorHandler } from '@/helpers';

export default {
  components: {
    'customer-support': CustomerSupport
  },
  data() {
    return {
      QrCode: ''
    };
  },
  computed: {
    ...mapGetters({
      path: 'path',
      web3: 'web3'
    })
  },
  mounted() {
    this.$refs.mewConnect.$on('show', () => {
      new MewConnectWallet(this.codeDisplay)
        .then(wallet => {
          console.log('mewconnect modal', wallet); // todo remove dev item
          if (!this.web3.eth) this.$store.dispatch('setWeb3Instance');
          this.$store.dispatch('decryptWallet', [wallet]).then(() => {
            console.log('open interface'); // todo remove dev item
            this.$router.push({
              path: 'interface'
            });
          });
        })
        .catch(e => {
          ErrorHandler(e, false);
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
