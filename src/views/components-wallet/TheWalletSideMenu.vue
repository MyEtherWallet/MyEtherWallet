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
          <NetworkSwitch @newNetwork="closeNetworkOverlay" />
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
          <ModuleBalanceCard :sidemenu-status="navOpen" />
        </div>
      </template>

      <!-- ================================================================================== -->
      <!-- Wallet Side Nav -->
      <!-- ================================================================================== -->
      <v-list dense>
        <v-list-item-group>
          <template v-for="(sectionOneItem, idx) in sectionOne">
            <v-list-item
              v-if="shouldShow(sectionOneItem.route)"
              :key="'sectionOneItem' + idx + 1"
              :to="sectionOneItem.route"
            >
              <v-list-item-icon class="mx-3">
                <img
                  width="24"
                  height="24"
                  :src="sectionOneItem.icon"
                  :alt="sectionOneItem.title"
                />
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title
                  class="white--text font-weight-regular mew-body"
                >
                  {{ sectionOneItem.title }}
                </v-list-item-title>
              </v-list-item-content>
              <div
                v-if="sectionOneItem.hasNew"
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
          <template v-for="(sectionTwoItem, idx) in sectionTwo">
            <v-list-item
              v-if="shouldShow(sectionTwoItem.route)"
              :key="'sectionTwoItem' + idx"
              :to="sectionTwoItem.route"
              :active-class="sectionTwoItem.route ? '' : 'remove-active-class'"
              @click="sectionTwoItem.fn ? sectionTwoItem.fn() : () => {}"
            >
              <v-list-item-icon class="mx-3">
                <img
                  width="24"
                  height="24"
                  :src="sectionTwoItem.icon"
                  :alt="sectionTwoItem.title"
                />
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title
                  class="white--text mew-body font-weight-regular"
                >
                  {{ sectionTwoItem.title }}
                </v-list-item-title>
              </v-list-item-content>
              <div
                v-if="sectionTwoItem.hasNew"
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
          <template v-for="(sectionThreeItem, idx) in sectionThree">
            <!-- Sub-menu items -->
            <v-list-group
              v-if="sectionThreeItem.children"
              :key="'sectionThreeItem' + idx"
              prepend-icon=""
              :value="expendSubMenu(sectionThreeItem.children)"
            >
              <template #activator>
                <v-list-item-icon class="mx-3">
                  <img
                    width="24"
                    height="24"
                    :src="sectionThreeItem.icon"
                    :alt="sectionThreeItem.title"
                  />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    class="white--text font-weight-regular mew-body"
                  >
                    {{ sectionThreeItem.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                v-for="child in sectionThreeItem.children"
                :key="'sectionThreeItem' + child.title"
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
          v-for="(sectionFourItem, idx) in sectionFour"
          :key="'sectionFourItem' + idx"
          :to="sectionFourItem.route"
          @click="sectionFourItem.fn()"
        >
          <v-list-item-icon class="mx-3">
            <img
              width="24"
              height="24"
              :src="sectionFourItem.icon"
              :alt="sectionFourItem.title"
            />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text mew-body font-weight-regular">
              {{ sectionFourItem.title }}
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
      :title="t('interface.menu.logout')"
      :left-btn="{ text: 'Cancel', method: toggleLogout, color: 'basic' }"
      :right-btn="{
        text: 'Log out',
        color: 'error',
        method: onLogout,
        enabled: true
      }"
    ></mew-popup>
    <ModuleSettings :on-settings="onSettings" @closeSettings="closeSettings" />
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
        <ModuleNotifications v-if="!isOfflineApp" invert-icon />
      </v-row>
    </v-system-bar>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n-composable';
import { useRoute, useRouter } from 'vue-router/composables';

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
import { ETH, BSC, MATIC, GOERLI } from '@/utils/networks/types';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import {
  CONTRACT,
  DASHBOARD,
  STAKING
} from '@/modules/analytics-opt-in/handlers/configs/events';
import dappsMeta from '@/dapps/metainfo-dapps';
import stakingMeta from '@/dapps/metainfo-staking';
import isNew from '@/core/helpers/isNew.js';
import { useAmplitude } from '@/core/composables/amplitude';
import { useBuySell } from '@/core/composables/buyMore';
import { useVuetify } from '@/core/composables/vuetify';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';

import ModuleBalanceCard from '@/modules/balance/ModuleBalanceCard';
import ModuleSettings from '@/modules/settings/ModuleSettings';
import ModuleNotifications from '@/modules/notifications/ModuleNotifications';
import NetworkSwitch from '@/modules/network/components/NetworkSwitch.vue';

// injections/use
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { trackDashboardAmplitude, trackContract, trackStaking, trackLogout } =
  useAmplitude();
const { openBuySell } = useBuySell();
const vuetify = useVuetify();
const { isOfflineApp, removeWallet } = useWalletStore();
const { network, online, validNetwork, setDarkMode } = useGlobalStore();

// data
const version = VERSION;
const routeNetworks = {
  [ROUTES_WALLET.SWAP.NAME]: [ETH, BSC, MATIC],
  [ROUTES_WALLET.STAKE.NAME]: [ETH, GOERLI],
  [ROUTES_WALLET.NFT_MANAGER.NAME]: [ETH, BSC, MATIC]
};
const footer = ref({
  text: 'Need help?',
  linkTitle: 'Contact support',
  link: 'mailto:support@myetherwallet.com'
});

const isOpenNetworkOverlay = ref(false);
const navOpen = ref(null);
const openQR = ref(false);
const onSettings = ref(false);
const showLogoutPopup = ref(false);
const locDarkMode = ref(vuetify.theme.dark);

const leftBtn = computed(() => {
  return {
    title: '',
    color: 'primary',
    method: validNetwork ? closeNetworkOverlay.value : null
  };
});

const sectionOne = computed(() => {
  if (online) {
    const hasNew = Object.values(dappsMeta).filter(item => {
      const dappSupport = item.networks.findIndex(nType => {
        if (nType.chainID === network.type.chainID) {
          return nType;
        }
      });
      if (isNew(item.release) && dappSupport > -1 && !item.staking) {
        return item;
      }
    });
    return [
      {
        title: t('interface.menu.portfolio'),
        route: offlineModeRoute.value,
        icon: portfolio
      },
      {
        title: t('interface.menu.apps'),
        route: { name: ROUTES_WALLET.DAPPS.NAME },
        icon: dapp,
        hasNew: hasNew.length > 0
      },
      {
        title: t('interface.menu.nft'),
        route: { name: ROUTES_WALLET.NFT_MANAGER.NAME },
        icon: nft
      }
    ];
  }
  return [
    {
      title: t('sendTx.send-offline'),
      route: { name: ROUTES_WALLET.SEND_TX_OFFLINE.NAME },
      icon: send
    },
    {
      title: t('interface.menu.sign-message'),
      route: { name: ROUTES_WALLET.SIGN_MESSAGE.NAME },
      icon: message
    }
  ];
});

const sectionTwo = computed(() => {
  const hasNew = Object.values(stakingMeta).filter(item => {
    const stakingSupport = item.networks.findIndex(nType => {
      if (nType.chainID === network.type.chainID) {
        return nType;
      }
    });
    if (isNew(item.release) && stakingSupport > -1) {
      return item;
    }
  });
  if (online) {
    const sectionTwo = [
      {
        title: t('interface.menu.swap'),
        icon: swap,
        route: { name: ROUTES_WALLET.SWAP.NAME },
        fn: trackToSwap
      },
      // {
      //   title: t('interface.menu.bridge'),
      //   icon: bridge,
      //   route: { name: ROUTES_WALLET.BRIDGE.NAME }
      // },
      {
        title: t('interface.menu.send'),
        icon: send,
        route: { name: ROUTES_WALLET.SEND_TX.NAME }
      },
      {
        title: 'Stake',
        icon: stake,
        route: { name: ROUTES_WALLET.STAKE.NAME },
        hasNew: hasNew.length > 0,
        fn: trackToStaking
      },
      {
        title: t('interface.menu.receive'),
        icon: receive,
        fn: () => {
          trackDashboardAmplitude(DASHBOARD.SHOW_RECEIVE_ADDRESS);
          openQR.value = true;
        },
        route: undefined
      }
    ];
    if (
      network.type.name === ETH.name ||
      network.type.name === BSC.name ||
      network.type.name === MATIC.name
    ) {
      sectionTwo.push({
        title: t('interface.menu.buy-sell'),
        icon: buy,
        fn: () => {
          openBuySell('WalletSideMenu');
        },
        route: undefined
      });
    }
    return sectionTwo;
  }
  return [];
});

const sectionThree = computed(() => {
  if (online) {
    return [
      {
        title: t('interface.menu.contract'),
        icon: contract,
        children: [
          {
            title: t('interface.menu.deploy'),
            route: { name: ROUTES_WALLET.DEPLOY_CONTRACT.NAME },
            fn: trackDeploy
          },
          {
            title: t('interface.menu.interact-contract'),
            route: { name: ROUTES_WALLET.INTERACT_WITH_CONTRACT.NAME },
            fn: trackInteract
          }
        ]
      },
      {
        title: t('interface.menu.message'),
        icon: message,
        children: [
          {
            title: t('interface.menu.sign-message'),
            route: { name: ROUTES_WALLET.SIGN_MESSAGE.NAME }
          },
          {
            title: t('interface.menu.verify-message'),
            route: { name: ROUTES_WALLET.VERIFY_MESSAGE.NAME }
          }
        ]
      }
    ];
  }
  return [];
});

const sectionFour = computed(() => {
  if (online) {
    return [
      {
        title: t('common.settings'),
        icon: settings,
        fn: openSettings,
        route: { name: ROUTES_WALLET.SETTINGS.NAME }
      },
      {
        title: t('common.logout'),
        icon: logout,
        fn: toggleLogout
      }
    ];
  }
  return [
    {
      title: t('common.logout'),
      icon: logout,
      fn: toggleLogout
    }
  ];
});

const offlineModeRoute = computed(() => {
  return isOfflineApp
    ? { name: ROUTES_WALLET.WALLETS.NAME }
    : { name: ROUTES_WALLET.DASHBOARD.NAME };
});

// returns vuetify dark mode value to be watched
const vDarkMode = computed(() => {
  return vuetify.theme.dark;
});

// watchers
watch(
  () => vDarkMode,
  val => {
    locDarkMode.value = val;
  }
);

watch(
  () => locDarkMode,
  val => {
    setDarkMode(val);
    vuetify.theme.dark = val;
  }
);

watch(
  () => navOpen,
  val => {
    if (isOpenNetworkOverlay.value && !val) {
      isOpenNetworkOverlay.value = false;
    }
  }
);

// mounted
onMounted(() => {
  if (isOfflineApp) {
    redirectToDashboard();
  } else {
    footer.value = {
      text: 'Need help? Email us at support@myetherwallet.com',
      linkTitle: '',
      link: ''
    };
  }

  if (route.name == ROUTES_WALLET.SETTINGS.NAME) {
    openSettings();
  }
  EventBus.$on('openSettings', () => {
    openSettings();
  });
  EventBus.$on('openNetwork', () => {
    openNetwork();
  });
});

onBeforeUnmount(() => {
  EventBus.$off('openSettings');
  EventBus.$off('openNetwork');
});

const trackToSwap = () => {
  trackDashboardAmplitude(DASHBOARD.SWAP_LEFT_NAVIGATION);
};
const trackInteract = () => {
  trackContract(CONTRACT.NAVIGATE_TO_INTERACT);
};
const trackDeploy = () => {
  trackContract(CONTRACT.NAVIGATE_TO_DEPLOY);
};
const trackToStaking = () => {
  trackStaking(STAKING.SIDE_MENU);
};
const closeNetworkOverlay = () => {
  if (validNetwork) {
    isOpenNetworkOverlay.value = false;
  }
};
const shouldShow = route => {
  if (routeNetworks[route?.name]) {
    for (const net of routeNetworks[route.name]) {
      if (net.name === network.type.name) return true;
    }
    return false;
  }
  return true;
};
const openNetwork = () => {
  isOpenNetworkOverlay.value = true;
};
const openNavigation = () => {
  navOpen.value = true;
};
const openSettings = () => {
  onSettings.value = true;
};
const closeSettings = () => {
  if (router.currentRoute.name === ROUTES_WALLET.SETTINGS.NAME) router.go(-1);
  onSettings.value = false;
};
const onLogout = () => {
  showLogoutPopup.value = false;
  vuetify.theme.dark = false;
  trackLogout();
  removeWallet();
};
const toggleLogout = () => {
  showLogoutPopup.value = !showLogoutPopup.value;
};
/* =================================================================== */
/* If no menu item is selected on load, redirect user to Dashboard     */
/* =================================================================== */
const redirectToDashboard = () => {
  if (route.name === ROUTES_WALLET.WALLETS.NAME) {
    router.push(offlineModeRoute);
  }
};
/* =================================================================== */
/* If sub-menu item is selected on load, expend the sub-menu slot      */
/* =================================================================== */
const expendSubMenu = children => {
  for (const c of children) {
    if (route.name == c.route.name) return true;
  }
};
/**
 * set openQR to false
 * to close the modal
 */
const closeQR = () => {
  openQR.value = false;
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
