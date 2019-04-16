<template>
  <b-modal
    ref="mewConnect"
    :title="$t('accessWallet.mewConnectTitle')"
    hide-footer
    class="bootstrap-modal nopadding modal-mew-connect"
    centered
  >
    <div class="modal-container">
      <ipad-modal ref="ipadModal" />
      <div class="modal-icon">
        <qrcode :value="QrCode" :options="{ size: 200 }" />
      </div>
      <div class="d-block content-container text-center">
        <h3 class="modal-large-text">
          {{ $t('accessWallet.mewConnectDesc1') }}
        </h3>
      </div>
      <div class="appstore-button-container">
        <div class="links-container">
          <a
            v-if="canDownloadApple"
            href="https://itunes.apple.com/us/app/mewconnect/id1391097156?mt=8"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="~@/assets/images/icons/appstore.svg" height="35" />
          </a>
          <div v-else @click="openIpadModal">
            <img src="~@/assets/images/icons/appstore.svg" height="35" />
          </div>
          <a
            href="http://play.google.com/store/apps/details?id=com.myetherwallet.mewconnect"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="~@/assets/images/icons/google-play.svg" height="35" />
          </a>
        </div>
        <p class="download-now">{{ $t('accessWallet.mewConnectDesc2') }}</p>
      </div>
      <customer-support />
    </div>
    <!-- .modal-container -->
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import { MewConnectWallet } from '@/wallets';
import { mapGetters } from 'vuex';
import { Toast } from '@/helpers';
import platform from 'platform';
import IpadModal from '@/components/IpadModal';

export default {
  components: {
    'customer-support': CustomerSupport,
    'ipad-modal': IpadModal
  },
  data() {
    return {
      QrCode: '',
      canDownloadApple: true
    };
  },
  computed: {
    ...mapGetters({
      path: 'path',
      web3: 'web3'
    })
  },
  mounted() {
    this.canDownloadApple =
      platform.product !== null
        ? platform.product.toLowerCase() !== 'ipad'
        : true;
    this.$refs.mewConnect.$on('show', () => {
      new MewConnectWallet(this.codeDisplay)
        .then(wallet => {
          if (!this.web3.eth) this.$store.dispatch('setWeb3Instance');
          this.$store.dispatch('decryptWallet', [wallet]).then(() => {
            this.$router.push({
              path: 'interface'
            });
          });
        })
        .catch(e => {
          Toast.responseHandler(e, false);
        });
    });
    this.$refs.mewConnect.$on('hidden', () => {
      // disconnect socket if not connected (the socket should disconnect eventually in all cases)
    });
  },
  methods: {
    codeDisplay(qrCode) {
      this.QrCode = qrCode;
    },
    openIpadModal() {
      this.$refs.ipadModal.$refs.ipadModal.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MewConnectModal-desktop.scss';
@import 'MewConnectModal-tablet.scss';
@import 'MewConnectModal-mobile.scss';
</style>
