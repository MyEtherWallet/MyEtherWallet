<template>
  <div>
    <v-navigation-drawer
      v-model="navOpen"
      app
      class="wallet-sidemenu"
      width="300"
      :dark="$vuetify.theme.dark"
      color="bgSideMenu"
    >
      <template #prepend>
        <mew-popup
          :footer="footer"
          :show="isOpenNetworkOverlay || !validNetwork"
          :title="
            validNetwork
              ? 'Select Network'
              : 'Current network is not supported. Select a network below.'
          "
          content-size="large"
          :close="validNetwork ? closeNetworkOverlay : null"
          has-body-content
          :has-buttons="false"
          :left-btn="leftBtn"
          hide-close-btn
          :large-title="validNetwork"
        >
          <network-switch
            :filter-types="filterNetworks"
            :is-swap-page="isSwapPage"
            @newNetwork="closeNetworkOverlay"
          />
        </mew-popup>
        <div class="pa-5 pb-3">
          <div class="mt-2 mb-4 d-flex align-center justify-space-between">
            <!-- ================================================================================== -->
            <!-- MEW logo -->
            <!-- ================================================================================== -->
            <router-link :to="offlineModeRoute">
              <img width="120" src="@/assets/images/icons/logo-mew.svg" />
            </router-link>

            <!-- ================================================================================== -->
            <!-- Close Navigation Bar for xs-md screens -->
            <!-- ================================================================================== -->
            <v-btn icon class="d-block d-lg-none" @click="navOpen = false">
              <v-icon color="white">mdi-close</v-icon>
            </v-btn>
          </div>

          <!-- ================================================================================== -->
          <!-- Wallet balance card -->
          <!-- ================================================================================== -->
          <balance-card :sidemenu-status="navOpen" />
        </div>
      </template>

      <!-- ================================================================================== -->
      <!-- Wallet Side Nav -->
      <!-- ================================================================================== -->
      <v-list dense>
        <v-list-item-group>
          <template v-for="(item, idx) in sectionOne">
            <v-list-item
              v-if="shouldShow(item.route)"
              :key="item + idx + 1"
              :to="item.route"
            >
              <v-list-item-icon class="mx-3">
                <img
                  width="24"
                  height="24"
                  :src="item.icon"
                  :alt="item.title"
                />
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title
                  class="white--text font-weight-regular mew-body"
                >
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item-content>
              <div
                v-if="item.hasNew"
                class="new-dapp-label white--text mew-label px-1"
              >
                new
              </div>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>

      <v-divider class="my-1 mx-6" />

      <v-list v-if="!isOfflineApp" dense>
        <v-list-item-group>
          <template v-for="(item, idx) in sectionTwo">
            <v-list-item
              v-if="shouldShow(item.route)"
              :key="item + idx"
              :style="
                item.button ? 'background-color: transparent !important;' : ''
              "
              :to="item.route"
              @click="item.fn ? item.fn() : () => {}"
            >
              <v-list-item-icon class="mx-3">
                <img
                  width="24"
                  height="24"
                  :src="item.icon"
                  :alt="item.title"
                />
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title
                  class="white--text mew-body font-weight-regular"
                >
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>

      <v-divider v-if="!isOfflineApp" class="my-1 mx-6" />

      <v-list v-if="!isOfflineApp" dense>
        <v-list-item-group>
          <template v-for="(item, idx) in sectionThree">
            <!-- Sub-menu items -->
            <v-list-group
              v-if="item.children"
              :key="item + idx + 2"
              prepend-icon=""
              :value="expendSubMenu(item.children)"
            >
              <template #activator>
                <v-list-item-icon class="mx-3">
                  <img
                    width="24"
                    height="24"
                    :src="item.icon"
                    :alt="item.title"
                  />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    class="white--text font-weight-regular mew-body"
                  >
                    {{ item.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                v-for="child in item.children"
                :key="child.title"
                dense
                class="pl-4"
                :to="child.route"
              >
                <v-list-item-content>
                  <v-list-item-title
                    class="pl-13 white--text font-weight-regular mew-body"
                  >
                    {{ child.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </template>
        </v-list-item-group>
      </v-list>

      <v-divider v-if="!isOfflineApp" class="my-1 mx-6" />

      <v-list dense>
        <v-list-item
          v-for="(item, idx) in sectionFour"
          :key="item + idx"
          :to="item.route"
          @click="item.fn()"
        >
          <v-list-item-icon class="mx-3">
            <img width="24" height="24" :src="item.icon" :alt="item.title" />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text mew-body font-weight-regular">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <div class="mt-3 px-8">
          <v-switch
            v-model="$vuetify.theme.dark"
            class="tracking-switch"
            hide-details
            dark
            inset
            :label="`Dark theme is ${$vuetify.theme.dark ? 'On' : 'Off'}`"
            color="white"
            off-icon="mdi-alert-circle"
          />
        </div>

        <div v-if="online" class="mt-3 px-8">
          <div class="d-flex align-center justify-space-between">
            <a
              :href="`https://github.com/MyEtherWallet/MyEtherWallet/releases/tag/v${version}`"
              target="_blank"
              class="label-text"
              >v{{ version }}</a
            >
          </div>
        </div>
      </v-list>
    </v-navigation-drawer>
    <app-modal
      :show="openQR"
      :close="closeQR"
      :has-buttons="false"
      width="408px"
    >
      <template #dialogBody>
        <app-addr-qr />
      </template>
    </app-modal>
    <mew-popup
      max-width="400px"
      hide-close-btn
      :show="showLogoutPopup"
      :title="$t('interface.menu.logout')"
      :left-btn="{ text: 'Cancel', method: toggleLogout, color: 'basic' }"
      :right-btn="{
        text: 'Log out',
        color: 'error',
        method: onLogout,
        enabled: true
      }"
    ></mew-popup>
    <module-settings :on-settings="onSettings" @closeSettings="closeSettings" />
    <!--
    =====================================================================================
      Navigation Bar on top of the screen for xs-md screens
      <app-btn-menu /> opens navigation drawer
    =====================================================================================
    -->
    <v-system-bar
      v-if="!$vuetify.breakpoint.lgAndUp"
      color="#0b1a40"
      app
      :height="60"
      class="d-flex d-lg-none"
    >
      <v-row class="pa-3 align-center justify-space-between">
        <app-btn-menu class="mr-3" @click.native="openNavigation" />

        <router-link :to="offlineModeRoute" style="line-height: 0">
          <img height="26" src="@/assets/images/icons/logo-mew.svg" />
        </router-link>
        <v-spacer />
        <module-notifications v-if="!isOfflineApp" invert-icon />
      </v-row>
    </v-system-bar>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import send from '@/assets/images/icons/icon-send.svg';
import portfolio from '@/assets/images/icons/icon-dashboard-enable.svg';
// import bridge from '@/assets/images/icons/icon-bridge-enable.svg';
import nft from '@/assets/images/icons/icon-nft.svg';
import swap from '@/assets/images/icons/icon-swap-enable.svg';
import receive from '@/assets/images/icons/icon-arrow-down-right.svg';
import buy from '@/assets/images/icons/icon-credit-card.svg';
import dapp from '@/assets/images/icons/icon-apps-enable.svg';
import contract from '@/assets/images/icons/icon-contract-enable.svg';
import message from '@/assets/images/icons/icon-message-enable.svg';
import settings from '@/assets/images/icons/icon-setting-enable.svg';
import logout from '@/assets/images/icons/icon-logout-enable.svg';
import { EventBus } from '@/core/plugins/eventBus';
import { ETH, BSC, MATIC } from '@/utils/networks/types';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import dappsMeta from '@/dapps/metainfo-dapps';
import { BUYSELL_EVENT } from '@/modules/buy-sell/helpers';
import isNew from '@/core/helpers/isNew.js';

export default {
  components: {
    AppModal: () => import('@/core/components/AppModal'),
    AppAddrQr: () => import('@/core/components/AppAddrQr'),
    AppBtnMenu: () => import('@/core/components/AppBtnMenu'),
    BalanceCard: () => import('@/modules/balance/ModuleBalanceCard'),
    ModuleSettings: () => import('@/modules/settings/ModuleSettings'),
    ModuleNotifications: () =>
      import('@/modules/notifications/ModuleNotifications'),
    NetworkSwitch: () =>
      import('@/modules/network/components/NetworkSwitch.vue')
  },
  mixins: [handlerAnalytics],
  data() {
    return {
      isOpenNetworkOverlay: false,
      navOpen: null,
      version: VERSION,
      openQR: false,
      onSettings: false,
      showLogoutPopup: false,
      routeNetworks: {
        [ROUTES_WALLET.SWAP.NAME]: [ETH, BSC, MATIC],
        [ROUTES_WALLET.NFT_MANAGER.NAME]: [ETH, BSC, MATIC]
      },
      footer: {
        text: 'Need help?',
        linkTitle: 'Contact support',
        link: 'mailto:support@myetherwallet.com'
      }
    };
  },
  computed: {
    ...mapGetters('global', ['network', 'isEthNetwork', 'hasSwap']),
    ...mapState('wallet', ['instance', 'isOfflineApp']),
    ...mapState('global', ['online', 'validNetwork']),
    ...mapState('popups', ['consentToTrack']),
    leftBtn() {
      return {
        title: '',
        color: 'primary',
        method: this.validNetwork ? this.closeNetworkOverlay : null
      };
    },
    /**
     * IMPORTANT TO DO:
     * @returns {boolean}
     */
    filterNetworks() {
      if (this.isHardware) {
        return [];
      }
      return [];
    },
    /**
     * Property returns whether or not you are on the swap page
     * @returns {boolean}
     */
    isSwapPage() {
      return this.$route.name === 'Swap';
    },
    sectionOne() {
      if (this.online) {
        const hasNew = Object.values(dappsMeta).filter(item => {
          if (isNew(item.release)) {
            return item;
          }
        });
        return [
          {
            title: this.$t('interface.menu.portfolio'),
            route: this.offlineModeRoute,
            icon: portfolio
          },
          {
            title: this.$t('interface.menu.apps'),
            route: { name: ROUTES_WALLET.DAPPS.NAME },
            icon: dapp,
            hasNew: hasNew.length > 0
          },
          {
            title: this.$t('interface.menu.nft'),
            route: { name: ROUTES_WALLET.NFT_MANAGER.NAME },
            icon: nft
          }
        ];
      }
      return [
        {
          title: this.$t('sendTx.send-offline'),
          route: { name: ROUTES_WALLET.SEND_TX_OFFLINE.NAME },
          icon: send
        },
        {
          title: this.$t('interface.menu.sign-message'),
          route: { name: ROUTES_WALLET.SIGN_MESSAGE.NAME },
          icon: message
        }
      ];
    },
    sectionTwo() {
      if (this.online) {
        const sectionTwo = [
          {
            title: this.$t('interface.menu.swap'),
            icon: swap,
            route: { name: ROUTES_WALLET.SWAP.NAME },
            fn: this.trackToSwap
          },
          // {
          //   title: this.$t('interface.menu.bridge'),
          //   icon: bridge,
          //   route: { name: ROUTES_WALLET.BRIDGE.NAME }
          // },
          {
            title: this.$t('interface.menu.send'),
            icon: send,
            route: { name: ROUTES_WALLET.SEND_TX.NAME }
          },
          {
            title: this.$t('interface.menu.receive'),
            icon: receive,
            fn: () => {
              this.openQR = true;
            },
            button: true
          }
        ];
        if (
          this.network.type.name === ETH.name ||
          this.network.type.name === BSC.name ||
          this.network.type.name === MATIC.name
        ) {
          sectionTwo.push({
            title: this.$t('interface.menu.buy-sell'),
            icon: buy,
            fn: this.openBuySell,
            button: true
          });
        }
        return sectionTwo;
      }
      return [];
    },
    sectionThree() {
      if (this.online) {
        return [
          {
            title: this.$t('interface.menu.contract'),
            icon: contract,
            children: [
              {
                title: this.$t('interface.menu.deploy'),
                route: { name: ROUTES_WALLET.DEPLOY_CONTRACT.NAME }
              },
              {
                title: this.$t('interface.menu.interact-contract'),
                route: { name: ROUTES_WALLET.INTERACT_WITH_CONTRACT.NAME }
              }
            ]
          },
          {
            title: this.$t('interface.menu.message'),
            icon: message,
            children: [
              {
                title: this.$t('interface.menu.sign-message'),
                route: { name: ROUTES_WALLET.SIGN_MESSAGE.NAME }
              },
              {
                title: this.$t('interface.menu.verify-message'),
                route: { name: ROUTES_WALLET.VERIFY_MESSAGE.NAME }
              }
            ]
          }
        ];
      }
      return [];
    },
    sectionFour() {
      if (this.online) {
        return [
          {
            title: this.$t('common.settings'),
            icon: settings,
            fn: this.openSettings,
            route: { name: ROUTES_WALLET.SETTINGS.NAME }
          },
          {
            title: this.$t('common.logout'),
            icon: logout,
            fn: this.toggleLogout
          }
        ];
      }
      return [
        {
          title: this.$t('common.logout'),
          icon: logout,
          fn: this.toggleLogout
        }
      ];
    },
    offlineModeRoute() {
      return this.isOfflineApp
        ? { name: ROUTES_WALLET.WALLETS.NAME }
        : { name: ROUTES_WALLET.DASHBOARD.NAME };
    }
  },
  watch: {
    isOpenNetworkOverlay(newVal) {
      if (newVal && this.$route.name == ROUTES_WALLET.SWAP.NAME) {
        this.trackSwap('switchingNetworkOnSwap');
      }
    },
    navOpen(newVal) {
      if (this.isOpenNetworkOverlay && !newVal)
        this.isOpenNetworkOverlay = false;
    }
  },
  mounted() {
    // If no menu item is selected on load, redirect user to Dashboard
    if (!this.isOfflineApp) {
      this.redirectToDashboard();
    } else {
      this.footer = {
        text: 'Need help? Email us at support@myetherwallet.com',
        linkTitle: '',
        link: ''
      };
    }

    if (this.$route.name == ROUTES_WALLET.SETTINGS.NAME) {
      this.openSettings();
    }
    EventBus.$on('openSettings', () => {
      this.openSettings();
    });
    EventBus.$on('openNetwork', () => {
      this.openNetwork();
    });
  },
  beforeDestroy() {
    EventBus.$off('openSettings');
    EventBus.$off('openNetwork');
  },
  methods: {
    ...mapActions('wallet', ['removeWallet']),
    trackToSwap() {
      this.trackSwap('fromSideMenu');
    },
    trackBuySellFunc() {
      this.trackBuySell('buySellHome');
    },
    closeNetworkOverlay() {
      if (this.validNetwork) {
        this.isOpenNetworkOverlay = false;
      }
    },
    shouldShow(route) {
      if (this.routeNetworks[route?.name]) {
        for (const net of this.routeNetworks[route.name]) {
          if (net.name === this.network.type.name) return true;
        }
        return false;
      }
      return true;
    },
    openNetwork() {
      this.isOpenNetworkOverlay = true;
    },
    openBuySell() {
      EventBus.$emit(BUYSELL_EVENT);
      this.trackBuySellFunc();
    },
    openNavigation() {
      this.navOpen = true;
    },
    openSettings() {
      this.onSettings = true;
    },
    closeSettings() {
      if (this.$router.currentRoute.name === ROUTES_WALLET.SETTINGS.NAME)
        this.$router.go(-1);
      this.onSettings = false;
    },
    onLogout() {
      this.showLogoutPopup = false;
      this.removeWallet();
    },
    toggleLogout() {
      this.showLogoutPopup = !this.showLogoutPopup;
    },
    /* =================================================================== */
    /* If no menu item is selected on load, redirect user to Dashboard     */
    /* =================================================================== */
    redirectToDashboard() {
      if (this.$route.name == ROUTES_WALLET.WALLETS.NAME) {
        this.$router.push(this.offlineModeRoute);
      }
    },
    /* =================================================================== */
    /* If sub-menu item is selected on load, expend the sub-menu slot      */
    /* =================================================================== */
    expendSubMenu(children) {
      for (const c of children) {
        if (this.$route.name == c.route.name) return true;
      }
    },
    /**
     * set openQR to false
     * to close the modal
     */
    closeQR() {
      this.openQR = false;
    }
  }
};
</script>

<style lang="scss" scoped>
// Make selected top three button bold
.v-list-item--active .btn-title {
  font-weight: 500;
}

.new-dapp-label {
  border-radius: 2px;
  background: #ff445b;
  animation: pulse 3s infinite;
}
@-webkit-keyframes pulse {
  0% {
    -webkit-box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  70% {
    -webkit-box-shadow: 0 0 0 5px rgba(255, 255, 255, 0);
  }
  100% {
    -webkit-box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}
@keyframes pulse {
  0% {
    -moz-box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  70% {
    -moz-box-shadow: 0 0 0 5px rgba(255, 255, 255, 0);
    box-shadow: 0 0 0 5px rgba(255, 255, 255, 0);
  }
  100% {
    -moz-box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
    box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
  }
}
.label-text {
  color: rgba(255, 255, 255, 0.5);
}
</style>

<style lang="scss">
// =======================================================
// Scoped styles for .wallet-sidemenu
// =======================================================
.wallet-sidemenu {
  .v-system-bar .v-icon {
    font-size: 36px !important;
    color: white !important;
  }

  .v-list-item--dense .v-list-item__title {
    line-height: 20px !important;
  }
  .v-list-item,
  .v-input--switch {
    opacity: 0.7 !important;

    &:hover {
      opacity: 1 !important;
    }
  }

  a.v-item--active,
  .v-input--is-label-active {
    opacity: 1 !important;
    filter: grayscale(0);
  }

  .v-list-item--active.v-list-item:not(
      .v-list-group__header
    ).remove-select-state {
    background-color: transparent !important;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2) !important;
    }
  }

  .v-list-item--link {
    border-top: none;
  }
  .v-list-item--active {
    .v-list-item__content {
      .v-list-item__title {
        font-weight: 500 !important;
      }
    }
  }
  .v-list-group__header__append-icon {
    .v-icon {
      color: var(--v-white-base) !important;
    }
  }
  .v-divider {
    border-color: rgba(255, 255, 255, 0.22) !important;
  }
  .v-list-item--link:hover {
    background-color: rgba(255, 255, 255, 0.2) !important;
  }
  .v-list-item:after {
    min-height: 40px !important;
  }
  .mew-body.font-weight-bold {
    font-weight: 400 !important;
  }
  .v-list-item--active.v-list-item:not(.v-list-group__header) {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
  .v-list-item--active::before {
    opacity: 0 !important;
  }
  .v-navigation-drawer__content {
    margin-right: 2px;
    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    &::-webkit-scrollbar-button {
      width: 0;
      height: 0;
    }
    &::-webkit-scrollbar-thumb {
      background: #7b91ac;
      border: 0 none #fff;
      border-radius: 50px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #7b91ac;
    }
    &::-webkit-scrollbar-thumb:active {
      background: #4b4949;
    }
    &::-webkit-scrollbar-track {
      background: #e1dfdf;
      border: 0 none #fff;
      border-radius: 39px;
    }
    &::-webkit-scrollbar-track:hover {
      background: #ddd5d5;
    }
    &::-webkit-scrollbar-track:active {
      background: #dedede;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
  .tracking-switch {
    .v-label {
      color: var(--v-white-base);
    }
  }
  .opacity--30 {
    opacity: 30% !important;
  }
}
</style>
