<template>
  <v-row class="d-flex align-center py-4 px-1">
    <!-- <div class="d-flex align-center">
      <img class="ml-2 mr-3" src="@/assets/images/icons/icon-puppy-mew.svg" />
      <div>
        <div class="font-weight-bold">MEWtopia</div>
        <div>
          {{ $t('interface.header.desc') }}
          <a
            href="https://www.mewtopia.com/tag/getting-started/"
            rel="noopener noreferrer"
            target="_blank"
            >{{ $t('interface.header.read') }}</a
          >
        </div>
      </div>
    </div> -->
    <v-col
      cols="8"
      no-gutters
      dense
      class="d-flex align-center justify-space-between"
    >
      <div class="d-flex align-center">
        <div class="party-popper-container ml-2 mr-3 d-flex pa-3">
          <img
            src="@/assets/images/icons/icon-party-popper.png"
            width="20px"
            height="20px"
          />
        </div>
        <div class="d-flex align-center">
          <span class="mr-2 textMedium--text font-weight-bold">
            Buy & sell crypto with 0% fees
          </span>
          <span class="mew-label textMedium--text mr-2">Promo ends in:</span>
        </div>
      </div>
      <mew-button title="Buy crypto now" btn-size="medium" />
    </v-col>
    <v-col cols="4" class="ml-auto d-flex align-center justify-end">
      <div class="align-center d-none d-lg-block">
        <notification-overlay />
      </div>
    </v-col>
  </v-row>
</template>

<script>
// import mobileStatus from './HeaderMobileStatus';
import notificationOverlay from '@/modules/notifications/ModuleNotifications';
import { mapState } from 'vuex';
export default {
  components: {
    notificationOverlay
    // mobileStatus
  },
  computed: {
    ...mapState('wallet', ['identifier'])
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

.party-popper-container {
  background-color: var(--v-whiteBackground-base);
  box-shadow: 0px 5px 30px rgba(166, 173, 201, 0.22),
    0px 5px 5px rgba(154, 160, 185, 0.05);
  border-radius: 100px;
}
</style>
