<template>
  <div class="mew-component--create-wallet expandHeader">
    <!--
    =====================================================================================
        Layout Title
    =====================================================================================
    -->
    <block-title :data="titleData">
      <h5 class="white--text ma-0">
        Please select a method to create a new wallet.
      </h5>
      <h5 class="white--text ma-0">
        Already have a wallet?
        <router-link
          :to="{ name: 'AccessWallet', query: {} }"
          class="text-decoration--underline"
        >
          Access my wallet
        </router-link>
      </h5>
    </block-title>
    <!--
    =====================================================================================
        Options
    =====================================================================================
    -->
    <v-container>
      <v-sheet color="transparent" max-width="650px" class="mx-auto">
        <a href="https://www.mewwallet.com/" target="_blank">
          <mew-super-button
            btn-mode="large-right-image"
            class="mb-5"
            color-theme="basic"
            title="Get MEW wallet App"
            subtitle="Download our official app and connect to MEW web using your mobile phone. Available on iOS and Android."
            title-mdi-icon="mdi-shield-check"
            title-icon-class="primary--text"
          >
            <template #contentBelowTitle>
              <div class="mt-6">
                <img
                  src="@/assets/images/icons/button-app-store.png"
                  alt="Apple app store"
                  style="height: 30px"
                  class="mr-2"
                />
                <img
                  src="@/assets/images/icons/button-play-store.png"
                  alt="Google play store"
                  style="height: 30px"
                />
              </div>
            </template>
            <template #contentRight>
              <img
                class="mew-wallet-img"
                src="@/assets/images/snippets/bg-mew-wallet.png"
                alt="MEWwallet"
                style="height: 190px"
              />
            </template>
          </mew-super-button>
        </a>
        <mew-super-button
          btn-mode="small-right-image"
          class="mb-5"
          color-theme="basic"
          title="Buy a Hardware Wallet"
          subtitle="A hardware wallet offers the highest security for accessing your crypto"
          title-mdi-icon="mdi-shield-check"
          title-icon-class="primary--text"
          :right-icon="
            require('@/assets/images/icons/icon-hardware-wallet.png')
          "
          @click.native="$router.push({ name: 'BuyHardwareWallet' })"
        >
        </mew-super-button>
        <mew-super-button
          btn-mode="small-right-image"
          class="mb-5"
          color-theme="outline"
          title="Software"
          subtitle="Keystore files / Mnemonic phrase is highly sensitive information, and
          they should only be used in offline settings by experienced users."
          title-icon-class="warning--text text--darken-1"
          note="NOT RECOMMENDED"
          @click.native="showSoftware = true"
        />
      </v-sheet>
    </v-container>

    <div class="spacer-y-medium" />
    <mew-toast
      ref="toast"
      can-close
      :link-obj="toastLink"
      text="Did you know? Hardware wallets offer the highest security for accessing your crypto."
      toast-type="info"
    />

    <module-software :open="showSoftwareModule" :close="closeSoftwareModule" />
  </div>
</template>

<script>
import MewSuperButton from '@/components/mewSuperButton/MewSuperButton';
import ModuleSoftware from '@/modules/create-wallet/ModuleSoftware';
import blockTitle from '@/components/block-title/BlockTitle';
// import SoftwareCreateOverlay from '@/modules/wallets/components/software-create-overlay/SoftwareCreateOverlay';

export default {
  name: 'TheCreateWalletLayout',
  components: {
    blockTitle,
    // SoftwareCreateOverlay,
    MewSuperButton,
    ModuleSoftware
  },
  data: () => ({
    showSoftwareModule: false,
    toastLink: {
      title: 'Buy a hardware wallet',
      url: ''
    },
    titleData: {
      textProps: 'white--text',
      toptitle: '',
      title: 'Create a new wallet',
      description: '',
      centered: true
    },
    showSoftware: false
  }),
  methods: {
    closeSoftwareModule() {
      this.showSoftwareModule = false;
    }
  }
};
</script>

<style lang="scss"></style>
