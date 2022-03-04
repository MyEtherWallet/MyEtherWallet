<template>
  <div>
    <module-moon-pay :open="moonPayOpen" @close="moonPayOpen = false" />

    <v-navigation-drawer
      v-model="navOpen"
      app
      class="wallet-sidemenu"
      :src="background"
      width="300"
      :dark="$vuetify.theme.dark"
    >
      <template #prepend>
        <div class="pa-5 pb-3">
          <div class="mt-2 mb-4 d-flex align-center justify-space-between">
            <!-- ================================================================================== -->
            <!-- MEW logo -->
            <!-- ================================================================================== -->
            <router-link :to="{ name: ROUTES_WALLET.DASHBOARD.NAME }">
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
          <balance-card />

          <!-- ================================================================================== -->
          <!-- Buy Sell / Send / Swap buttons -->
          <!-- ================================================================================== -->
          <div class="d-flex align-center justify-space-between pt-6 pb-4 mx-2">
            <v-btn
              color="transparent"
              height="65px"
              dark
              depressed
              x-small
              @click="openBuy"
            >
              <div class="text-center" style="min-width: 50px">
                <img
                  src="@/assets/images/icons/menu/icon-menu-buy-sell.svg"
                  alt="Buy or Sell"
                  height="30"
                />
                <div
                  class="whiteAlways--text mew-label text-transform--initial"
                  style="margin-top: 3px"
                >
                  Buy/Sell
                </div>
              </div>
            </v-btn>

            <v-divider vertical></v-divider>

            <v-btn
              color="transparent"
              height="65px"
              dark
              depressed
              x-small
              @click="$router.push({ name: ROUTES_WALLET.SEND_TX.NAME })"
            >
              <div class="text-center" style="min-width: 50px">
                <img
                  src="@/assets/images/icons/menu/icon-menu-send.svg"
                  alt="Send"
                  height="30"
                />
                <div
                  class="whiteAlways--text mew-label text-transform--initial"
                  style="margin-top: 3px"
                >
                  Send
                </div>
              </div>
            </v-btn>

            <v-divider vertical></v-divider>

            <v-btn
              color="transparent"
              height="65px"
              dark
              depressed
              x-small
              :class="[!hasSwap ? 'pointer-event--none' : '']"
              @click="$router.push({ name: ROUTES_WALLET.SWAP.NAME })"
            >
              <div class="text-center" style="min-width: 50px">
                <img
                  src="@/assets/images/icons/menu/icon-menu-swap.svg"
                  alt="Swap"
                  height="30"
                  :class="[!hasSwap ? 'opacity--30' : '']"
                />
                <div
                  :class="[
                    !hasSwap ? 'textMedium--text' : '',
                    'whiteAlways--text mew-label text-transform--initial'
                  ]"
                  style="margin-top: 3px"
                >
                  Swap
                </div>
              </div>
            </v-btn>
          </div>
        </div>
      </template>

      <v-list>
        <v-list-item-group model="menuSelected">
          <template v-for="(item, idx) in sectionOne">
            <v-list-item
              v-if="!item.children && shouldShow(item.route)"
              :key="item + idx + 1"
              :to="item.route"
            >
              <v-list-item-icon class="mx-3">
                <img
                  width="26"
                  height="26"
                  :src="item.icon"
                  :alt="item.title"
                />
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title
                  class="white--text font-weight-regular mew-body"
                  v-text="item.title"
                />
              </v-list-item-content>
              <div
                v-if="item.hasNew"
                class="new-dapp-label white--text mew-label px-1"
              >
                new
              </div>
            </v-list-item>

            <v-list-group
              v-if="item.children"
              :key="item + idx + 2"
              prepend-icon=""
            >
              <template #activator>
                <v-list-item-icon class="mx-3">
                  <img
                    width="26"
                    height="26"
                    :src="item.icon"
                    :alt="item.title"
                  />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    class="white--text font-weight-regular mew-body"
                    v-text="item.title"
                  ></v-list-item-title>
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
                    v-text="child.title"
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </template>
        </v-list-item-group>
      </v-list>

      <v-divider class="my-4 mx-6" />

      <v-list>
        <v-list-item
          v-for="(item, idx) in sectionTwo"
          :key="item + idx"
          dense
          :to="item.route"
          @click="item.fn()"
        >
          <v-list-item-icon class="mx-3">
            <img width="26" height="26" :src="item.icon" :alt="item.title" />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title
              class="white--text mew-body font-weight-regular"
              v-text="item.title"
            />
          </v-list-item-content>
        </v-list-item>
        <div class="mt-3 px-8">
          <div class="matomo-tracking-switch">
            <v-switch
              :input-value="consentToTrack"
              inset
              :label="`Data Tracking ${consentToTrack ? 'On' : 'Off'}`"
              color="primary"
              off-icon="mdi-alert-circle"
              @change="setConsent"
            />
          </div>
          <div class="d-flex align-center justify-space-between">
            <!-- <theme-switch /> -->
            <div class="searchText--text">v{{ version }}</div>
          </div>
        </div>
      </v-list>
    </v-navigation-drawer>
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

        <router-link
          :to="{ name: ROUTES_WALLET.DASHBOARD.NAME }"
          style="line-height: 0"
        >
          <img height="26" src="@/assets/images/icons/logo-mew.svg" />
        </router-link>
        <v-spacer />
        <module-notifications invert-icon />
      </v-row>
    </v-system-bar>
  </div>
</template>

<script>
import AppBtnMenu from '@/core/components/AppBtnMenu';
import ModuleNotifications from '@/modules/notifications/ModuleNotifications';
import background from '@/assets/images/backgrounds/bg-light.jpg';
import dashboard from '@/assets/images/icons/icon-dashboard-enable.png';
// import send from '@/assets/images/icons/icon-send-enable.png';
import nft from '@/assets/images/icons/icon-nft.png';
// import swap from '@/assets/images/icons/icon-swap-enable.png';
import dapp from '@/assets/images/icons/icon-dapp-center-enable.png';
import contract from '@/assets/images/icons/icon-contract-enable.png';
import message from '@/assets/images/icons/icon-message-enable.png';
import settings from '@/assets/images/icons/icon-setting-enable.png';
import logout from '@/assets/images/icons/icon-logout-enable.png';
import BalanceCard from '@/modules/balance/ModuleBalanceCard';
import ModuleSettings from '@/modules/settings/ModuleSettings';
import ModuleMoonPay from '@/modules/moon-pay/ModuleMoonPay';
// import ThemeSwitch from '@/components/theme-switch/ThemeSwitch';
import { EventBus } from '@/core/plugins/eventBus';
import { mapActions, mapGetters, mapState } from 'vuex';
import { ETH, BSC, MATIC } from '@/utils/networks/types';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import dappsMeta from '@/dapps/metainfo-dapps';
import { MOONPAY_EVENT } from '@/modules/moon-pay/helpers';
export default {
  components: {
    AppBtnMenu,
    BalanceCard,
    ModuleSettings,
    ModuleNotifications,
    ModuleMoonPay
  },
  mixins: [handlerAnalytics],
  data() {
    return {
      moonPayOpen: false,
      navOpen: null,
      version: VERSION,
      background: background,
      onSettings: false,
      showLogoutPopup: false,
      sectionTwo: [
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
      ],
      routeNetworks: {
        [ROUTES_WALLET.SWAP.NAME]: [ETH, BSC, MATIC],
        [ROUTES_WALLET.NFT_MANAGER.NAME]: [ETH]
      },
      ROUTES_WALLET: ROUTES_WALLET
    };
  },
  computed: {
    ...mapGetters('global', ['network', 'swapLink', 'isEthNetwork', 'hasSwap']),
    ...mapState('wallet', ['instance']),
    sectionOne() {
      const hasNew = Object.values(dappsMeta).filter(item => {
        const dateToday = new Date();
        const millisecondsInDay = 1000 * 60 * 60 * 24;
        const releaseDate = new Date(item.release);
        const daysFromRelease =
          (dateToday.getTime() - releaseDate.getTime()) / millisecondsInDay;
        if (Math.ceil(daysFromRelease) <= 21) {
          return item;
        }
      });
      return [
        {
          title: this.$t('interface.menu.dashboard'),
          route: { name: ROUTES_WALLET.DASHBOARD.NAME },
          icon: dashboard
        },
        {
          title: this.$t('interface.menu.nft'),
          route: { name: ROUTES_WALLET.NFT_MANAGER.NAME },
          icon: nft
        },
        {
          title: this.$t('interface.menu.dapps'),
          route: { name: ROUTES_WALLET.DAPPS.NAME },
          icon: dapp,
          hasNew: hasNew.length > 0
        },
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
  },
  mounted() {
    if (this.$route.name == ROUTES_WALLET.SETTINGS.NAME) {
      this.openSettings();
    }
    EventBus.$on('openSettings', () => {
      this.openSettings();
    });
    EventBus.$on(MOONPAY_EVENT, () => {
      this.openBuy();
    });
  },
  methods: {
    ...mapActions('wallet', ['removeWallet']),
    openBuy() {
      this.moonPayOpen = true;
    },
    shouldShow(route) {
      if (this.routeNetworks[route.name]) {
        for (const net of this.routeNetworks[route.name]) {
          if (net.name === this.network.type.name) return true;
        }
        return false;
      }
      return true;
    },
    openNavigation() {
      this.navOpen = true;
    },
    openSettings() {
      this.onSettings = true;
    },
    closeSettings() {
      this.onSettings = false;
      this.$router.go(-1);
    },
    onLogout() {
      this.showLogoutPopup = false;
      this.removeWallet();
    },
    toggleLogout() {
      this.showLogoutPopup = !this.showLogoutPopup;
    }
    // openSimplex() {
    //   // eslint-disable-next-line
    //   window.open(`${this.swapLink}`, '_blank');
    // }
  }
};
</script>

<style lang="scss">
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

.v-system-bar .v-icon {
  font-size: 36px !important;
  color: white !important;
}

.wallet-sidemenu {
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
    margin-right: 5px;
    margin-bottom: 10px;

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
  .matomo-tracking-switch {
    .v-label {
      color: var(--v-white-base);
    }
  }

  .opacity--30 {
    opacity: 30%;
  }
}
</style>
