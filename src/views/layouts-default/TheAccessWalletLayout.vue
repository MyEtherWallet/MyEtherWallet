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
      <div style="max-width: 650px" class="mx-auto">
        <div v-for="btn in buttons" :key="btn.title" class="position--relative">
          <div
            class="orangePrimary--text mew-label"
            style="position: absolute; top: 15px; right: 25px"
          >
            NOT RECOMMENDED
          </div>
          <mew-button
            has-full-width
            class="mb-5"
            :color-theme="btn.color"
            :btn-style="btn.style === 'outline' ? 'outline' : ''"
            style="height: 160px"
            @click.native="btn.fn"
          >
            <div
              class="px-2 text-left d-flex align-center justify-space-between"
              :class="
                btn.style === 'outline' ? 'white--text' : 'textDark--text'
              "
              style="width: 100%"
            >
              <div>
                <div class="mb-2 d-flex align-center">
                  <div class="mew-heading-2">{{ btn.title }}</div>
                  <v-icon dense :color="btn.titleIconClass" class="ml-1">
                    {{ btn.titleIcon }}
                  </v-icon>
                </div>
                <div class="break-word">
                  {{ btn.subtitle }}
                </div>
              </div>
              <div class="d-none d-sm-flex align-center pl-5">
                <img
                  v-if="btn.rightIcon"
                  class="mew-wallet-img"
                  :src="btn.rightIcon"
                  :alt="btn.rightIcon"
                  style="height: 90px"
                />
                <img
                  v-for="(icon, index) in btn.rightIcons"
                  v-else
                  :key="index"
                  :src="icon"
                  width="70"
                  class="px-2"
                />
              </div>
            </div>
          </mew-button>
        </div>
      </div>

      <!--
      =====================================================================================
        Acccess Wallet Module Overlays - activate on Options Button click
      =====================================================================================
      -->
      <div class="spacer-y-medium" />
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
import Web3 from 'web3';
import TheLayoutHeader from '../components-default/TheLayoutHeader';
import { MewConnectWallet } from '@/modules/access-wallet/common';
import { ROUTES_HOME, ROUTES_WALLET } from '@/core/configs/configRoutes';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';

export default {
  name: 'TheAccessWalletLayout',
  components: {
    ModuleAccessWalletHardware,
    ModuleAccessWalletSoftware,
    ModuleAccessWalletMobile,
    TheLayoutHeader
  },
  mixins: [handlerAnalytics],
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
          color: 'white',
          title: 'MEW wallet',
          subtitle: 'Connect MEW wallet app to MEW web',
          note: '',
          rightIcon: require('@/assets/images/icons/icon-mew-wallet.png'),
          titleIcon: 'mdi-shield-check',
          titleIconType: 'mdi',
          titleIconClass: 'greenPrimary',
          fn: () => {
            this.openMEWconnect();
          }
        },
        /* Browser Extension */
        {
          color: 'white',
          title: 'Browser Extension',
          subtitle: 'Use your web3 wallet with MEW.',
          note: '',
          rightIcon: require('@/assets/images/icons/icon-mew-cx.png'),
          titleIcon: 'mdi-shield-check',
          titleIconType: 'mdi',
          titleIconClass: 'greenPrimary',
          fn: () => {
            this.openWeb3Wallet();
          }
        },
        /* Hardware Wallet */
        {
          color: 'white',
          title: 'Hardware Wallets',
          subtitle: 'Ledger, Trezor, KeepKey, FINNEY, BitBox',
          note: '',
          rightIcon: require('@/assets/images/icons/icon-hardware-wallet.png'),
          titleIcon: 'mdi-shield-check',
          titleIconType: 'mdi',
          titleIconClass: 'greenPrimary',
          fn: () => {
            this.openOverlay(ACCESS_VALID_OVERLAYS.HARDWARE);
          }
        },
        /* Mobile Apps */
        {
          color: 'white',
          title: 'Mobile Apps',
          subtitle: 'WalletConnect, WalletLink',
          note: '',
          rightIcons: [
            require('@/assets/images/icons/icon-wallet-connect.svg'),
            require('@/assets/images/icons/icon-wallet-link.png')
          ],
          titleIcon: 'mdi-shield-check',
          titleIconType: 'mdi',
          titleIconClass: 'greenPrimary',
          fn: () => {
            this.openOverlay(ACCESS_VALID_OVERLAYS.MOBILE);
          }
        },
        /* Software */
        {
          color: 'white',
          style: 'outline',
          title: 'Software',
          subtitle: 'Keystore files, Mnemonic phrase, Private key',
          note: 'NOT RECOMMENDED',
          rightIcon: '',
          titleIcon: 'mdi-alert',
          titleIconType: 'mdi',
          titleIconClass: 'orangePrimary',
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
          name: ROUTES_HOME.ACCESS_WALLET.NAME
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
          name: ROUTES_HOME.ACCESS_WALLET.NAME,
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
          this.setWallet([wallet, window.ethereum]);
          if (this.path !== '') {
            this.$router.push({ path: this.path });
          } else {
            this.$router.push({ name: ROUTES_WALLET.WALLETS.NAME });
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
      MewConnectWallet()
        .then(_newWallet => {
          this.setWallet([_newWallet]).then(() => {
            this.trackAccessWallet(WALLET_TYPES.MEW_WALLET);
            this.$router.push({ name: ROUTES_WALLET.DASHBOARD.NAME });
          });
        })
        .catch(e => {
          Toast(e.message, {}, SENTRY);
        });
    }
  }
};
</script>
