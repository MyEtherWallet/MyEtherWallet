<template>
  <div>
    <div v-if="!showIsAdBanner">
      <div v-if="locShowBanner && showBanner" class="banner-container">
        <div class="close-icon pa-2 pa-sm-2" @click="trackClosing">
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
            <div
              class="mew-title font-weight-regular white--text override-title"
            >
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
            color-theme="white"
            @click.native="viewStakingOptions"
          />
        </div>
      </div>
    </div>
    <div v-else class="pb-3">
      <a
        v-if="adLink.href"
        :href="adLink.href"
        target="_blank"
        @click="trackAdClick"
      >
        <img :src="adBanner" width="100%" />
      </a>
      <router-link v-else :to="adLink" @click="trackAdClick">
        <img :src="adBanner" width="100%" />
      </router-link>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import 'moment-timezone';
import { mapState } from 'vuex';

import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { STAKING } from '@/modules/analytics-opt-in/handlers/configs/events.js';

export default {
  mixins: [handlerAnalytics],
  props: {
    showBanner: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      locShowBanner: true
    };
  },
  computed: {
    ...mapState('wallet', ['identifier', 'isHardware']),
    ...mapState('external', ['selectedEIP6963Info']),
    showIsAdBanner() {
      const testTime = '2024-10-03';
      const startDate = new Date(testTime);
      const endDate = new Date('2024-12-16');
      const isBetween = moment(new Date(testTime)).isBetween(
        startDate,
        endDate,
        undefined,
        '[]'
      );
      return isBetween;
    },
    adBanner() {
      const testTime = '2024-10-03';
      const week = moment(new Date(testTime)).week();
      switch (week) {
        case 41:
          return require('@/assets/images/ad/Topper1.png');
        case 42:
          return require('@/assets/images/ad/CoinbaseOnramp1.png');
        case 43:
          return require('@/assets/images/ad/MoonPay1.png');
        case 44:
          return require('@/assets/images/ad/Simplex1.png');
        case 45:
          return require('@/assets/images/ad/Coinbase1.png');
        case 46:
          return require('@/assets/images/ad/Topper2.png');
        case 47:
          return require('@/assets/images/ad/CoinbaseOnramp2.png');
        case 48:
          return require('@/assets/images/ad/MoonPay2.png');
        case 49:
          return require('@/assets/images/ad/Simplex2.png');
        case 50:
          return require('@/assets/images/ad/Coinbase2.png');
        default:
          return require('@/assets/images/ad/Topper1.png');
      }
    },
    adLink() {
      return this.adBanner.includes('Topper') ||
        this.adBanner.includes('CoinbaseOnramp') ||
        this.adBanner.includes('MoonPay') ||
        this.adBanner.includes('Simplex')
        ? { href: 'https://ccswap.myetherwallet.com/' }
        : { name: ROUTES_WALLET.STAKE.NAME };
    }
  },
  methods: {
    trackAdClick() {
      this.$amplitude.track('BrowserAdTracking', {
        adName: this.adBanner
      });
    },
    viewStakingOptions() {
      this.$router.push({ name: ROUTES_WALLET.STAKE.NAME });
      this.trackStaking(STAKING.DASHBOARD);
    },
    trackClosing() {
      this.locShowBanner = false;
      this.trackStaking(STAKING.DASHBOARD_CLOSED);
    }
  }
};
</script>

<style lang="scss">
.text-blue {
  color: #355eec !important;
  span {
    color: #355eec !important;
  }
}
</style>

<style lang="scss" scoped>
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
