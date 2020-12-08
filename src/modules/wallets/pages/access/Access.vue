<template>
  <div class="expandHeader">
    <v-container>
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

      <v-sheet color="transparent" max-width="550px" class="mx-auto">
        <div v-for="btn in buttons" :key="btn.title" class="mb-5">
          <mew-super-button
            btn-mode="small-right-image"
            :color-theme="btn.color"
            :title="btn.title"
            :subtitle="btn.subtitle"
            :right-icon="btn.rightIcon"
            :right-icons="btn.rightIcons"
            :title-mdi-icon="btn.titleIcon"
            :title-icon-class="btn.titleIconClass"
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
    </v-container>
  </div>
</template>

<script>
import mewSuperButton from '@/components/mewSuperButton/MewSuperButton';
import blockTitle from '@/components/block-title/BlockTitle';
import browserExtensionOverlay from '@/modules/wallets/components/browser-extension-overlay/BrowserExtensionOverlay';
import hardwareAccessOverlay from '@/modules/wallets/components/hardware-access-overlay/HardwareAccessOverlay';
import mobileAccessOverlay from '@/modules/wallets/components/mobile-access-overlay/MobileAccessOverlay';
import softwareAccessOverlay from '@/modules/wallets/components/software-access-overlay/SoftwareAccessOverlay';
export default {
  name: 'AccessWallet',
  components: {
    blockTitle,
    browserExtensionOverlay,
    hardwareAccessOverlay,
    mobileAccessOverlay,
    softwareAccessOverlay,
    mewSuperButton
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
          title: 'MEWwallet',
          subtitle: 'Use MEWwallet to access my wallet',
          note: '',
          rightIcon: require('@/assets/images/icons/icon-mew-connect.png'),
          titleIcon: 'mdi-shield-check',
          titleIconClass: 'primary--text',
          fn: () => {
            window.open('https://www.mewwallet.com', '_blank');
          }
        },
        {
          color: 'basic',
          title: 'Browser Extension',
          subtitle: 'Use Browser Extension to access my wallet',
          note: '',
          rightIcon: require('@/assets/images/icons/icon-mew-cx.png'),
          titleIcon: 'mdi-shield-check',
          titleIconClass: 'primary--text',
          fn: () => {
            //this.open('showBrowser');
            this.$router.push({ name: 'BrowserExtension' });
          }
        },
        {
          color: 'basic',
          title: 'Hardware wallets',
          subtitle: 'Ledge, Trezor, Keep key, FINNEY, BitBox, Secalot',
          note: '',
          rightIcon: require('@/assets/images/icons/icon-hardware-wallet.png'),
          titleIcon: 'mdi-shield-check',
          titleIconClass: 'primary--text',
          fn: () => {
            this.open('showHardware');
            //this.$router.push({ name: 'HardwareWallets' });
          }
        },
        {
          color: 'basic',
          title: 'Mobile Apps',
          subtitle: 'WalletConnect, Wallet Link',
          note: '',
          rightIcons: [
            require('@/assets/images/icons/icon-wallet-connect.svg'),
            require('@/assets/images/icons/icon-wallet-link.png')
          ],
          titleIcon: 'mdi-shield-check',
          titleIconClass: 'primary--text',
          fn: () => {
            //this.open('showMobile');
            this.$router.push({ name: 'MobileApps' });
          }
        },
        {
          color: 'outline',
          title: 'Software',
          subtitle: 'Keystore files, Mnemonic phrase, Private key',
          note: 'NOT RECOMMANDED',
          rightIcon: '',
          titleIcon: 'mdi-alert',
          titleIconClass: 'warning--text text--darken-1',
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
