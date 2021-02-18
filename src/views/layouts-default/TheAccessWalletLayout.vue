<template>
  <div class="expandHeader">
    <v-container>
      <!--
      =====================================================================================
        Layout Title
      =====================================================================================
      -->
      <app-block-title :data="titleData">
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
      </app-block-title>
      <!--
      =====================================================================================
        Options
      =====================================================================================
      -->
      <v-container>
        <v-sheet color="transparent" max-width="650px" class="mx-auto">
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
      </v-container>
      <!--
      =====================================================================================
        Acccess Wallet Module Overlays - activate on Options Button click
      =====================================================================================
      -->
      <div class="spacer-y-medium" />
      <browser-extension-overlay :open="showBrowser" :close="close" />
      <hardware-access-overlay :open="showHardware" :close="close" />
      <mobile-access-overlay :open="showMobile" :close="close" />
      <module-access-wallet-software
        :open="showSoftware"
        :close="close"
        :wallet-type="type"
      />
    </v-container>
  </div>
</template>

<script>
import mewSuperButton from '@/components/mewSuperButton/MewSuperButton';
import AppBlockTitle from '@/core/components/AppBlockTitle';
import browserExtensionOverlay from '@/modules/wallets/components/browser-extension-overlay/BrowserExtensionOverlay';
import hardwareAccessOverlay from '@/modules/wallets/components/hardware-access-overlay/HardwareAccessOverlay';
import mobileAccessOverlay from '@/modules/wallets/components/mobile-access-overlay/MobileAccessOverlay';
import ModuleAccessWalletSoftware from '@/modules/access-wallet/ModuleAccessWalletSoftware';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { ACCESS_VALID_OVERLAYS } from '@/core/router/helpers';
export default {
  name: 'TheAccessWalletLayout',
  components: {
    AppBlockTitle,
    browserExtensionOverlay,
    hardwareAccessOverlay,
    mobileAccessOverlay,
    ModuleAccessWalletSoftware,
    mewSuperButton
  },
  props: {
    overlay: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'overview'
    }
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
        /* MEW wallet Button */
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
        /* Browser Extension */
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
        /* Hardware Wallet */
        {
          color: 'basic',
          title: 'Hardware wallets',
          subtitle: 'Ledge, Trezor, Keep key, FINNEY, BitBox, Secalot',
          note: '',
          rightIcon: require('@/assets/images/icons/icon-hardware-wallet.png'),
          titleIcon: 'mdi-shield-check',
          titleIconClass: 'primary--text',
          fn: () => {
            this.open(ACCESS_VALID_OVERLAYS.HARDWARE);
          }
        },
        /* Mobile Apps */
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
            this.$router.push({ name: ACCESS_VALID_OVERLAYS.MOBILE });
          }
        },
        /* Software */
        {
          color: 'outline',
          title: 'Software',
          subtitle: 'Keystore files, Mnemonic phrase, Private key',
          note: 'NOT RECOMMENDED',
          rightIcon: '',
          titleIcon: 'mdi-alert',
          titleIconClass: 'warning--text text--darken-1',
          fn: () => {
            this.open(ACCESS_VALID_OVERLAYS.SOFTWARE);
          }
        }
      ],
      showBrowser: false,
      showMobile: false
    };
  },
  computed: {
    /**
     * Opens up software module overlay. Returns true if overlay prop from route is VALID_OVERLAYS[2]
     * @return - boolean
     */
    showSoftware() {
      return this.overlay === ACCESS_VALID_OVERLAYS.SOFTWARE;
    },
    /**
     * Opens up harware module overlay. Returns true if overlay prop from route is VALID_OVERLAYS[0]
     * @return - boolean
     */
    showHardware() {
      return this.overlay === ACCESS_VALID_OVERLAYS.HARDWARE;
    }
  },
  methods: {
    /**
     * Pushes route to empty Access wallet with no props
     * Consequently closing any open overlay
     * @type - must be one of the VALID_OVERLAYS
     */
    close() {
      try {
        this.$router.push({
          params: null,
          query: null
        });
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },
    /**
     * Pushes a correct router prop for the overlay and sets query prop 'type' to the 'overview'.
     * Consiquently this will open the correct module overlay.
     * @type - must be one of the VALID_OVERLAYS
     */
    open(type) {
      try {
        this.$router.push({
          name: 'AccessWallet',
          params: { overlay: type },
          query: { type: 'overview' }
        });
      } catch (e) {
        Toast(e, {}, ERROR);
      }
      this[type] = true;
    }
  }
};
</script>
