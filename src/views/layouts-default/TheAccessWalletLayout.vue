<template>
  <div class="expandHeader">
    <v-container>
      <!--
      =====================================================================================
        Layout Title
      =====================================================================================
      -->
      <the-layout-header
        title="Access My Wallet"
        subtitle-line-one=" Please select a method to access your wallet."
        subtitle-line-two="Don't have a wallet?"
        :route-obj="titleRoute"
        has-link
      />
      <!--
      =====================================================================================
        Options
      =====================================================================================
      -->
      <v-container>
        <v-sheet color="transparent" max-width="650px" class="mx-auto">
          <div v-for="btn in buttons" :key="btn.title" class="mb-5">
            <mew-super-button
              font-class="mew-heading-2"
              :color-theme="btn.color"
              :title="btn.title"
              :subtitle="btn.subtitle"
              :title-icon="btn.titleIcon"
              :title-icon-type="btn.titleIconType"
              :title-icon-class="btn.titleIconClass"
              :note="btn.note"
              @click.native="btn.fn"
            >
              <template v-if="btn.rightIcon || btn.rightIcons" #contentSlot>
                <v-row v-if="btn.rightIcon" class="align-center justify-end">
                  <v-img
                    :src="btn.rightIcon"
                    max-width="100px"
                    min-width="40px"
                    class="px-4 px-sm-3"
                    contain
                  />
                </v-row>
                <v-row v-else class="align-center justify-end">
                  <v-img
                    v-for="(icon, index) in btn.rightIcons"
                    :key="index"
                    :src="icon"
                    max-width="70px"
                    contain
                    class="px-4 px-sm-3"
                  />
                </v-row>
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
      <module-access-wallet-mobile :open="showMobile" :close="close" />
      <module-access-wallet-hardware :open="showHardware" :close="close" />
      <module-access-wallet-software
        :open="showSoftware"
        :close="close"
        :wallet-type="type"
      />
    </v-container>
  </div>
</template>

<script>
import browserExtensionOverlay from '@/modules/access-wallet/software/components/BrowserExtensionOverlay';
import ModuleAccessWalletHardware from '@/modules/access-wallet/ModuleAccessWalletHardware';
import ModuleAccessWalletSoftware from '@/modules/access-wallet/ModuleAccessWalletSoftware';
import ModuleAccessWalletMobile from '@/modules/access-wallet/ModuleAccessWalletMobile';
import {
  Toast,
  ERROR,
  WARNING,
  SENTRY
} from '@/modules/toast/handler/handlerToast';
import { ACCESS_VALID_OVERLAYS } from '@/core/router/helpers';
import { Web3Wallet } from '@/modules/access-wallet/common';
import { mapActions, mapState, mapGetters } from 'vuex';
import MewConnect from '@myetherwallet/mewconnect-web-client';
import Web3 from 'web3';
import TheLayoutHeader from '../components-default/TheLayoutHeader';
import mewwallet from '@/assets/images/icons/wallets/mewwallet.svg';

export default {
  name: 'TheAccessWalletLayout',
  components: {
    browserExtensionOverlay,
    ModuleAccessWalletHardware,
    ModuleAccessWalletSoftware,
    ModuleAccessWalletMobile,
    TheLayoutHeader
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
      titleRoute: {
        text: 'Create Wallet',
        routeName: 'CreateWallet'
      },
      buttons: [
        /* MEW wallet Button */
        {
          color: 'basic',
          title: 'MEWwallet',
          subtitle: 'Connect MEW wallet app to MEW web',
          note: '',
          rightIcon: require('@/assets/images/icons/icon-mew-wallet.png'),
          titleIcon: 'mdi-shield-check',
          titleIconType: 'mdi',
          titleIconClass: 'primary--text',
          fn: () => {
            this.openMEWconnect();
          }
        },
        /* Browser Extension */
        {
          color: 'basic',
          title: 'Browser Extension',
          subtitle: 'Use your web3 wallet with MEW.',
          note: '',
          rightIcon: require('@/assets/images/icons/icon-mew-cx.png'),
          titleIcon: 'mdi-shield-check',
          titleIconType: 'mdi',
          titleIconClass: 'primary--text',
          fn: () => {
            this.openWeb3Wallet();
          }
        },
        /* Hardware Wallet */
        {
          color: 'basic',
          title: 'Hardware Wallets',
          subtitle: 'Ledger, Trezor, Keep key, FINNEY, BitBox',
          note: '',
          rightIcon: require('@/assets/images/icons/icon-hardware-wallet.png'),
          titleIcon: 'mdi-shield-check',
          titleIconType: 'mdi',
          titleIconClass: 'primary--text',
          fn: () => {
            this.openOverlay(ACCESS_VALID_OVERLAYS.HARDWARE);
          }
        },
        /* Mobile Apps */
        {
          color: 'basic',
          title: 'Mobile Apps',
          subtitle: 'WalletConnect, WalletLink',
          note: '',
          rightIcons: [
            require('@/assets/images/icons/icon-wallet-connect.svg'),
            require('@/assets/images/icons/icon-wallet-link.png')
          ],
          titleIcon: 'mdi-shield-check',
          titleIconType: 'mdi',
          titleIconClass: 'primary--text',
          fn: () => {
            this.openOverlay(ACCESS_VALID_OVERLAYS.MOBILE);
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
          titleIconType: 'mdi',
          titleIconClass: 'warning--text text--darken-1',
          fn: () => {
            this.openOverlay(ACCESS_VALID_OVERLAYS.SOFTWARE);
          }
        }
      ],
      showBrowser: false
    };
  },
  computed: {
    ...mapState('external', ['path']),
    /**
     * Used in the creation of a MEWconnect instance
     **/
    ...mapGetters('global', ['network']),
    /**
     * Opens up software module overlay. Returns true if overlay prop from route is ACCESS_VALID_OVERLAYS.SOFTWARE
     * @return - boolean
     */
    showSoftware() {
      return this.overlay === ACCESS_VALID_OVERLAYS.SOFTWARE;
    },
    /**
     * Opens up harware module overlay. Returns true if overlay prop from route is ACCESS_VALID_OVERLAYS.HARDWARE
     * @return - boolean
     */
    showHardware() {
      return this.overlay === ACCESS_VALID_OVERLAYS.HARDWARE;
    },
    /**
     * Opens up mobile module overlay. Returns true if overlay prop from route is ACCESS_VALID_OVERLAYS.MOBILE
     * @return - boolean
     */
    showMobile() {
      return this.overlay === ACCESS_VALID_OVERLAYS.MOBILE;
    }
  },
  methods: {
    ...mapActions('wallet', ['setWallet']),
    /**
     * Used to set the MEWconnect instance as the wallet
     **/
    ...mapActions('wallet', ['setWallet']),
    /**
     * Pushes route to empty Access wallet with no props
     * Consequently closing any open overlay
     * @type - must be one of the VALID_OVERLAYS
     */
    close() {
      try {
        this.$router.push({
          name: 'AccessWallet'
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
    openOverlay(type) {
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
    },
    /**
     * Checks and open web3 wallet
     */
    async openWeb3Wallet() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          const acc = await web3.eth.getAccounts();
          const wallet = new Web3Wallet(acc[0]);
          this.setWallet([wallet, web3.currentProvider]);
          if (this.path !== '') {
            this.$router.push({ path: this.path });
          } else {
            this.$router.push({ name: 'Wallets' });
          }
        } catch (e) {
          Toast(e.message, {}, WARNING);
        }
      } else {
        Toast('No web3 wallet found!', {}, WARNING);
      }
    },
    /** Opens a modal to initiate a connection with a MEW mobile app.
     * Subsequently, this method creates an instance of MEWconnect with signTransaction and signMessage methods.
     */
    openMEWconnect() {
      try {
        const mc = new MewConnect.Initiator({ newPopupCreator: true });
        mc.createWalletOnly(this.network)
          .then(_newWallet => {
            // Temporary until library gets updated
            _newWallet['icon'] = {
              type: 'img',
              value: mewwallet
            };
            this.setWallet([_newWallet]).then(() => {
              this.$router.push({ name: 'Dashboard' });
            });
          })
          .catch(e => {
            Toast(e.message, {}, SENTRY);
          });
      } catch (e) {
        Toast(e.message, {}, SENTRY);
      }
    }
  }
};
</script>
