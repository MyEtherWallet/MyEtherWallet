<template>
  <div class="access-my-wallet-options">
    <mew-connect-modal :networkAndAddressOpen="networkAndAddressOpen"></mew-connect-modal>

    <network-and-address-modal></network-and-address-modal>

    <hardware-modal :networkAndAddressOpen="networkAndAddressOpen"></hardware-modal>

    <metamask-modal></metamask-modal>

    <software-modal></software-modal>

    <div class="wrap">
      <div class="page-container">
        <div class="title">
          <h2>{{$t("reused.accessMyWallet")}}</h2>
          <h5>
            {{$t("reused.noWallet")}}
            <router-link to="/">{{$t("reused.getAFreeWallet")}}</router-link>
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
            :tooltip="button.tooltip">
          </access-wallet-button>
        </div>
      </div><!-- .page-container -->
    </div><!-- .wrap -->

  </div>
</template>

<script>
import mewConnectImg from '@/assets/images/icons/button-mewconnect.svg'
import hardwareImg from '@/assets/images/icons/button-hardware.svg'
import metamaskImg from '@/assets/images/icons/button-metamask.svg'
import softwareImg from '@/assets/images/icons/button-software.svg'
export default {
  data () {
    const self = this
    return {
      buttons: [
        {
          func: self.mewConnectModalOpen,
          title: self.$t('reused.mewConnect'),
          desc: self.$t('accessMyWalletOptions.mewConnectDesc'),
          recommend: '',
          tooltip: self.$t('reused.toolTip3'),
          img: mewConnectImg
        },
        {
          func: self.hardwareModalOpen,
          title: self.$t('reused.hardware'),
          desc: 'Ledger wallet; Trezor; Digital bitbox; Secalot',
          recommend: '',
          tooltip: self.$t('reused.toolTip3'),
          img: hardwareImg
        },
        {
          func: self.metamaskModalOpen,
          title: 'MetaMask',
          desc: self.$t('accessMyWalletOptions.metaMaskDesc'),
          recommend: '',
          tooltip: self.$t('reused.toolTip3'),
          img: metamaskImg
        },
        {
          func: self.softwareModalOpen,
          title: self.$t('accessMyWalletOptions.software'),
          desc: self.$t('accessMyWalletOptions.softwareDesc'),
          recommend: self.$t('accessMyWalletOptions.notRecommended'),
          tooltip: self.$t('reused.toolTip3'),
          img: softwareImg
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
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "AccessMyWalletContainer.scss";
</style>
