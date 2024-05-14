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
                NEW
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
              :to="item.route"
              :active-class="item.route ? '' : 'remove-active-class'"
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
              <div
                v-if="item.hasNew"
                class="new-dapp-label white--text mew-label px-1"
              >
                NEW
              </div>
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
                @click="child.fn ? child.fn() : () => {}"
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
            v-model="locDarkMode"
            class="tracking-switch"
            hide-details
            dark
            inset
            :label="`Dark theme is ${locDarkMode ? 'On' : 'Off'}`"
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
import stake from '@/assets/images/icons/icon-stake.svg';
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
import { ETH, BSC, MATIC, GOERLI, ARB, OP } from '@/utils/networks/types';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import {
  CONTRACT,
  DASHBOARD,
  STAKING
} from '@/modules/analytics-opt-in/handlers/configs/events';
import dappsMeta from '@/dapps/metainfo-dapps';
import stakingMeta from '@/dapps/metainfo-staking';
import buyMore from '@/core/mixins/buyMore.mixin';
import isNew from '@/core/helpers/isNew.js';

export default {
  components: {
    BalanceCard: () => import('@/modules/balance/ModuleBalanceCard'),
    ModuleSettings: () => import('@/modules/settings/ModuleSettings'),
    ModuleNotifications: () =>
      import('@/modules/notifications/ModuleNotifications'),
    NetworkSwitch: () =>
      import('@/modules/network/components/NetworkSwitch.vue')
  },
  mixins: [handlerAnalytics, buyMore],
  data() {
    const locDarkMode = this.$vuetify.theme.dark;
    return {
      isOpenNetworkOverlay: false,
      navOpen: null,
      version: VERSION,
      openQR: false,
      onSettings: false,
      showLogoutPopup: false,
      routeNetworks: {
        [ROUTES_WALLET.SWAP.NAME]: [ETH, BSC, MATIC],
        [ROUTES_WALLET.STAKE.NAME]: [ETH, GOERLI],
        [ROUTES_WALLET.NFT_MANAGER.NAME]: [ETH, BSC, MATIC]
      },
      footer: {
        text: 'Need help?',
        linkTitle: 'Contact support',
        link: 'mailto:support@myetherwallet.com'
      },
      locDarkMode: locDarkMode
    };
  },
  computed: {
    ...mapGetters('global', ['network', 'isEthNetwork', 'hasSwap', 'darkMode']),
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
    sectionOne() {
      if (this.online) {
        const hasNew = Object.values(dappsMeta).filter(item => {
          const dappSupport = item.networks.findIndex(nType => {
            if (nType.chainID === this.network.type.chainID) {
              return nType;
            }
          });
          if (isNew(item.release) && dappSupport > -1 && !item.staking) {
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
      const hasNew = Object.values(stakingMeta).filter(item => {
        const stakingSupport = item.networks.findIndex(nType => {
          if (nType.chainID === this.network.type.chainID) {
            return nType;
          }
        });
        if (isNew(item.release) && stakingSupport > -1) {
          return item;
        }
      });
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
            title: 'Stake',
            icon: stake,
            route: { name: ROUTES_WALLET.STAKE.NAME },
            hasNew: hasNew.length > 0,
            fn: this.trackToStaking
          },
          {
            title: this.$t('interface.menu.receive'),
            icon: receive,
            fn: () => {
              this.trackDashboardAmplitude(DASHBOARD.SHOW_RECEIVE_ADDRESS);
              this.openQR = true;
            },
            route: undefined
          }
        ];
        if (
          this.network.type.name === ETH.name ||
          this.network.type.name === BSC.name ||
          this.network.type.name === MATIC.name ||
          this.network.type.name === ARB.name ||
          this.network.type.name === OP.name
        ) {
          sectionTwo.push({
            title: this.$t('interface.menu.buy-sell'),
            icon: buy,
            fn: () => {
              this.openBuySell('WalletSideMenu');
            },
            route: undefined
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
                route: { name: ROUTES_WALLET.DEPLOY_CONTRACT.NAME },
                fn: this.trackDeploy
              },
              {
                title: this.$t('interface.menu.interact-contract'),
                route: { name: ROUTES_WALLET.INTERACT_WITH_CONTRACT.NAME },
                fn: this.trackInteract
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
    '$vuetify.theme.dark': function (val) {
      this.locDarkMode = val;
    },
    locDarkMode(val) {
      this.setDarkMode(val);
      this.$vuetify.theme.dark = val;
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
    ...mapActions('global', ['setDarkMode']),
    trackToSwap() {
      this.trackDashboardAmplitude(DASHBOARD.SWAP_LEFT_NAVIGATION);
    },
    trackInteract() {
      this.trackContract(CONTRACT.NAVIGATE_TO_INTERACT);
    },
    trackDeploy() {
      this.trackContract(CONTRACT.NAVIGATE_TO_DEPLOY);
    },
    trackToStaking() {
      this.trackStaking(STAKING.SIDE_MENU);
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
      this.$vuetify.theme.dark = false;
      this.trackLogout();
      this.removeWallet();
    },
    toggleLogout() {
      this.showLogoutPopup = !this.showLogoutPopup;
    },
    /* =================================================================== */
    /* If no menu item is selected on load, redirect user to Dashboard     */
    /* =================================================================== */
    redirectToDashboard() {
      if (this.$route.name === ROUTES_WALLET.WALLETS.NAME) {
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
  .v-list-item--active.v-list-item:not(
      .v-list-group__header
    ).remove-active-class {
    background-color: transparent !important;
  }
  .v-list-item--active::before {
    opacity: 0 !important;
  }
  .v-navigation-drawer__content {
    scrollbar-width: thin !important;
    margin-right: 2px;
    &::-webkit-scrollbar {
      width: 4px !important;
      height: 4px !important;
    }
    &::-webkit-scrollbar-button {
      width: 0 !important;
      height: 0 !important;
    }
    &::-webkit-scrollbar-thumb {
      background: #7b91ac !important;
      border: 0 none #fff !important;
      border-radius: 50px !important;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #7b91ac !important;
    }
    &::-webkit-scrollbar-thumb:active {
      background: #4b4949 !important;
    }
    &::-webkit-scrollbar-track {
      background: #e1dfdf !important;
      border: 0 none #fff !important;
      border-radius: 39px !important;
    }
    &::-webkit-scrollbar-track:hover {
      background: #ddd5d5 !important;
    }
    &::-webkit-scrollbar-track:active {
      background: #dedede !important;
    }
    &::-webkit-scrollbar-corner {
      background: transparent !important;
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
