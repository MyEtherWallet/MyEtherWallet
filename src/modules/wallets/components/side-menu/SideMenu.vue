<template>
  <div class="basic" style="z-index: 1">
    <div v-if="mobile" class="mew-component--sidemenu-mobile">
      <div
        class="px-4 pt-2 mx-auto d-flex flex-column preset--mobile-max-width"
      >
        <div class="mb-4 d-flex align-center justify-space-between">
          <router-link :to="{ name: 'Dashboard' }">
            <img width="120" src="@/assets/images/icons/logo-mew.png" />
          </router-link>
          <div class="d-flex align-center">
            <div class="mr-n4">
              <mew-wallet-status-popup>
                <v-btn fab icon large>
                  <img
                    class="white-icon"
                    src="@/assets/images/icons/icon-mew-connect.svg"
                  />
                </v-btn>
              </mew-wallet-status-popup>
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
              <v-btn fab icon large>
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
          <wallet-card />
          <mew-button
            has-full-width
            class="buy-eth-button mt-4 mb-6"
            color-theme="white"
            btn-style="outline"
            title="Buy ETH here"
            button-size="large"
            :icon="require('@/assets/images/icons/icon-mastercard-mew.png')"
            icon-type="img"
            icon-align="right"
          />
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
      <mew-button
        class="buy-eth-button mt-4 mb-6"
        color-theme="white"
        btn-style="outline"
        title="Buy ETH here"
        button-size="large"
        :icon="require('@/assets/images/icons/icon-mastercard-mew.png')"
        icon-type="img"
        icon-align="right"
      />
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
import notificationOverlay from '../notifications/Notifications';
import mewWalletStatusPopup from '../mew-wallet-status-popup/MewWalletStatusPopup';
import walletCard from '@/modules/wallets/components/wallet-card/WalletCard';
import accordionMenu from '@/modules/wallets/components/menu/Menu';
import systemMenu from '@/modules/wallets/components/system-menu/SystemMenu';
import themeSwitch from '@/modules/wallets/components/theme-switch/ThemeSwitch';
import version from '@/modules/wallets/components/version/Version';
import divider from '@/modules/wallets/components/divider/Divider';

export default {
  components: {
    notificationOverlay,
    mewWalletStatusPopup,
    walletCard,
    accordionMenu,
    systemMenu,
    themeSwitch,
    version,
    divider
  },
  props: {
    mobile: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return { openNotifications: false };
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

<style lang="scss">
.mew-component--sidemenu {
  .buy-eth-button {
    font-size: 14px !important;
    font-weight: 400 !important;
    padding: 0 25px !important;
    .v-btn__content {
      display: flex;
      justify-content: space-between;
    }
    img {
      height: 20px !important;
    }
  }
}
</style>
