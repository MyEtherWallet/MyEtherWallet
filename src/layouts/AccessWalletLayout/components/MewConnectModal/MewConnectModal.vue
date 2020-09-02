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
          {{ $t('accessWallet.mewconnect.scan') }}
        </h3>
        <div>
          <p>{{ $t('accessWallet.mewconnect.option-text') }}</p>
          <i18n path="accessWallet.mewconnect.modal.text2" tag="p">
            <a
              slot="action"
              class="download-now"
              @click="downloadMEWWalletApp()"
              >{{ $t('accessWallet.mewconnect.modal.download-now') }}</a
            >
          </i18n>
        </div>
      </div>
      <div class="qr-code-container">
        <qrcode :value="QrCode" :options="{ size: 150 }" />
        <div class="instructions-container">
          <i18n path="accessWallet.mewconnect.instructions.step1" tag="p">
            <span slot="first">{{
              $t('accessWallet.mewconnect.instructions.first')
            }}</span>
          </i18n>
          <i18n path="accessWallet.mewconnect.instructions.step2" tag="p">
            <i18n
              slot="second"
              path="accessWallet.mewconnect.instructions.second"
              tag="span"
            >
              <span slot="icon-pos">
                <img
                  height="20"
                  src="@/assets/images/icons/scan.svg"
                  alt="camera"
                />
                {{ $t('accessWallet.mewconnect.instructions.icon-pos') }}</span
              >
            </i18n>
          </i18n>
          <i18n path="accessWallet.mewconnect.instructions.step3" tag="p">
            <span slot="third"
              >{{ $t('accessWallet.mewconnect.instructions.third') }}
            </span>
          </i18n>
        </div>
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
  </b-modal>
</template>

<script>
import { MewConnectWallet } from '@/wallets';
import { mapState, mapActions } from 'vuex';
import { Toast } from '@/helpers';
import IpadModal from '@/components/IpadModal';
import { Misc } from '@/helpers';
import mewWalletIcon from '@/assets/images/icons/mew-wallet-icon.png';

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
    const downloadMEWWalletApp = Misc.downloadMEWWalletApp;
    return {
      QrCode: '',
      downloadMEWWalletApp: downloadMEWWalletApp,
      mewWalletIcon: mewWalletIcon
    };
  },
  computed: {
    ...mapState('main', ['path', 'web3'])
  },
  mounted() {
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
