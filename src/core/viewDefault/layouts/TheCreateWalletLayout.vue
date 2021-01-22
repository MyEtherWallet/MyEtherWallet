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
        <module-mew-wallet />

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
        <module-software />
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

    <!-- <software-overlay :open="showSoftware" @close="showSoftware = false" /> -->
  </div>
</template>

<script>
import MewSuperButton from '@/components/mewSuperButton/MewSuperButton';
import ModuleMewWallet from '@/modules/create-wallet/ModuleMewWallet';
import ModuleSoftware from '@/modules/create-wallet/ModuleSoftware';
// import ModuleHardWareWallet from '@module/hardware-wallet/ModuleHardwareWallet';
import blockTitle from '@/components/block-title/BlockTitle';
// import SoftwareCreateOverlay from '@/modules/wallets/components/software-create-overlay/SoftwareCreateOverlay';

export default {
  name: 'TheCreateWalletLayout',
  components: {
    blockTitle,
    ModuleMewWallet,
    // SoftwareCreateOverlay,
    MewSuperButton,
    ModuleSoftware
  },
  data: () => ({
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
  })
};
</script>

<style lang="scss"></style>
