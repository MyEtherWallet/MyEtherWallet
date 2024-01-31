<template>
  <div>
    <div v-if="showBanner" class="banner-container">
      <div class="close-icon pa-2 pa-sm-5" @click="trackClosing">
        <v-icon
          :size="$vuetify.breakpoint.smAndDown ? '16' : '24'"
          class="cursor--pointer"
          color="white"
        >
          mdi-close
        </v-icon>
      </div>
      <img
        src="@/assets/images/backgrounds/staking-popup-banner.png"
        width="100%"
      />
      <div class="banner-text pa-2 pa-sm-5">
        <div>
          <div class="mew-title font-weight-regular white--text override-title">
            Make your crypto make crypto
          </div>
          <div
            class="mew-heading-4 font-weight-regular faded d-none d-sm-block"
          >
            Stake your ETH and get rewarded by Ethereum blockchain.
          </div>
        </div>
        <mew-button
          class="mt-2 mt-sm-5 text-blue"
          title="View Staking Options"
          :btn-size="$vuetify.breakpoint.smAndDown ? 'small' : 'large'"
          @click.native="viewStakingOptions"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { STAKING } from '@/modules/analytics-opt-in/handlers/configs/events.js';

export default {
  mixins: [handlerAnalytics],
  data() {
    return {
      showBanner: true
    };
  },
  methods: {
    viewStakingOptions() {
      this.$router.push({ name: ROUTES_WALLET.STAKE.NAME });
      this.trackStaking(STAKING.DASHBOARD);
    },
    trackClosing() {
      this.showBanner = false;
      this.trackStaking(STAKING.DASHBOARD_CLOSED);
    }
  }
};
</script>

<style lang="scss" scoped>
.text-blue {
  color: #355eec !important;
  background-color: var(--v-white-base) !important;
}

.banner-container {
  position: relative;
}

.close-icon {
  position: absolute;
  top: 0;
  right: 0;
}

.banner-text {
  position: absolute;
  top: 0px;
}

.override-title {
  font-size: calc(12px + 1.25vw) !important;
  line-height: calc(12px + 1.4vw) !important;
}

.faded {
  color: rgba(255, 255, 255, 0.7);
}
</style>
