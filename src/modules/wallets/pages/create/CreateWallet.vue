<template>
  <div class="expandHeader">
    <block-title :data="titleData">
      <h5 class="white--text ma-0">
        Please select a method to create a new wallet.
      </h5>
      <h5 class="white--text ma-0">
        Already have a wallet?
        <router-link
          :to="{ name: 'HomeAccessWallet', query: {} }"
          class="text-decoration--underline"
        >
          Access my wallet
        </router-link>
      </h5>
    </block-title>

    <v-sheet color="transparent" max-width="650px" class="mx-auto">
      <div class="mb-5">
        <mew-super-button
          class="mew-wallet-btn"
          color-theme="basic"
          title="Get MEWwallet"
          subtitle="MEW Brings a hardware wallet style security to your iOS or Android
              smartphone, helping you to secure your funds as never before."
          title-icon="mdi-shield-check"
          title-icon-type="mdi"
          right-icon-type="img"
          title-icon-class="primary--text"
          btn-link="https://www.mewwallet.com/"
        >
          <template v-slot:contentSlot>
            <img
              class="mew-wallet-img"
              :src="require('@/assets/images/snippets/bg-mew-wallet.png')"
            />
          </template>
        </mew-super-button>
      </div>
      <div class="mb-5">
        <mew-super-button
          color-theme="basic"
          title="MEW CX"
          subtitle="MEWcx is a secure and convinient way to create and manage your
                wallet. Click here to download today."
          title-icon="mdi-shield-check"
          icon-type="mdi"
          :right-icon="require('@/assets/images/icons/icon-mew-cx.png')"
          btn-link="https://chrome.google.com/webstore/detail/mew-cx/nlbmnnijcnlegkjjpcfjclmcfggfefdm?hl=en"
        />
      </div>
      <div class="mb-5">
        <mew-super-button
          color-theme="outline"
          title="Software"
          subtitle="Keystore files / Mnemonic phrase is highly sensitive information, and
          they should only be used in offline settings by experienced users."
          title-icon="mdi-alert"
          title-icon-class="warning--text text--darken-1"
          note="NOT RECOMMANDED"
          title-icon-type="mdi"
          @click.native="showSoftware = !showSoftware"
        />
      </div>
    </v-sheet>

    <div class="spacer-y-medium" />
    <toast
      ref="toast"
      can-close
      :link-obj="toastLink"
      text="Did you know? Hardware wallets offer the highest security for accessing your crypto."
      toast-type="info"
    />

    <software-overlay :open="showSoftware" />
  </div>
</template>

<script>
import blockTitle from '@/components/block-title/BlockTitle';
import SoftwareOverlay from '@/modules/wallets/components/software-overlay';

export default {
  name: 'CreateNewWallet',
  components: {
    blockTitle,
    'software-overlay': SoftwareOverlay
  },
  data: () => ({
    toastLink: {
      title: 'Buy a hardware wallet',
      url: ''
    },
    titleData: {
      textProps: 'white--text',
      toptitle: '',
      title: 'Get a New Wallet',
      description: '',
      centered: true
    },
    showSoftware: false
  }),
  watch: {
    showSoftware(newVal) {
      console.log(newVal);
    }
  },
  mounted() {
    this.$refs.toast.showToast();
  }
};
</script>

<style lang="scss" scoped>
.mew-wallet-img {
  max-width: 100px;
}
</style>
