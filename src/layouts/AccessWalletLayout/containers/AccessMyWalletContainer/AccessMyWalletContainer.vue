<template>
  <div class="access-my-wallet-options">
    <mew-connect-modal :networkAndAddressOpen="networkAndAddressOpen"></mew-connect-modal>

    <network-and-address-modal></network-and-address-modal>

    <hardware-modal :networkAndAddressOpen="networkAndAddressOpen"></hardware-modal>

    <metamask-modal></metamask-modal>

    <software-modal v-on:file="fileUploaded" :openPassword="passwordOpen" :openPrivateKeyInput="privateKeyOpen"></software-modal>
    <password-modal :file="file"></password-modal>
    <private-key-modal></private-key-modal>

    <div class="wrap">
      <div class="page-container">
        <div class="title">
          <h2>{{$t("common.accessMyWallet")}}</h2>
          <h5>
            {{$t("common.noWallet")}}
            <router-link :to="$store.state.wallet === null || $store.state.wallet === undefined ? '/access-my-wallet' : '/interface'" class="nounderline">
              {{$t("common.getAFreeWallet")}}
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
            >
          </access-wallet-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import AccessWalletButton from '../../components/AccessWalletButton'
import HardwareModal from '../../components/HardwareModal'
import MetamaskModal from '../../components/MetamaskModal'
import MewConnectModal from '../../components/MewConnectModal'
import NetworkAndAddressModal from '../../components/NetworkAndAddressModal'
import PasswordModal from '../../components/PasswordModal'
import PrivateKeyModal from '../../components/PrivateKeyModal'
import SoftwareModal from '../../components/SoftwareModal'

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
    'metamask-modal': MetamaskModal,
    'software-modal': SoftwareModal,
    'password-modal': PasswordModal,
    'private-key-modal': PrivateKeyModal,
    'access-wallet-button': AccessWalletButton
  },
  data () {
    return {
      file: '',
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
          func: this.metamaskModalOpen,
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
    }
  },
  methods: {
    mewConnectModalOpen () {
      this.$children[0].$refs.mewConnect.show()
    },
    networkAndAddressOpen () {
      this.$children[1].$refs.networkAndAddress.show()
    },
    hardwareModalOpen () {
      this.$children[2].$refs.hardware.show()
    },
    metamaskModalOpen () {
      this.$children[3].$refs.metamask.show()
    },
    softwareModalOpen () {
      this.$children[4].$refs.software.show()
    },
    passwordOpen () {
      this.$children[5].$refs.password.show()
    },
    privateKeyOpen () {
      this.$children[4].$refs.software.hide()
      this.$children[6].$refs.privateKey.show()
    },
    fileUploaded (e) {
      this.file = e
      this.passwordOpen()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "AccessMyWalletContainer.scss";
</style>
