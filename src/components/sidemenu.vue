<template>
  <div class="basic" style="z-index: 1">
    <div v-if="mobile" class="mew-component--sidemenu-mobile">
      <menu-mobile v-model="mobileMenu" />
      <div
        class="px-4 pt-2 mx-auto d-flex flex-column preset--mobile-max-width"
      >
        <div class="mb-4 d-flex align-center justify-space-between">
          <router-link :to="{ name: 'Dashboard' }">
            <img width="120" src="@/assets/images/icons/logo-mew.png" />
          </router-link>
          <div class="d-flex align-center">
            <div class="mr-n4">
              <mobile-status>
                <v-btn fab icon large>
                  <img
                    class="white-icon"
                    src="@/assets/images/icons/icon-mew-connect.svg"
                  />
                </v-btn>
              </mobile-status>
            </div>
            <div class="position--relative mr-n2">
              <notification-overlay
                :open="openNotifications"
                @close="openNotifications = false"
              />
              <v-btn fab icon large @click="openNotifications = true">
                <img
                  class="white-icon"
                  src="@/assets/images/icons/icon-notifications.svg"
                />
              </v-btn>
              <div
                class="font-weight-bold notification-count cursor--pointer d-flex align-center justify-center white--text error lighten2"
                @click="openNotifications = true"
              >
                3
              </div>
            </div>
            <div class="mr-n3">
              <v-btn fab icon large @click="mobileMenu = true">
                <v-icon color="white" large>mdi-menu</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
        <v-sheet
          width="100%"
          max-width="280px"
          color="transparent"
          class="mx-auto"
        >
          <mew-tools v-model="mewTools" />
          <v-btn
            v-if="mobile"
            class="full-width text-transform--initial mb-4"
            outlined
            color="white"
            large
            @click="mewTools = true"
          >
            <v-icon class="mr-2">mdi-apps</v-icon>
            MEW tools
            <v-icon class="ml-2">mdi-chevron-down</v-icon>
          </v-btn>

          <wallet-card />
          <v-btn
            class="mb-4 full-width text-transform--initial mt-4 mb-6"
            outlined
            color="white"
            large
          >
            Buy ETH here
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
              class="ml-1"
            />
          </v-btn>
        </v-sheet>
      </div>
    </div>

    <v-sheet
      v-else
      color="transparent"
      class="mew-component--sidemenu px-4 pb-7 pt-10 d-flex flex-column"
    >
      <div class="mb-4">
        <router-link :to="{ name: 'Dashboard' }">
          <img width="120" src="@/assets/images/icons/logo-mew.png" />
        </router-link>
      </div>
      <wallet-card />
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
      <accordion-menu class="mt-4" />
      <divider class="my-5 mx-1" />
      <system-menu />
      <divider class="my-5 mx-1" />
      <theme-switch class="px-5" />
      <version class="px-5" />
    </v-sheet>
  </div>
</template>

<script>
import notificationOverlay from '@/modules/notifications/ModuleNotifications';
import mobileStatus from './HeaderMobileStatus';
import walletCard from '@/modules/balance/ModuleBalance';
import systemMenu from './system-menu/SystemMenu';
// need to refactor sidemenu - can probably remove these components
import accordionMenu from '@/components/menu/Menu';
import menuMobile from '@/components/menu-mobile/Menu';
import themeSwitch from '@/components/theme-switch/ThemeSwitch';
import version from '@/components/version/Version';
import divider from '@/components/divider/Divider';
import mewTools from '@/components/mewTools/MewTools';

export default {
  components: {
    menuMobile,
    notificationOverlay,
    mobileStatus,
    walletCard,
    accordionMenu,
    systemMenu,
    themeSwitch,
    version,
    divider,
    mewTools
  },
  props: {
    mobile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { mewTools: false, openNotifications: false, mobileMenu: false };
  }
};
</script>

<style lang="scss" scoped>
.mew-component--sidemenu {
  background-image: url('~@/assets/images/backgrounds/bg-light.jpg');
  background-position: -336px 0px;
  background-size: 663px;
  position: relative;
  width: 300px;
  min-height: 100vh;
}
.mew-component--sidemenu-mobile {
  background-image: url('~@/assets/images/backgrounds/bg-light.jpg');
  background-position: top right;
  background-size: 220%;
  position: relative;
  width: 100%;
}

.notification-count {
  position: absolute;
  top: 15px;
  right: 6px;
  border-radius: 100%;
  width: 18px;
  height: 18px;
  font-size: 12px;
  pointer-events: none;
}

.white-icon {
  filter: grayscale(1) brightness(5);
}
</style>
