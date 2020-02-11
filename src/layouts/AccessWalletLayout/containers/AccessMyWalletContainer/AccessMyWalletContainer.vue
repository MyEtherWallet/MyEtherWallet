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
      :open-finney="finneyModalOpen"
      :open-xwallet="xwalletModalOpen"
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

    <metamask-modal
      ref="metamaskModal"
      :is-meta-mask="isMetaMask"
      :web3-wallet-exists="web3WalletExists"
    />

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

    <wallet-password-modal />
    <finney-modal ref="finney" />
    <xwallet-modal ref="xwallet" />
    <enter-pin-number-modal />

    <div class="wrap">
      <div class="page-container">
        <div class="title">
          <h2>{{ $t('common.wallet.access-my') }}</h2>
          <h5>
            {{ $t('common.wallet.do-not-have') }}
            <router-link :to="'/create-wallet'" class="nounderline">
              {{ $t('common.wallet.create-new') }}
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
            :title="$t(button.title)"
            :desc="$t(button.desc)"
            :recommend="$t(button.recommend)"
            :tooltip="$t(button.tooltip)"
            :disabled="button.disabled"
            :classname="button.classname"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FinneyModal from '../../components/FinneyModal';
import AccessWalletButton from '../../components/AccessWalletButton';
import HardwareModal from '../../components/HardwareModal';
import HardwarePasswordModal from '../../components/HardwarePasswordModal';
import Web3WalletModal from '../../components/Web3WalletModal';
import MewConnectModal from '../../components/MewConnectModal';
import NetworkAndAddressModal from '../../components/NetworkAndAddressModal';
import PasswordModal from '../../components/PasswordModal';
import PrivateKeyModal from '../../components/PrivateKeyModal';
import SoftwareModal from '../../components/SoftwareModal';
import MnemonicModal from '../../components/MnemonicModal';
import LedgerAppModal from '../../components/LedgerAppModal';
import WalletPasswordModal from '@/components/WalletPasswordModal';
import EnterPinNumberModal from '@/components/EnterPinNumberModal';
import XwalletModal from '../../components/XwalletModal';

import mobileApp from '@/assets/images/icons/button-cellphone.svg';
//import mewConnectImg from '@/assets/images/icons/button-mewconnect.svg';
import hardwareImg from '@/assets/images/icons/button-hardware.svg';
import web3Img from '@/assets/images/icons/button-web3.svg';
import softwareImg from '@/assets/images/icons/button-software.svg';

import mewConnectImgDisabled from '@/assets/images/icons/button-mewconnect-disabled.svg';
import hardwareImgDisabled from '@/assets/images/icons/button-hardware-disabled.svg';
import web3ImgDisabled from '@/assets/images/icons/button-web3-disabled.svg';
import softwareImgDisabled from '@/assets/images/icons/button-software-disabled.svg';

import { mapState } from 'vuex';
import { Toast } from '@/helpers';

import DetectRTC from 'detectrtc';

export default {
  components: {
    'mew-connect-modal': MewConnectModal,
    'network-and-address-modal': NetworkAndAddressModal,
    'hardware-modal': HardwareModal,
    'hardware-password-modal': HardwarePasswordModal,
    'metamask-modal': Web3WalletModal,
    'software-modal': SoftwareModal,
    'password-modal': PasswordModal,
    'private-key-modal': PrivateKeyModal,
    'mnemonic-modal': MnemonicModal,
    'access-wallet-button': AccessWalletButton,
    'wallet-password-modal': WalletPasswordModal,
    'enter-pin-number-modal': EnterPinNumberModal,
    'ledger-app-modal': LedgerAppModal,
    'finney-modal': FinneyModal,
    'xwallet-modal': XwalletModal
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
          title: 'accessWallet.mobile-app.option-title',
          desc: 'accessWallet.mobile-app.examples',
          recommend: '',
          tooltip: '',
          img: mobileApp,
          imgDisabled: mewConnectImgDisabled,
          disabled: false,
          classname: 'button-mewconnect'
        },
        {
          func: this.hardwareModalOpen,
          title: 'accessWallet.hardware.option-title',
          desc: 'accessWallet.hardware.examples',
          recommend: '',
          tooltip: '',
          img: hardwareImg,
          imgDisabled: hardwareImgDisabled,
          disabled: false,
          classname: 'button-hardware'
        },
        {
          func: this.web3WalletModal,
          title: 'accessWallet.web3-wallet',
          desc: 'accessWallet.web3-wallet-desc',
          recommend: '',
          tooltip: '',
          img: web3Img,
          imgDisabled: web3ImgDisabled,
          disabled: false,
          classname: 'button-metamask'
        },
        {
          func: this.softwareModalOpen,
          title: 'accessWallet.software.option-title',
          desc: 'accessWallet.software.option-text',
          recommend: 'common.not-recommended.string',
          tooltip: '',
          img: softwareImg,
          imgDisabled: softwareImgDisabled,
          disabled: false,
          classname: 'button-software'
        }
      ],
      isMetaMask: false,
      web3WalletExists: false
    };
  },
  computed: {
    ...mapState('main', ['Networks', 'online'])
  },
  mounted() {
    this.$nextTick(() => {
      this.buttons.forEach(btn => {
        btn.disabled = this.isDisabled(btn.classname);
      });

      this.checkWeb3();
      this.checkIsMetamask();
    });
  },
  methods: {
    checkIsMetamask() {
      this.isMetaMask = window.ethereum && window.ethereum.isMetaMask;
    },
    checkWeb3() {
      this.web3WalletExists =
        typeof window.ethereum !== 'undefined' ||
        typeof window.web3 !== 'undefined';
    },
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
    web3WalletModal() {
      this.checkWeb3();
      this.checkIsMetamask();
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
    installWeb3WalletModalOpen() {
      this.$refs.installWeb3WalletModal.$refs.installmetamask.show();
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
    finneyModalOpen() {
      this.$refs.finney.$refs.finneyModal.show();
    },
    xwalletModalOpen() {
      this.$refs.xwallet.$refs.xwalletModal.show();
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
