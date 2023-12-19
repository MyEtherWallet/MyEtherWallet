<template>
  <div class="expandHeader pt-16">
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
            <v-icon color="whiteAlways" length="15px" class="mr-1">
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
            <v-icon color="orangePrimary" length="18px" class="mr-1">
              mdi-shield-alert
            </v-icon>
            NOT RECOMMENDED
          </div>
          <mew-button
            v-if="btn.useBtn"
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
          <div v-else class="non-button-container mb-5 py-6">
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
                  class="mew-heading-4 reset-subtitle break-word letter-spacing--initial text-transform--none mt-2 mb-2"
                >
                  {{ btn.subtitle }}
                </div>
                <div
                  v-if="eip6963Providers.length > 1"
                  class="d-flex align-center justify-start mini-button-container"
                >
                  <div
                    v-for="item in eip6963Providers"
                    :key="item.info.uuid"
                    class="mr-2 px-1 py-2 d-flex align-center cursor--pointer mini-buttons"
                    @click="openWeb3WithProvider(item)"
                  >
                    <img
                      v-if="item.info.icon"
                      :src="item.info.icon"
                      :alt="`${item.info.name}-picture`"
                      width="25px"
                    />
                    <span class="pl-1">{{ item.info.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
import { mapActions, mapState } from 'vuex';
import Web3 from 'web3';

import { WalletConnectWallet } from '@/modules/access-wallet/hybrid/handlers';

import {
  Toast,
  ERROR,
  WARNING,
  SENTRY
} from '@/modules/toast/handler/handlerToast';
import { ACCESS_VALID_OVERLAYS } from '@/core/router/helpers';
import { Web3Wallet } from '@/modules/access-wallet/common';
import { ROUTES_HOME, ROUTES_WALLET } from '@/core/configs/configRoutes';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import {
  ACCESS_WALLET,
  COMMON
} from '@/modules/analytics-opt-in/handlers/configs/events';

export default {
  name: 'TheAccessWalletLayout',
  components: {
    ModuleAccessWalletHardware: () =>
      import('@/modules/access-wallet/ModuleAccessWalletHardware'),
    ModuleAccessWalletSoftware: () =>
      import('@/modules/access-wallet/ModuleAccessWalletSoftware'),
    ModuleAccessWalletMobile: () =>
      import('@/modules/access-wallet/ModuleAccessWalletMobile'),
    EnkryptMissingSnackbar: () =>
      import('@/views/components-default/EnkryptMissingSnackbar.vue'),
    TheLayoutHeader: () => import('../components-default/TheLayoutHeader')
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
    ...mapState('external', ['path', 'eip6963Providers']),
    ...mapState('wallet', ['isOfflineApp']),
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
            useBtn: true,
            icon: require('@/assets/images/icons/icon-enkrypt-block.svg'),
            alt: 'Enkrypt',
            fn: () => {
              this.trackAccessWalletAmplitude(ACCESS_WALLET.ENKRYPT);
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
            useBtn: true,
            icon: require('@/assets/images/icons/icon-mew-wallet.png'),
            alt: 'MEW wallet',
            fn: () => {
              this.openMEWwallet();
            }
          },
          /* Browser extension */
          {
            color: 'white',
            title: 'Browser extension',
            subtitle: 'Use your Web3 wallet with MEW',
            official: false,
            recommended: true,
            useBtn: this.eip6963Providers.length <= 1,
            icon: require('@/assets/images/icons/icon-extensions.png'),
            alt: 'Hardware Wallets',
            fn: () => {
              this.trackAccessWalletAmplitude(ACCESS_WALLET.BROWSER_EXTENSION);
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
            useBtn: true,
            icon: require('@/assets/images/icons/icon-mobile-apps.png'),
            alt: 'Hardware Wallets',
            fn: () => {
              this.trackAccessWalletAmplitude(ACCESS_WALLET.MOBILE_APPS);
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
            useBtn: true,
            icon: require('@/assets/images/icons/icon-hardware-wallet.png'),
            alt: 'Hardware Wallets',
            fn: () => {
              this.trackAccessWalletAmplitude(ACCESS_WALLET.HARWARE_WALLETS);
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
            useBtn: true,
            recommended: false,
            fn: () => {
              this.trackAccessWalletAmplitude(ACCESS_WALLET.SOFTWARE);
              this.openOverlay(ACCESS_VALID_OVERLAYS.SOFTWARE);
            }
          }
        ];
      }
      return [
        {
          color: 'white',
          title: 'Software',
          useBtn: true,
          subtitle: 'Keystore files, Mnemonic phrase, Private key',
          fn: () => {
            this.trackAccessWalletAmplitude(ACCESS_WALLET.SOFTWARE);
            this.openOverlay(ACCESS_VALID_OVERLAYS.SOFTWARE);
          }
        }
      ];
    },
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    }
  },
  mounted() {
    window.dispatchEvent(new Event('eip6963:requestProvider'));
    this.trackAccessWalletAmplitude(COMMON.PAGE_SHOWN);
  },
  methods: {
    ...mapActions('wallet', ['setWallet']),
    ...mapActions('external', [
      'setSelectedEIP6963Info',
      'setSelectedEIP6963Provider'
    ]),
    /**
     * Pushes route to empty Access wallet with no props
     * Consequently closing any open overlay
     * @type - must be one of the VALID_OVERLAYS
     */
    close() {
      try {
        if (this.showSoftware) {
          this.trackAccessWalletAmplitude(ACCESS_WALLET.CLOSE_SOFTWARE_ACCESS);
        } else if (this.showHardware) {
          this.trackAccessWalletAmplitude(ACCESS_WALLET.CLOSE_HARDWARE_ACCESS);
        } else if (this.showMobile) {
          this.trackAccessWalletAmplitude(ACCESS_WALLET.CLOSE_MOBILE_ACCESS);
        }
        this.$router.push({
          name: ROUTES_HOME.ACCESS_WALLET.NAME
        });
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },
    openWeb3WithProvider(item) {
      this.trackAccessWalletAmplitude(ACCESS_WALLET.BROWSER_EXTENSION);
      this.openWeb3Wallet(item);
    },
    openMEWwallet() {
      try {
        this.trackAccessWalletAmplitude(ACCESS_WALLET.MEW_WALLET_QR_SHOWN);
        WalletConnectWallet(WALLET_TYPES.MEW_WALLET)
          .then(_newWallet => {
            this.setWallet([_newWallet]).then(() => {
              this.trackAccessWalletAmplitude(
                ACCESS_WALLET.MEW_WALLET_QR_SUCCESSFUL
              );
              this.$router.push({ name: ROUTES_WALLET.DASHBOARD.NAME });
            });
          })
          .catch(e => {
            this.trackAccessWalletAmplitude(ACCESS_WALLET.MEW_WALLET_QR_FAILED);
            WalletConnectWallet.errorHandler(e);
          });
      } catch (e) {
        this.trackAccessWalletAmplitude(ACCESS_WALLET.MEW_WALLET_QR_FAILED);
        Toast(e.message, {}, SENTRY);
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
      if (this.eip6963Providers.length > 0) {
        const item = this.eip6963Providers.find(item => {
          if (item.info.name.toLowerCase() === 'enkrypt') return item;
        });
        if (item) {
          this.openWeb3Wallet(item);
          return;
        }
      }
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
    async openWeb3Wallet(item) {
      if (item || window.ethereum) {
        if (item) {
          this.setSelectedEIP6963Info(item.info);
          this.setSelectedEIP6963Provider(item.provider);
        }
        const providedProvider = item ? item.provider : window.ethereum;
        const web3 = new Web3(providedProvider);
        try {
          await providedProvider.enable();
          const acc = await web3.eth.requestAccounts();
          const wallet = new Web3Wallet(acc[0]);
          this.setWallet([wallet, providedProvider]);
          this.trackAccessWalletAmplitude(ACCESS_WALLET.WEB3_ACCESS_SUCCESS, {
            provider: item ? item.info.name : 'BrowserExtension'
          });
          if (this.path !== '') {
            this.$router.push({ path: this.path });
          } else {
            this.$router.push({ name: ROUTES_WALLET.DASHBOARD.NAME });
          }
        } catch (e) {
          if (
            e instanceof Error &&
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
.non-button-container {
  background-color: white;
  border-radius: 10px;
  padding: 24px 20px;
  letter-spacing: 0.5px;
  text-transform: none;
  width: 100%;
  height: initial;
  min-height: 157px;
  align-items: center;
  display: flex;
}

.mini-buttons {
  border: 1px solid var(--v-greenPrimary-base);
  border-radius: 4px;
  width: 110px;
  height: 45px;
}

.mini-button-container {
  width: 100%;
  overflow-x: auto;
}
</style>
