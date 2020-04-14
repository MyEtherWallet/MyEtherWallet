<template>
  <b-modal
    ref="mewConnect"
    :title="$t('accessWallet.mobile-app.modal.title')"
    hide-footer
    class="bootstrap-modal nopadding modal-mew-connect"
    centered
    static
    lazy
  >
    <div class="modal-container">
      <ipad-modal ref="ipadModal" />
      <div class="text-center modal-title-block">
        <h3>
          {{ $t('accessWallet.mewconnect.protocol') }}
        </h3>
        <div>
          {{ $t('accessWallet.mewconnect.option-text') }}
        </div>
      </div>
      <div class="qr-code-img">
        <qrcode :value="QrCode" :options="{ size: 150 }" />
      </div>
      <div class="appstore-button-container">
        <div class="links-container">
          <a
            v-if="canDownloadApple"
            href="https://itunes.apple.com/app/id1464614025"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt
              src="~@/assets/images/icons/button-app-store.png"
              height="35"
            />
          </a>
          <div v-else @click="openIpadModal">
            <img
              alt
              src="~@/assets/images/icons/button-app-store.png"
              height="35"
            />
          </div>
          <a
            href="https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt
              src="~@/assets/images/icons/button-google-play-color.png"
              height="35"
            />
          </a>
        </div>
        <p class="download-now">
          {{ $t('accessWallet.mewconnect.modal.text2') }}
        </p>
      </div>

      <div class="seperation-bar">
        <div class="bar" />
        <div class="text">{{ $t('accessWallet.or') }}</div>
      </div>

      <div class="buttons">
        <div @click="openWalletConnect">
          <img src="@/assets/images/icons/WalletConnect.svg" />
          {{ $t('accessWallet.wallet-connect') }}
        </div>
        <div @click="openWalletLink">
          <img src="@/assets/images/icons/WalletLink.svg" />
          {{ $t('accessWallet.wallet-link') }}
        </div>
      </div>
    </div>
    <!-- .modal-container -->
  </b-modal>
</template>

<script>
import { MewConnectWallet } from '@/wallets';
import { mapState, mapActions } from 'vuex';
import { Toast } from '@/helpers';
import platform from 'platform';
import IpadModal from '@/components/IpadModal';

export default {
  components: {
    'ipad-modal': IpadModal
  },
  props: {
    openWalletConnect: {
      type: Function,
      default: () => {}
    },
    openWalletLink: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      QrCode: '',
      canDownloadApple: true
    };
  },
  computed: {
    ...mapState('main', ['path', 'web3'])
  },
  mounted() {
    this.canDownloadApple =
      platform.product !== null
        ? platform.product.toLowerCase() !== 'ipad'
        : true;
    this.$refs.mewConnect.$on('show', () => {
      new MewConnectWallet(this.codeDisplay)
        .then(wallet => {
          if (!this.web3.eth) this.setWeb3Instance();
          this.decryptWallet([wallet]).then(() => {
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
    ...mapActions('main', ['setWeb3Instance', 'decryptWallet']),
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
