<template>
  <div class="access-my-wallet-options">
    <ledger-app-modal
      ref="ledgerAppModal"
      :networks="Networks"
      @hardwareWalletOpen="hardwareWalletOpen"
    />
    <mew-connect-modal
      ref="mewconnectModal"
      :network-and-address-open="networkAndAddressOpen"
    />

    <hardware-modal
      ref="hardwareModal"
      :ledger-app-open="ledgerAppModalOpen"
      :network-and-address-open="networkAndAddressOpen"
      @hardwareRequiresPassword="hardwarePasswordModalOpen"
      @hardwareWalletOpen="hardwareWalletOpen"
    />

    <hardware-password-modal
      ref="hardwarePasswordModal"
      :wallet-constructor="walletConstructor"
      :hardware-brand="hardwareBrand"
      @hardwareWalletOpen="hardwareWalletOpen"
    />

    <network-and-address-modal
      ref="networkandaddressModal"
      :hardware-wallet="hardwareWallet"
    />

    <metamask-modal ref="metamaskModal" />

    <software-modal
      ref="softwareModal"
      :open-password="passwordOpen"
      :open-private-key-input="privateKeyOpen"
      :open-mnemonic-phrase-input="mnemonicphraseModalOpen"
      @file="fileUploaded"
    />

    <password-modal ref="passwordModal" :file="file" />

    <private-key-modal ref="privatekeyModal" />

    <mnemonic-modal
      ref="mnemonicPhraseModal"
      :hardware-wallet-open="hardwareWalletOpen"
    />

    <!--    <mnemonic-password-modal
      ref="mnemonicPhrasePassword"
      :hardware-wallet-open="hardwareWalletOpen"
      :phrase="phrase"
    />-->

    <wallet-password-modal />

    <enter-pin-number-modal />

    <div class="wrap">
      <div class="page-container">
        <div class="title">
          <h2>{{ $t('common.accessMyWallet') }}</h2>
          <h5>
            {{ $t('common.noWallet') }}
            <router-link :to="'/create-wallet'" class="nounderline">
              {{ $t('common.createANewWallet') }}
            </router-link>
          </h5>
        </div>
        <div class="buttons-container">
          <access-wallet-button
            v-for="(button, index) in buttons"
            :key="button.title + index"
            :func="button.func"
            :img="button.img"
            :img-disabled="button.imgDisabled"
            :title="button.title"
            :desc="button.desc"
            :recommend="button.recommend"
            :tooltip="button.tooltip"
            :disabled="button.disabled"
            :classname="button.classname"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AccessWalletButton from '../../components/AccessWalletButton';
import HardwareModal from '../../components/HardwareModal';
import HardwarePasswordModal from '../../components/HardwarePasswordModal';
import MetamaskModal from '../../components/MetamaskModal';
import MewConnectModal from '../../components/MewConnectModal';
import NetworkAndAddressModal from '../../components/NetworkAndAddressModal';
import PasswordModal from '../../components/PasswordModal';
import PrivateKeyModal from '../../components/PrivateKeyModal';
import SoftwareModal from '../../components/SoftwareModal';
import MnemonicPasswordModal from '../../components/MnemonicPasswordModal';
import MnemonicModal from '../../components/MnemonicModal';
import LedgerAppModal from '../../components/LedgerAppModal';
import WalletPasswordModal from '@/components/WalletPasswordModal';
import EnterPinNumberModal from '@/components/EnterPinNumberModal';

import mewConnectImg from '@/assets/images/icons/button-mewconnect.svg';
import hardwareImg from '@/assets/images/icons/button-hardware.svg';
import metamaskImg from '@/assets/images/icons/button-metamask.svg';
import softwareImg from '@/assets/images/icons/button-software.svg';

import mewConnectImgDisabled from '@/assets/images/icons/button-mewconnect-disabled.svg';
import hardwareImgDisabled from '@/assets/images/icons/button-hardware-disabled.svg';
import metamaskImgDisabled from '@/assets/images/icons/button-metamask-disabled.svg';
import softwareImgDisabled from '@/assets/images/icons/button-software-disabled.svg';

import { mapGetters } from 'vuex';
import { Toast } from '@/helpers';

import DetectRTC from 'detectrtc';

export default {
  components: {
    'mew-connect-modal': MewConnectModal,
    'network-and-address-modal': NetworkAndAddressModal,
    'hardware-modal': HardwareModal,
    'hardware-password-modal': HardwarePasswordModal,
    'metamask-modal': MetamaskModal,
    'software-modal': SoftwareModal,
    'password-modal': PasswordModal,
    'private-key-modal': PrivateKeyModal,
    'mnemonic-modal': MnemonicModal,
    'mnemonic-password-modal': MnemonicPasswordModal,
    'access-wallet-button': AccessWalletButton,
    'wallet-password-modal': WalletPasswordModal,
    'enter-pin-number-modal': EnterPinNumberModal,
    'ledger-app-modal': LedgerAppModal
  },
  data() {
    return {
      file: {},
      phrase: '',
      hardwareWallet: {},
      hardwareAddresses: [],
      walletConstructor: function() {},
      hardwareBrand: '',
      buttons: [
        {
          func: this.mewConnectModalOpen,
          title: this.$t('common.mewConnect'),
          desc: this.$t('accessWallet.mewConnectDesc'),
          recommend: '',
          tooltip: '',
          img: mewConnectImg,
          imgDisabled: mewConnectImgDisabled,
          disabled: false,
          classname: 'button-mewconnect'
        },
        {
          func: this.hardwareModalOpen,
          title: this.$t('common.hardware'),
          desc:
            'Ledger wallet, FINNEY, Trezor, Digital bitbox, Secalot, KeepKey',
          recommend: '',
          tooltip: '',
          img: hardwareImg,
          imgDisabled: hardwareImgDisabled,
          disabled: false,
          classname: 'button-hardware'
        },
        {
          func: this.metamaskModalOpen,
          title: 'MetaMask',
          desc: this.$t('accessWallet.metaMaskDesc'),
          recommend: '',
          tooltip: '',
          img: metamaskImg,
          imgDisabled: metamaskImgDisabled,
          disabled: false,
          classname: 'button-metamask'
        },
        {
          func: this.softwareModalOpen,
          title: this.$t('accessWallet.software'),
          desc: this.$t('accessWallet.softwareDesc'),
          recommend: this.$t('accessWallet.notRecommended'),
          tooltip: '',
          img: softwareImg,
          imgDisabled: softwareImgDisabled,
          disabled: false,
          classname: 'button-software'
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      online: 'online',
      Networks: 'Networks'
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.buttons.forEach(btn => {
        btn.disabled = this.isDisabled(btn.classname);
      });
    });
  },
  methods: {
    isDisabled(className) {
      switch (className) {
        case 'button-mewconnect':
          return !(this.online && DetectRTC.isWebRTCSupported);
        case 'button-hardware':
          return !this.online;
        default:
          return false;
      }
    },
    mewConnectModalOpen() {
      this.$refs.mewconnectModal.$refs.mewConnect.show();
    },
    ledgerAppModalOpen() {
      this.$refs.ledgerAppModal.$refs.ledgerApp.show();
    },
    networkAndAddressOpen() {
      this.$refs.networkandaddressModal.$refs.networkAndAddress.show();
    },
    hardwareModalOpen() {
      this.$refs.hardwareModal.$refs.hardware.show();
    },
    metamaskModalOpen() {
      this.$refs.metamaskModal.$refs.metamask.show();
    },
    softwareModalOpen() {
      this.$refs.softwareModal.$refs.software.show();
    },
    passwordOpen() {
      this.$refs.softwareModal.$refs.software.hide();
      this.$refs.passwordModal.$refs.password.show();
    },
    privateKeyOpen() {
      this.$refs.softwareModal.$refs.software.hide();
      this.$refs.privatekeyModal.$refs.privateKey.show();
    },
    installMetamaskModalOpen() {
      this.$refs.installMetamaskModal.$refs.installmetamask.show();
    },
    mnemonicphraseModalOpen() {
      this.$refs.mnemonicPhraseModal.$refs.mnemonicPhrase.show();
      this.$refs.softwareModal.$refs.software.hide();
    },
    // mnemonicphrasePasswordModalOpen(phrase) {
    //   this.phrase = phrase;
    //   this.$refs.mnemonicPhraseModal.$refs.mnemonicPhrase.hide();
    //   this.$refs.mnemonicPhrasePassword.$refs.password.show();
    // },
    fileUploaded(e) {
      this.file = e;
      this.passwordOpen();
    },
    hardwarePasswordModalOpen(hardwareNeedingPassword) {
      this.walletConstructor = hardwareNeedingPassword.walletConstructor;
      this.hardwareBrand = hardwareNeedingPassword.hardwareBrand;
      this.$refs.hardwareModal.$refs.hardware.hide();
      this.$refs.hardwarePasswordModal.$refs.password.show();
    },
    hardwareWalletOpen(wallet) {
      // if (this.$refs.mnemonicPhrasePassword.$refs.password.visible) {
      //   this.$refs.mnemonicPhrasePassword.$refs.password.hide();
      // }
      try {
        this.hardwareWallet = wallet;
        this.networkAndAddressOpen();
      } catch (e) {
        Toast.responseHandler(e, false);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AccessMyWalletContainer-desktop.scss';
@import 'AccessMyWalletContainer-tablet.scss';
@import 'AccessMyWalletContainer-mobile.scss';
</style>
