<template>
  <div class="expandHeader">
    <block-title :data="titleData">
      <h5 class="white--text ma-0">
        Please select a method to access your wallet.
      </h5>
      <h5 class="white--text ma-0">
        Don't have a wallet?
        <router-link
          :to="{ name: 'CreateWallet' }"
          class="text-color--mew-green"
        >
          Get a new wallet
        </router-link>
      </h5>
    </block-title>
    <v-sheet color="transparent" max-width="650px" class="mx-auto">
      <div class="mb-5">
        <mew-super-button
          color-theme="basic"
          title="Browser Extension"
          subtitle="Use Browser Extension to access my wallet"
          icon-type="img"
          :right-icon="require('@/assets/images/icons/icon-mew-cx.png')"
          title-icon="mdi-shield-check"
          @click.native="showBrowser = !showBrowser"
        />
      </div>
      <div class="mb-5">
        <mew-super-button
          color-theme="basic"
          title="Hardware wallets"
          subtitle="Ledge, Trezor, Keep key, FINNEY, BitBox, Secalot"
          right-icon-type="img"
          title-icon-type="mdi"
          :right-icon="
            require('@/assets/images/icons/icon-hardware-wallet.png')
          "
          title-icon="mdi-shield-check"
          @click.native="showHardware = !showHardware"
        />
      </div>
      <div class="mb-5">
        <mew-super-button
          color-theme="basic"
          title="Mobile Apps"
          subtitle="MEW Wallet, WalletConnect, Wallet Link"
          icon-type="img"
          :right-icon="require('@/assets/images/icons/icon-wallet-connect.svg')"
          :right-icon2="require('@/assets/images/icons/icon-wallet-link.png')"
          title-icon="mdi-shield-check"
          @click.native="showMobile = !showMobile"
        />
      </div>
      <div>
        <mew-super-button
          color-theme="outline"
          title="Software"
          subtitle="Keystore files, Mnemonic phrase, Private key"
          icon-type="img"
          title-icon="mdi-alert"
          note="NOT RECOMMANDED"
          @click.native="showSoftware = !showSoftware"
        />
      </div>
    </v-sheet>
    <div class="spacer-y-medium" />
    <browser-extension-overlay :open="showBrowser" :close="close" />
    <hardware-access-overlay :open="showHardware" :close="close" />
    <mobile-access-overlay :open="showMobile" :close="close" />
    <software-access-overlay :open="showSoftware" :close="close" />
  </div>
</template>

<script>
import blockTitle from '@/components/block-title/BlockTitle';
import browserExtensionOverlay from '@/modules/wallets/components/browser-extension-overlay/BrowserExtensionOverlay';
import hardwareAccessOverlay from '@/modules/wallets/components/hardware-access-overlay/HardwareAccessOverlay.';
import mobileAccessOverlay from '@/modules/wallets/components/mobile-access-overlay/MobileAccessOverlay';
import softwareAccessOverlay from '@/modules/wallets/components/software-access-overlay/SoftwareAccessOverlay';

export default {
  name: 'CreateNewWallet',
  components: {
    blockTitle,
    browserExtensionOverlay,
    hardwareAccessOverlay,
    mobileAccessOverlay,
    softwareAccessOverlay
  },
  data() {
    return {
      titleData: {
        textProps: 'white--text',
        toptitle: '',
        title: 'Access My Wallet',
        description: '',
        centered: true
      },
      showBrowser: false,
      showHardware: false,
      showMobile: false,
      showSoftware: false
    };
  },
  methods: {
    close(type) {
      this[type] = false;
    }
  }
};
</script>
