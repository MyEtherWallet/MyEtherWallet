<template>
  <div class="d-flex align-center pt-4 pb-4 px-4">
    <div class="d-flex align-center">
      <img class="mr-3" src="@/assets/images/icons/icon-puppy-mew.svg" />
      <div>
        <div class="font-weight-bold">MEWtopia</div>
        <div>
          Find out what Crypto Wallets is and learn to use MEW securly by using
          many different mobile wallets.
          <a href="#">Read...</a>
        </div>
      </div>
    </div>
    <div class="ml-auto d-flex align-center">
      <div class="mr-4">
        <mew-wallet-status>
          <div class="d-flex align-center cursor--pointer">
            <img src="@/assets/images/icons/icon-mew-connect.svg" />
            <div class="mew-connect-text ml-1">
              <div>MEWconnect</div>
              <div>Connected...</div>
            </div>
          </div>
        </mew-wallet-status>
      </div>
      <div class="position--relative">
        <notification-overlay
          :open="openNotifications"
          :close="closeNotifications"
        />
        <v-btn icon @click="openNotifications = true">
          <img src="@/assets/images/icons/icon-notifications.svg" />
        </v-btn>
        <div
          class="notification-count cursor--pointer d-flex align-center justify-center white--text error lighten2"
          @click="openNotifications = true"
        >
          3
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mewWalletStatus from '@/modules/wallets/components/popups/mew-wallet-status';
import notificationOverlay from './components/notifications';

export default {
  components: {
    notificationOverlay,
    mewWalletStatus
  },
  data: () => {
    return { openNotifications: false };
  },
  methods: {
    closeNotifications() {
      this.openNotifications = false;
    }
  }
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: var(--v-primary-base) !important;
  font-weight: 500;
}

.notification-count {
  position: absolute;
  top: 0;
  right: -10px;
  border-radius: 100%;
  width: 18px;
  height: 18px;
  font-size: 12px;
}
</style>
