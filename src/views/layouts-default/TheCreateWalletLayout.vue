<template>
  <div class="expandHeader">
    <v-container>
      <!--
    =====================================================================================
        Layout Title
    =====================================================================================
    -->
      <the-layout-header
        :title="$t('home.create-wallet.title')"
        :subtitle-line-one="$t('home.create-wallet.subtitle-one')"
        :subtitle-line-two="$t('home.create-wallet.subtitle-two')"
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
            class="mb-5 py-6"
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
    </v-container>
    <div class="spacer-y-medium" />
    <mew-toast
      ref="toast"
      can-close
      :link-obj="toastLink"
      text="Did you know? Hardware wallets offer the highest security for accessing your crypto."
      toast-type="info"
    />
    <!--
    =====================================================================================
      Create Wallet with Software Overlay - activates on Create Software Button click
    =====================================================================================
    -->
    <module-create-wallet-software
      :open="showSoftwareModule"
      :wallet-type="type"
      :close="closeSoftwareModule"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { ROUTES_HOME } from '@/core/configs/configRoutes';
import enkryptMarketing from '@/core/mixins/enkryptMarketing.mixin';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import {
  COMMON,
  CREATE_WALLET
} from '@/modules/analytics-opt-in/handlers/configs/events.js';

export default {
  name: 'TheCreateWalletLayout',
  components: {
    ModuleCreateWalletSoftware: () =>
      import('@/modules/create-wallet/ModuleCreateWalletSoftware'),
    TheLayoutHeader: () => import('../components-default/TheLayoutHeader')
  },
  mixins: [enkryptMarketing, handlerAnalytics],
  props: {
    showSoftwareModule: {
      type: Boolean
    },
    type: {
      type: String,
      default: 'overview'
    }
  },
  data: () => ({
    toastLink: {
      title: 'Buy a hardware wallet',
      url: ''
    },
    titleRoute: {
      text: 'Access Wallet',
      routeName: 'AccessWallet',
      func: () => {
        this.trackCreateWalletAmplitude(CREATE_WALLET.NAVIGATE_TO_ACCESS);
      }
    }
  }),
  computed: {
    ...mapState('wallet', ['isOfflineApp']),
    buttons() {
      return !this.isOfflineApp
        ? [
            /* Enkrypt */
            {
              color: 'white',
              title: 'Install Enkrypt browser extension',
              subtitle:
                'MEW’s official browser extension. Connect to web3 on Ethereum and Polkadot, manage your NFTs, buy, send and swap',
              official: true,
              recommended: true,
              icon: require('@/assets/images/icons/icon-enkrypt-block.svg'),
              alt: 'Enkrypt',
              fn: () => {
                this.trackCreateWalletAmplitude(COMMON.GOOGLE_STORE);
                this.openEnkrypt();
              }
            },
            /* MEW wallet Button */
            {
              color: 'white',
              title: 'Download MEW wallet app',
              subtitle:
                'Our official mobile app to create your wallet, and connect to MEW Web using your mobile phone',
              official: true,
              recommended: true,
              icon: require('@/assets/images/icons/icon-mew-wallet.png'),
              alt: 'MEW wallet',
              fn: () => {
                this.trackCreateWalletAmplitude(COMMON.MEW_WALLET);
                this.openMewWallet();
              }
            },
            /* Hardware wallets */
            {
              color: 'white',
              title: 'Buy a hardware wallet',
              subtitle:
                'For the highest standard of security, buy a hardware wallet and use it with MEW',
              official: false,
              recommended: true,
              icon: require('@/assets/images/icons/icon-hardware-wallet.png'),
              alt: 'Hardware Wallets',
              fn: () => {
                this.trackCreateWalletAmplitude(CREATE_WALLET.BUY_HARDWARE);
                this.$router.push({
                  name: ROUTES_HOME.BUY_HARDWARE_WALLET.NAME
                });
              }
            },
            /* Software */
            {
              color: 'white',
              style: 'outline',
              title: 'Software',
              subtitle:
                'Software methods like Keystore File and Mnemonic Phrase should only be used in offline settings by experienced users',
              official: false,
              recommended: false,
              fn: () => {
                this.trackCreateWalletAmplitude(CREATE_WALLET.SOFTWARE_METHOD);
                this.openSoftwareModule();
              }
            }
          ]
        : [
            /* Software */
            {
              color: 'white',
              style: 'outline',
              title: 'Software',
              subtitle:
                'Software methods like Keystore File and Mnemonic Phrase should only be used in offline settings by experienced users',
              official: false,
              recommended: false,
              fn: () => {
                this.trackCreateWalletAmplitude(CREATE_WALLET.SOFTWARE_METHOD);
                this.openSoftwareModule();
              }
            }
          ];
    }
  },
  mounted() {
    this.trackCreateWalletAmplitude(COMMON.PAGE_SHOWN);
  },
  methods: {
    openSoftwareModule() {
      try {
        this.$router.push({
          name: ROUTES_HOME.CREATE_WALLET.NAME,
          params: { overlay: 'software' },
          query: { type: 'overview' }
        });
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },
    closeSoftwareModule() {
      try {
        this.trackCreateWalletAmplitude(CREATE_WALLET.CLOSE_SOFTWARE);
        this.$router.push({
          name: ROUTES_HOME.CREATE_WALLET.NAME
        });
      } catch (e) {
        Toast(e, {}, ERROR);
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
</style>
