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
      <div v-for="btn in buttons" :key="btn.title" class="mb-5">
        <mew-super-button
          :color-theme="btn.color"
          :title="btn.title"
          :subtitle="btn.subtitle"
          title-icon-type="mdi"
          :title-icon="btn.titleIcon"
          :note="btn.note"
          @click.native="btn.fn"
        >
          <template #contentSlot>
            <img :src="btn.rightIcon" width="100px" />
          </template>
        </mew-super-button>
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
import hardwareAccessOverlay from '@/modules/wallets/components/hardware-access-overlay/HardwareAccessOverlay';
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
      buttons: [
        {
          color: 'basic',
          title: 'MEW wallet',
          subtitle: 'Use MEWwallet to access my wallet',
          note: '',
          rightIcon: require('@/assets/images/snippets/mobile/logo-mew-wallet.png'),
          titleIcon: '',
          fn: () => {}
        },
        {
          color: 'basic',
          title: 'Browser Extension',
          subtitle: 'Use Browser Extension to access my wallet',
          note: '',
          rightIcon: require('@/assets/images/icons/icon-mew-cx.png'),
          titleIcon: 'mdi-shield-check',
          fn: () => {
            this.open('showBrowser');
          }
        },
        {
          color: 'basic',
          title: 'Hardware wallets',
          subtitle: 'Ledge, Trezor, Keep key, FINNEY, BitBox, Secalot',
          note: '',
          rightIcon: require('@/assets/images/icons/icon-hardware-wallet.png'),
          titleIcon: 'mdi-shield-check',
          fn: () => {
            this.open('showHardware');
          }
        },
        {
          color: 'basic',
          title: 'Mobile Apps',
          subtitle: 'WalletConnect, Wallet Link',
          note: '',
          rightIcon: require('@/assets/images/icons/icon-wallet-connect.svg'),
          titleIcon: 'mdi-shield-check',
          fn: () => {
            this.open('showMobile');
          }
        },
        {
          color: 'outline',
          title: 'Software',
          subtitle: 'Keystore files, Mnemonic phrase, Private key',
          note: 'NOT RECOMMANDED',
          rightIcon: '',
          titleIcon: 'mdi-alert-circle',
          fn: () => {
            this.open('showSoftware');
          }
        }
      ],
      showBrowser: false,
      showHardware: false,
      showMobile: false,
      showSoftware: false
    };
  },
  methods: {
    close(type) {
      this[type] = false;
    },
    open(type) {
      this[type] = true;
    }
  }
};
</script>
