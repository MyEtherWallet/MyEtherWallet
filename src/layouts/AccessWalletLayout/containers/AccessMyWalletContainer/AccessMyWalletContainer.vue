<template>
  <div class="access-my-wallet-options">

    <install-metamask-modal
      ref="installMetamaskModal"
      :metamaskmodal="installMetamaskModalOpen"/>
    <access-by-mnemonic-phrase-modal
      ref="accessByMnemonicPhraseModal"
      :open-password="accessByMnemonicphrasePasswordModalOpen"/>
    <access-by-mnemonic-phrase-password-modal ref="accessByMnemonicPhrasePassword"/>
    <mew-connect-modal
      ref="mewconnectModal"
      :network-and-address-open="networkAndAddressOpen"/>

    <hardware-modal
      ref="hardwareModal"
      :network-and-address-open="networkAndAddressOpen"
      @hardwareRequiresPassword="hardwarePasswordModalOpen"
      @hardwareWalletOpen="hardwareWalletOpen"/>

    <hardware-password-modal
      ref="hardwarePasswordModal"
      :wallet-constructor="walletConstructor"
      :hardware-brand="hardwareBrand"
      @hardwareWalletOpen="hardwareWalletOpen"/>

    <network-and-address-modal
      ref="networkandaddressModal"
      :hardware-wallet="hardwareWallet"/>

    <metamask-modal ref="metamastModal"/>

    <software-modal
      ref="softwareModal"
      :open-password="passwordOpen"
      :open-private-key-input="privateKeyOpen"
      @file="fileUploaded"/>

    <password-modal
      ref="passwordModal"
      :file="file"/>

    <private-key-modal ref="privatekeyModal"/>
    <!--<install-metamask-modal :metamaskmodal="installMetamaskModalOpen"></install-metamask-modal>-->
    <!--<access-by-mnemonic-phrase-modal :openPassword="accessByMnemonicphrasePasswordModalOpen"></access-by-mnemonic-phrase-modal>-->
    <!--<access-by-mnemonic-phrase-password-modal></access-by-mnemonic-phrase-password-modal>-->

    <div class="wrap">
      <div class="page-container">
        <div class="title">
          <h2>{{ $t('common.accessMyWallet') }}</h2>
          <h5>
            {{ $t('common.noWallet') }}
            <router-link
              :to="$store.state.wallet === null || $store.state.wallet === undefined ? '/access-my-wallet' : '/interface'"
              class="nounderline">
              {{ $t('common.getAFreeWallet') }}
            </router-link>
          </h5>
        </div>
        <div class="buttons-container">
          <access-wallet-button
            v-for="(button, index) in buttons"
            :key="button.title+index"
            :func="button.func"
            :img="button.img"
            :title="button.title"
            :desc="button.desc"
            :recommend="button.recommend"
            :tooltip="button.tooltip"
            :disabled="button.disabled"
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
import MewConnectModal from '../../components/MewConnectModal';
import NetworkAndAddressModal from '../../components/NetworkAndAddressModal';
import PasswordModal from '../../components/PasswordModal';
import PrivateKeyModal from '../../components/PrivateKeyModal';
import SoftwareModal from '../../components/SoftwareModal';
import AccessByMnemonicphraseModal from '../../components/MnemonicPasswordModal';
import AccessByMnemonicphrasePasswordModal from '../../components/NetworkAndAddressModal';

import MetamaskModal from '../../components/MetamaskModal';
import InstallMetamaskModal from '../../components/InstallMetamaskModal';
import AccessByMnemonicphraseModal from '../../components/AccessByMnemonicphraseModal'
import AccessByMnemonicphrasePasswordModal from '../../components/AccessByMnemonicphrasePasswordModal'

import mewConnectImg from '@/assets/images/icons/button-mewconnect.svg'
import hardwareImg from '@/assets/images/icons/button-hardware.svg'
import metamaskImg from '@/assets/images/icons/button-metamask.svg'
import softwareImg from '@/assets/images/icons/button-software.svg'

import mewConnectDisabledImg from '@/assets/images/icons/mewconnect-disable.svg'
import hardwareDisabledImg from '@/assets/images/icons/hardware-disable.svg'
import metamaskDisabledImg from '@/assets/images/icons/metamask-disable.svg'

export default {
  components: {
    'mew-connect-modal': MewConnectModal,
    'network-and-address-modal': NetworkAndAddressModal,
    'hardware-modal': HardwareModal,
    'hardware-password-modal': HardwarePasswordModal,
    'metamask-modal': MetamaskModal,
    'install-metamask-modal': InstallMetamaskModal,
    'software-modal': SoftwareModal,
    'password-modal': PasswordModal,
    'private-key-modal': PrivateKeyModal,
    'access-by-mnemonic-phrase-modal': AccessByMnemonicphraseModal,
    'access-by-mnemonic-phrase-password-modal': AccessByMnemonicphrasePasswordModal,
    'access-wallet-button': AccessWalletButton

  },
  data() {
    return {
      file: {},
      hardwareWallet: {},
      hardwareAddresses: [],
      walletConstructor: {},
      hardwareBrand: '',
      buttons: [
        {
          func: this.mewConnectModalOpen,
          title: this.$t('common.mewConnect'),
          desc: this.$t('accessWallet.mewConnectDesc'),
          recommend: '',
          tooltip: this.$t('common.toolTip3'),
          img: this.$store.state.online ? mewConnectImg : mewConnectDisabledImg,
          disabled: this.$store.state.online
        },
        {
          func: this.hardwareModalOpen,
          title: this.$t('common.hardware'),
          desc: 'Ledger wallet; Trezor; Digital bitbox; Secalot',
          recommend: '',
          tooltip: this.$t('common.toolTip3'),
          img: this.$store.state.online ? hardwareImg : hardwareDisabledImg,
          disabled: this.$store.state.online
        },
        {
          func: this.installMetamaskModalOpen,
          title: 'MetaMask',
          desc: this.$t('accessWallet.metaMaskDesc'),
          recommend: '',
          tooltip: this.$t('common.toolTip3'),
          img: this.$store.state.online ? metamaskImg : metamaskDisabledImg,
          disabled: this.$store.state.online
        },
        {
          func: this.softwareModalOpen,
          title: this.$t('accessWallet.software'),
          desc: this.$t('accessWallet.softwareDesc'),
          recommend: this.$t('accessWallet.notRecommended'),
          tooltip: this.$t('common.toolTip3'),
          img: softwareImg,
          disabled: true
        }
      ]
    };
  },
  methods: {
    mewConnectModalOpen() {
      this.$refs.mewconnectModal.$refs.mewConnect.show();
    },
    networkAndAddressOpen() {
      this.$refs.networkandaddressModal.$refs.networkAndAddress.show();
    },
    hardwareModalOpen() {
      this.$refs.hardwareModal.$refs.hardware.show();
    },
    metamaskModalOpen() {
      this.$refs.metamastModal.$refs.metamask.show();
    },
    softwareModalOpen() {
      this.$refs.softwareModal.$refs.software.show();
    },
    passwordOpen() {
      this.$refs.passwordModal.$refs.password.show();
    },
    privateKeyOpen() {
      this.$refs.softwareModal.$refs.software.hide();
      this.$refs.privatekeyModal.$refs.privateKey.show();
    },
    installMetamaskModalOpen() {
      this.$refs.installMetamaskModal.$refs.installmetamask.show();
    },
    accessByMnemonicphraseModalOpen() {
      this.$refs.accessByMnemonicPhraseModal.$refs.accessbymnemonicphrase.show();
    },
    accessByMnemonicphrasePasswordModalOpen() {
      this.$refs.accessByMnemonicPhrasePassword.$refs.accessbymnemonicphrasepassword.show();
    },
    fileUploaded(e) {
      this.file = e;
      this.passwordOpen();
    },
    hardwarePasswordModalOpen(hardwareNeedingPassword) {
      this.walletConstructor = hardwareNeedingPassword.walletConstructor;
      this.hardwareBrand = hardwareNeedingPassword.hardwareBrand;
      this.$refs.hardwarePasswordModal.$refs.password.show();
    },
    hardwareWalletOpen(e) {
      this.walletConstructor = {};
      this.hardwareBrand = '';
      this.hardwareWallet = e;
      this.networkAndAddressOpen();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AccessMyWalletContainer.scss';
</style>
