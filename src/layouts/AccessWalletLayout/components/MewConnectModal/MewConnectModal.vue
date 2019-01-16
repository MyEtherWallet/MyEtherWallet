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
      <p>{{ $t('accessWallet.mewConnectDesc2') }}</p>
    </div>
    <customer-support />
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import { MewConnectWallet } from '@/wallets';
import { mapGetters } from 'vuex';

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
      path: 'path'
    })
  },
  mounted() {
    this.$refs.mewConnect.$on('show', () => {
      new MewConnectWallet(this.codeDisplay)
        .then(wallet => {
          this.$store.dispatch('decryptWallet', [wallet]);
          this.$router.push({
            path: 'interface'
          });
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
