<template>
  <v-app-bar class="pl-6" elevation="0" color="walletBg" app>
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
      <!-- <div class="mr-4">
        <mobile-status v-if="isMewConnect">
          <div v-if="isMewConnect" class="d-flex align-center cursor--pointer">
            <img src="@/assets/images/icons/icon-mew-connect.svg" />
            <div class="mew-connect-text ml-1">
              <div>MEWconnect</div>
              <div>Connected...</div>
            </div>
          </div>
        </mobile-status>
      </div> -->
      <div class="d-flex align-center">
        <notification-overlay />
      </div>
    </div>
  </v-app-bar>
</template>

<script>
// import mobileStatus from './HeaderMobileStatus';
import notificationOverlay from '@/modules/notifications/ModuleNotifications';
import { mapState } from 'vuex';
import { MEW_CONNECT } from '@/modules/wallets/utils/bip44/walletTypes';

export default {
  components: {
    notificationOverlay
    // mobileStatus
  },
  props: {
    mobile: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('wallet', ['identifier']),
    isMewConnect() {
      return this.identifier === MEW_CONNECT;
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

.mew-connect-text > div {
  font-size: 12px;
  line-height: 15px;
  font-weight: 500;
  color: var(--v-primary-base);
}
</style>
