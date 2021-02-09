<template>
  <div>
    <v-navigation-drawer
      app
      class="wallet-sidemenu"
      permanent
      :src="background"
      width="300"
      :dark="$vuetify.theme.dark"
    >
      <template #prepend>
        <div class="pa-5">
          <div class="my-4">
            <router-link :to="{ name: 'Dashboard' }">
              <img width="120" src="@/assets/images/icons/logo-mew.png" />
            </router-link>
          </div>
          <balance-card />
          <mew-super-button
            font-class="mew-body"
            class="mt-4"
            title="Buy ETH here"
            color-theme="outline"
            style="height: 46px"
          >
            <!-- going to change slot name -->
            <template #contentSlot>
              <img
                src="@/assets/images/icons/icon-mastercard-mew.png"
                alt="Master card"
                height="16"
                class="ml-3"
              />
              <img
                src="@/assets/images/icons/icon-visa-white.png"
                alt="Master card"
                height="11"
                class="mx-3"
              />
            </template>
          </mew-super-button>
        </div>
      </template>
      <v-list>
        <div v-for="(item, idx) in sectionOne" :key="item + idx">
          <v-list-item v-if="!item.children" dense :to="item.route">
            <v-list-item-icon class="mx-3">
              <img width="26" height="26" :src="item.icon" :alt="item.title" />
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title
                class="white--text font-weight-regular mew-body"
                v-text="item.title"
              />
            </v-list-item-content>
          </v-list-item>
          <v-list-group v-if="item.children" prepend-icon="">
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
        </div>
      </v-list>
      <v-divider />
      <v-list>
        <v-list-item
          v-for="(item, idx) in sectionTwo"
          :key="item + idx"
          dense
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
      </v-list>
      <template #append>
        <div class="px-10 d-flex align-center justify-space-between">
          <theme-switch />
          <div class="searchText--text">v{{ version }}</div>
        </div>
      </template>
    </v-navigation-drawer>
    <mew-popup
      :is-open="showLogoutPopup"
      :title="$t('interface.menu.logout')"
      :button-left="logout.btnLeft"
      :button-right="logout.btnRight"
      popup-type="confirm"
      @onClick="onLogout"
    ></mew-popup>
    <module-settings
      :on-settings="onSettings"
      @closeSettings="toggleSettings"
    />
  </div>
</template>

<script>
import background from '@/assets/images/backgrounds/bg-light.jpg';
import dashboard from '@/assets/images/icons/icon-dashboard-enable.png';
import send from '@/assets/images/icons/icon-send-enable.png';
import swap from '@/assets/images/icons/icon-swap-enable.png';
import dapp from '@/assets/images/icons/icon-dapp-center-enable.png';
import tools from '@/assets/images/icons/icon-contract-enable.png';
import settings from '@/assets/images/icons/icon-setting-enable.png';
import logout from '@/assets/images/icons/icon-logout-enable.png';
import BalanceCard from '@/modules/balance/ModuleBalanceCard';
import ModuleSettings from '@/modules/settings/ModuleSettings';
import ThemeSwitch from '@/components/theme-switch/ThemeSwitch';

export default {
  components: {
    BalanceCard,
    ModuleSettings,
    ThemeSwitch
  },
  data() {
    return {
      version: process.env.VERSION,
      background: background,
      onSettings: false,
      showLogoutPopup: false,
      logout: {
        btnLeft: {
          title: 'Cancel',
          colorTheme: 'basic'
        },
        btnRight: {
          title: 'Log out',
          colorTheme: 'error'
        }
      },
      sectionOne: [
        {
          title: this.$t('interface.menu.dashboard'),
          route: { name: 'Dashboard' },
          icon: dashboard
        },
        {
          title: this.$t('interface.menu.send'),
          icon: send,
          children: [
            { title: this.$t('sendTx.send-tx'), route: { name: 'SendTX' } },
            {
              title: this.$t('interface.menu.nft'),
              route: { name: 'NFTManager' }
            }
          ]
        },
        {
          title: this.$t('common.swap'),
          route: { name: 'Swap' },
          icon: swap
        },
        {
          title: this.$t('interface.menu.dapps-center'),
          route: { name: 'Dapps' },
          icon: dapp
        },
        {
          title: this.$t('interface.menu.tools'),
          icon: tools,
          children: [
            {
              title: this.$t('interface.menu.interact-contract'),
              route: { name: 'InteractWithContract' }
            },
            {
              title: this.$t('interface.menu.deploy'),
              route: { name: 'DeployContract' }
            },
            {
              title: this.$t('interface.menu.sign-message'),
              route: { name: 'SignMessage' }
            }
          ]
        }
      ],
      sectionTwo: [
        {
          title: this.$t('common.settings'),
          icon: settings,
          fn: this.toggleSettings
        },
        {
          title: this.$t('common.logout'),
          icon: logout,
          fn: this.toggleLogout
        }
      ]
    };
  },
  methods: {
    toggleSettings() {
      this.onSettings = !this.onSettings;
    },
    onLogout(res) {
      this.showLogoutPopup = false;
      if (res.title === this.logout.btnRight.title) {
        this.$router.push({ name: 'Home' });
      }
    },
    toggleLogout() {
      this.showLogoutPopup = !this.showLogoutPopup;
    }
  }
};
</script>
<style lang="scss">
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
    border-color: var(--v-white-base) !important;
  }
}
</style>
