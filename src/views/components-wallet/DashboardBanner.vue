<template>
  <div class="banner-container">
    <div class="close-icon" @click="trackClosing">
      <v-icon size="24" class="cursor--pointer" color="white">
        mdi-close
      </v-icon>
    </div>
    <img
      src="@/assets/images/backgrounds/staking-popup-banner.png"
      width="100%"
    />
    <div class="banner-text">
      <div>
        <div class="mew-title font-weight-regular white--text override-title">
          Make your crypto make crypto
        </div>
        <div class="mew-heading-4 font-weight-regular faded d-none d-sm-block">
          Stake your ETH and get rewarded by Ethereum blockchain.
        </div>
      </div>
      <mew-button
        class="mt-2 mt-sm-5 text-blue"
        title="View Staking Options"
        btn-size="large"
        color-theme="white"
        @click.native="viewStakingOptions"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { STAKING } from '@/modules/analytics-opt-in/handlers/configs/events.js';

export default {
  mixins: [handlerAnalytics],
  methods: {
    ...mapActions('popups', ['closeDashboardBanner']),
    viewStakingOptions() {
      this.$router.push({ name: ROUTES_WALLET.STAKE.NAME });
      this.trackStaking(STAKING.DASHBOARD);
    },
    trackClosing() {
      this.closeDashboardBanner();
      this.trackStaking(STAKING.DASHBOARD_CLOSED);
    }
  }
};
</script>

<style lang="scss" scoped>
.text-blue {
  color: #355eec !important;
}

.banner-container {
  position: relative;
}

.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
}

.banner-text {
  position: absolute;
  top: 20px;
  left: 20px;
}

.override-title {
  font-size: calc(12px + 1.25vw) !important;
  line-height: calc(12px + 1.4vw) !important;
}

.faded {
  color: rgba(255, 255, 255, 0.7);
}
</style>
