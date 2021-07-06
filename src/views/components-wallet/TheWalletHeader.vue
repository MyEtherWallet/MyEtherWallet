<template>
  <v-app-bar
    elevation="0"
    color="walletBg"
    height="70px"
    class="px-0"
    inset
    app
    absolute
  >
    <v-container
      class="
        d-flex
        align-center
        pt-4
        pb-0
        px-0 px-md-3
        wallet-content-container
      "
      fluid
    >
      <div class="d-flex align-center">
        <img class="ml-2 mr-3" src="@/assets/images/icons/icon-puppy-mew.svg" />
        <div>
          <div class="font-weight-bold">MEWtopia</div>
          <div>
            Getting started on Ethereum? Visit our blog MEWtopia for tips,
            resources and guides.
            <a
              href="https://www.mewtopia.com/tag/getting-started/"
              rel="noopener noreferrer"
              target="_blank"
              >Read...</a
            >
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
        <div class="align-center d-none d-lg-block">
          <notification-overlay />
        </div>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script>
// import mobileStatus from './HeaderMobileStatus';
import notificationOverlay from '@/modules/notifications/ModuleNotifications';
import { mapState } from 'vuex';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';

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
      return this.identifier === WALLET_TYPES.MEW_CONNECT;
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

<style lang="scss"></style>
