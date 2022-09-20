<template>
  <div class="expandHeader">
    <v-container>
      <!--
      =====================================================================================
        Layout Title
      =====================================================================================
      -->
      <the-layout-header
        :title="$t('home.access-my-wallet.title')"
        :subtitle-line-one="$t('home.access-my-wallet.subtitle-one')"
        :subtitle-line-two="$t('home.access-my-wallet.subtitle-two')"
        :route-obj="titleRoute"
        has-link
      />
      <!--
      =====================================================================================
        Options
      =====================================================================================
      -->
      <div style="max-width: 650px" class="mx-auto">
        <div
          v-for="(btn, key) in buttons"
          :key="key"
          class="position--relative"
        >
          <div
            v-if="btn.official"
            class="chip-official d-flex align-center"
            :class="isMobile ? 'note-position-mobile' : 'note-position'"
          >
            <v-icon color="whiteAlways" size="15px" class="mr-1">
              mdi-shield-check
            </v-icon>
            <div
              class="font-weight-medium letter-spacing--initial line-height--initial"
            >
              Official
            </div>
          </div>
          <div
            v-if="!btn.recommended"
            class="orangePrimary--text mew-label note-position d-flex align-center"
          >
            <v-icon color="orangePrimary" size="18px" class="mr-1">
              mdi-shield-alert
            </v-icon>
            NOT RECOMMENDED
          </div>
          <mew-button
            has-full-width
            :class="[
              btn.title === 'Software'
                ? 'AccessWalletSoftwareButton'
                : 'mb-5 py-6'
            ]"
            style="height: initial; min-height: 157px"
            :color-theme="btn.color"
            :btn-style="btn.style === 'outline' ? 'outline' : ''"
            @click.native="btn.fn"
          >
            <div class="width--full d-flex align-center text-left">
              <img
                v-if="btn.icon && !isMobile"
                class="ml-5 mr-6"
                :src="btn.icon"
                :alt="btn.alt"
                style="height: 70px"
              />
              <div class="px-3">
                <div class="d-flex align-center">
                  <img
                    v-if="btn.icon && isMobile"
                    class="mr-4"
                    :src="btn.icon"
                    :alt="btn.alt"
                    style="height: 40px"
                  />

                  <div class="mew-heading-2 break-word letter-spacing--initial">
                    {{ btn.title }}
                  </div>
                </div>
                <div
                  class="mew-heading-4 reset-subtitle break-word letter-spacing--initial text-transform--none mt-4"
                >
                  {{ btn.subtitle }}
                </div>
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
      <enkrypt-missing-snackbar
        :show="showInstallEnkrypt"
        @closeEnkryptMissingSnackbar="showInstallEnkrypt = false"
      />
    </v-container>
  </div>
</template>

<script>
import ModuleAccessWalletHardware from '@/modules/access-wallet/ModuleAccessWalletHardware';
import ModuleAccessWalletSoftware from '@/modules/access-wallet/ModuleAccessWalletSoftware';
import ModuleAccessWalletMobile from '@/modules/access-wallet/ModuleAccessWalletMobile';
import EnkryptMissingSnackbar from '@/views/components-default/EnkryptMissingSnackbar.vue';
import {
  Toast,
  ERROR,
  WARNING,
  SENTRY
} from '@/modules/toast/handler/handlerToast';
import { ACCESS_VALID_OVERLAYS } from '@/core/router/helpers';
import { Web3Wallet, MewConnectWallet } from '@/modules/access-wallet/common';
import { mapActions, mapState, mapGetters } from 'vuex';
import Web3 from 'web3';
import TheLayoutHeader from '../components-default/TheLayoutHeader';
import { ROUTES_HOME, ROUTES_WALLET } from '@/core/configs/configRoutes';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';

export default {
  name: 'TheAccessWalletLayout',
  components: {
    ModuleAccessWalletHardware,
    ModuleAccessWalletSoftware,
    ModuleAccessWalletMobile,
    EnkryptMissingSnackbar,
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
      showInstallEnkrypt: false
    };
  },
  computed: {
    ...mapState('external', ['path']),
    ...mapState('wallet', ['isOfflineApp']),

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
    },
    /**
     * Opens up software module overlay. Returns true if overlay prop from route is ACCESS_VALID_OVERLAYS.SOFTWARE
     * @return - boolean
     */
    showOffline() {
      return this.overlay === ACCESS_VALID_OVERLAYS.SOFTWARE;
    },
    buttons() {
      if (!this.isOfflineApp) {
        return [
          /* Enkrypt */
          {
            color: 'white',
            title: 'Enkrypt',
            subtitle: 'Connect with Enkrypt browser extension',
            official: true,
            recommended: true,
            icon: require('@/assets/images/icons/icon-enkrypt-block.svg'),
            alt: 'Enkrypt',
            fn: () => {
              this.checkEnkrypt();
            }
          },
          /* MEW wallet Button */
          {
            color: 'white',
            title: 'MEW wallet app',
            subtitle: 'Connect MEW Wallet app to MEW web',
            official: true,
            recommended: true,
            icon: require('@/assets/images/icons/icon-mew-wallet.png'),
            alt: 'MEW wallet',
            fn: () => {
              this.openMEWconnect();
            }
          },
          /* Browser extension */
          {
            color: 'white',
            title: 'Browser extension',
            subtitle: 'Use your Web3 wallet with MEW',
            official: false,
            recommended: true,
            icon: require('@/assets/images/icons/icon-extensions.png'),
            alt: 'Hardware Wallets',
            fn: () => {
              this.openWeb3Wallet();
            }
          },
          /* Mobile Apps */
          {
            color: 'white',
            title: 'Mobile Apps',
            subtitle: 'WalletConnect, WalletLink',
            official: false,
            recommended: true,
            icon: require('@/assets/images/icons/icon-mobile-apps.png'),
            alt: 'Hardware Wallets',
            fn: () => {
              this.openOverlay(ACCESS_VALID_OVERLAYS.MOBILE);
            }
          },
          /* Hardware wallets */
          {
            color: 'white',
            title: 'Hardware wallets',
            subtitle: 'Ledger, Trezor, KeepKey, Cool Wallet, Bitbox02',
            official: false,
            recommended: true,
            icon: require('@/assets/images/icons/icon-hardware-wallet.png'),
            alt: 'Hardware Wallets',
            fn: () => {
              this.openOverlay(ACCESS_VALID_OVERLAYS.HARDWARE);
            }
          },
          /* Software */
          {
            color: 'white',
            style: 'outline',
            title: 'Software',
            subtitle: 'Keystore File, Mnemonic Phrase, and Private Key',
            official: false,
            recommended: false,
            fn: () => {
              this.openOverlay(ACCESS_VALID_OVERLAYS.SOFTWARE);
            }
          }
        ];
      }
      return [
        {
          color: 'white',
          title: 'Software',
          subtitle: 'Keystore files, Mnemonic phrase, Private key',
          fn: () => {
            this.openOverlay(ACCESS_VALID_OVERLAYS.SOFTWARE);
          }
        }
      ];
    },
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
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
     * Checks if Enkrypt is available
     */
    checkEnkrypt() {
      if (
        window.ethereum &&
        window.ethereum.isMetaMask &&
        window.ethereum.isEnkrypt
      ) {
        this.openWeb3Wallet();
      } else {
        this.showInstallEnkrypt = true;
      }
    },
    /**
     * Checks and open web3 wallet
     */
    async openWeb3Wallet() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          const acc = await web3.eth.requestAccounts();
          const wallet = new Web3Wallet(acc[0]);
          this.setWallet([wallet, window.ethereum]);
          this.trackAccessWallet(WALLET_TYPES.WEB3_WALLET);
          if (this.path !== '') {
            this.$router.push({ path: this.path });
          } else {
            this.$router.push({ name: ROUTES_WALLET.WALLETS.NAME });
          }
        } catch (e) {
          if (
            e.message === 'Already processing eth_requestAccounts. Please wait.'
          )
            Toast(
              'Please open the MetaMask extension and unlock your wallet.',
              {},
              WARNING
            );
          else Toast(e, {}, WARNING);
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

<style lang="scss" scoped>
.reset-subtitle {
  line-height: 24px;
}

.chip-official {
  background-color: var(--v-greenPrimary-base);
  color: white;
  padding: 6px 10px;
  border-radius: 30px;
  z-index: 1;
}

.note-position {
  position: absolute;
  top: 14px;
  right: 16px;
}

.note-position-mobile {
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 4px 8px;
  border-radius: 0px 10px 0 7px;
}
</style>
