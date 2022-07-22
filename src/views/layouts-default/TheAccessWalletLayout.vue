<template>
  <div class="expandHeader">
    <v-container>
      <!-- ===================================================================================== -->
      <!-- Layout Title -->
      <!-- ===================================================================================== -->
      <the-layout-header
        :title="$t('home.access-my-wallet.title')"
        :subtitle-line-one="$t('home.access-my-wallet.subtitle-one')"
        :subtitle-line-two="$t('home.access-my-wallet.subtitle-two')"
        :route-obj="titleRoute"
        has-link
      />

      <!-- ===================================================================================== -->
      <!-- Options -->
      <!-- ===================================================================================== -->
      <div style="max-width: 650px" class="mx-auto">
        <mew-button
          v-for="(btn, key) in buttons"
          :key="key"
          has-full-width
          class="mb-5 py-10 py-md-6"
          style="height: initial; min-height: 157px"
          :color-theme="btn.color"
          :btn-style="btn.style === 'outline' ? 'outline' : ''"
          @click.native="btn.fn"
        >
          <div class="width--full d-flex align-center text-left">
            <div
              v-if="btn.icon && !isMobile"
              style="min-width: 113px"
              class="d-flex justify-center"
            >
              <img
                :src="btn.icon"
                :alt="btn.alt"
                :style="btn.height ? `height: ${btn.height}` : 'height: 71px'"
              />
            </div>
            <div class="px-3">
              <div class="d-flex align-center">
                <img
                  v-if="btn.icon && isMobile"
                  class="mr-4"
                  :src="btn.icon"
                  :alt="btn.alt"
                  style="height: 40px"
                />
                <div
                  class="mew-heading-2 break-word letter-spacing--initial mr-auto"
                >
                  {{ btn.title }}
                </div>

                <!-- ===================================================================================== -->
                <!-- Official -->
                <!-- ===================================================================================== -->
                <div
                  v-if="btn.official"
                  class="ml-3 chip-official d-flex align-center"
                  :class="isMobile ? 'mobile' : ''"
                >
                  <v-icon size="14px" class="mr-1">mdi-shield-check</v-icon>
                  <div
                    class="line-height--none font-weight-medium letter-spacing--initial line-height--initial"
                  >
                    Official
                  </div>
                </div>

                <!-- ===================================================================================== -->
                <!-- Not recommended -->
                <!-- ===================================================================================== -->
                <div
                  v-if="btn.notRecommended"
                  class="ml-3 chip-not-recommended d-flex align-center"
                  :class="isMobile ? 'mobile' : ''"
                >
                  <v-icon size="15px" class="mr-1">mdi-shield-alert</v-icon>
                  <div
                    class="line-height--none font-weight-medium letter-spacing--initial line-height--initial"
                  >
                    Not recommended
                  </div>
                </div>
              </div>
              <div
                class="mew-heading-4 reset-subtitle break-word letter-spacing--initial mt-4"
              >
                {{ btn.subtitle }}
              </div>
            </div>
          </div>
        </mew-button>
      </div>

      <!-- ===================================================================================== -->
      <!-- Acccess Wallet Module Overlays - activate on Options Button click -->
      <!-- ===================================================================================== -->
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
      showBrowser: false
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
            title: 'Install Enkrypt browser extension',
            subtitle:
              'MEW’s official browser extension. Connect to web3 on Ethereum and Polkadot, manage your NFTs, buy, send and swap',
            icon: require('@/assets/images/icons/icon-enkrypt-gradient.svg'),
            height: '55px',
            alt: 'Enkrypt',
            official: true,
            fn: () => {
              window.open('https://enkrypt.com', '_blank');
            }
          },
          /* MEW wallet Button */
          {
            color: 'white',
            title: 'Download MEW wallet app',
            subtitle:
              'Our official mobile app to create your wallet, and connect to MEW Web using your mobile phone',
            icon: require('@/assets/images/icons/icon-mew-wallet.png'),
            height: '',
            alt: 'MEW wallet',
            official: true,
            fn: () => {
              window.open('https://www.mewwallet.com/', '_blank');
            }
          },
          /* Browser Extension */
          {
            color: 'white',
            title: 'Browser Extension',
            subtitle: 'Use your web3 wallet with MEW.',
            alt: 'Browser Extension',
            icon: require('@/assets/images/icons/icon-browser-extension.svg'),
            height: '53px',
            fn: () => {
              this.openWeb3Wallet();
            }
          },
          /* Mobile Apps */
          {
            color: 'white',
            title: 'Mobile Apps',
            subtitle: 'WalletConnect, WalletLink',
            icon: require('@/assets/images/icons/icon-mobile-apps.svg'),
            height: '70px',
            alt: 'Hardware Wallets',
            fn: () => {
              this.openOverlay(ACCESS_VALID_OVERLAYS.MOBILE);
            }
          },
          /* Hardware Wallet */
          {
            color: 'white',
            title: 'Buy a hardware wallet',
            subtitle:
              'For the highest standard of security, buy a hardware wallet and us it with MEW',
            icon: require('@/assets/images/icons/icon-hardware-wallet.png'),
            height: '',
            alt: 'Hardware Wallets',
            fn: () => {
              this.$router.push({ name: ROUTES_HOME.BUY_HARDWARE_WALLET.NAME });
            }
          },
          /* Software */
          {
            color: 'white',
            style: 'outline',
            title: 'Software',
            subtitle:
              'Software Methods like Keystore file and Mnemonic phrase should only be used in offline msettings by experienced users',
            notRecommended: true,
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
          Toast(e, {}, WARNING);
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

  &.mobile {
    background-color: transparent;
    color: var(--v-greenPrimary-base);
    position: absolute;
    top: -32px;
    right: -17px;
  }
}

.chip-not-recommended {
  background-color: transparent;
  color: var(--v-orangePrimary-base);
  padding: 6px 10px;
  border-radius: 30px;

  &.mobile {
    position: absolute;
    top: -32px;
    right: -17px;
  }
}
</style>
