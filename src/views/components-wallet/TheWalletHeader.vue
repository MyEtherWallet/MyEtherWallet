<template>
  <v-app-bar app elevation="0" color="walletBg" height="70px">
    <v-container class="d-flex align-center pt-4 pb-0" fluid>
      <div class="d-flex align-center">
        <img class="ml-2 mr-3" src="@/assets/images/icons/icon-puppy-mew.svg" />
        <div>
          <div class="font-weight-bold">MEWtopia</div>
          <div>
            Find out what Crypto Wallets is and learn to use MEW securly by
            using many different mobile wallets.
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
    </v-container>
    <notification-overlay
      :open="openNotifications"
      @close="openNotifications = false"
    />
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
  data() {
    return { openNotifications: false };
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

.notification-count {
  top: 0;
  border-radius: 100%;
  margin-bottom: 20px;
  margin-left: -10px;
  width: 18px;
  height: 18px;
  font-size: 12px;
}

.mew-connect-text > div {
  font-size: 12px;
  line-height: 15px;
  font-weight: 500;
  color: var(--v-primary-base);
}
</style>

<style lang="scss"></style>
