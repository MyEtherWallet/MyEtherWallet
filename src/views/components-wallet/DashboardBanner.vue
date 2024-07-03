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
      <a :href="adLink" target="_blank">
        <img :src="adBanner" width="100%" />
      </a>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import 'moment-timezone';
import { mapState } from 'vuex';
import store from 'store';

import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { STAKING } from '@/modules/analytics-opt-in/handlers/configs/events.js';

import EnkrAd1A from '@/assets/images/ad/EnkrAd1A.png';
import EnkrAd1B from '@/assets/images/ad/EnkrAd1B.png';
import EnkrAd2A from '@/assets/images/ad/EnkrAd2A.png';
import EnkrAd2B from '@/assets/images/ad/EnkrAd2B.png';
import EnkrAd3A from '@/assets/images/ad/EnkrAd3A.png';
import EnkrAd3B from '@/assets/images/ad/EnkrAd3B.png';
import EnkrAd4A from '@/assets/images/ad/EnkrAd4A.png';
import EnkrAd4B from '@/assets/images/ad/EnkrAd4B.png';
import EnkrAd5A from '@/assets/images/ad/EnkrAd5A.png';
import EnkrAd5B from '@/assets/images/ad/EnkrAd5B.png';
import MEWAd1A from '@/assets/images/ad/MEWAd1A.png';
import MEWAd1B from '@/assets/images/ad/MEWAd1B.png';
import MEWAd2A from '@/assets/images/ad/MEWAd2A.png';
import MEWAd2B from '@/assets/images/ad/MEWAd2B.png';
import MEWAd3A from '@/assets/images/ad/MEWAd3A.png';
import MEWAd3B from '@/assets/images/ad/MEWAd3B.png';
import MEWAd4A from '@/assets/images/ad/MEWAd4A.png';
import MEWAd4B from '@/assets/images/ad/MEWAd4B.png';
import MEWAd5A from '@/assets/images/ad/MEWAd5A.png';
import MEWAd5B from '@/assets/images/ad/MEWAd5B.png';

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
      locShowBanner: true,
      testDate: new Date('2024-07-11')
    };
  },
  computed: {
    ...mapState('wallet', ['identifier', 'isHardware']),
    ...mapState('external', ['selectedEIP6963Info']),
    showIsAdBanner() {
      const startDate = new Date('2024-07-11');
      const endDate = new Date('2024-09-19');
      const isBetween = moment(new Date()).isBetween(startDate, endDate);
      return isBetween;
    },
    isEnkrypt() {
      return (
        this.identifier === WALLET_TYPES.WEB3_WALLET &&
        this.selectedEIP6963Info &&
        this.selectedEIP6963Info.name === 'Enkrypt'
      );
    },
    pdtToday() {
      const rightNow = moment(new Date());
      const pdt = rightNow.tz('America/Los_Angeles');
      const date = pdt.day();
      return date;
    },
    adVersion() {
      return this.pdtToday % 2 === 0;
    },
    hardwareBanner() {
      const ads = [MEWAd4A, EnkrAd4A, MEWAd4B, EnkrAd4B];
      return ads[this.pdtToday % ads.length];
    },
    softwareBanner() {
      const ads = [MEWAd5A, EnkrAd5A, MEWAd5B, EnkrAd5B];
      return ads[this.pdtToday % ads.length];
    },
    otherMobileBanner() {
      const ads = [MEWAd3A, EnkrAd3A, MEWAd3B, EnkrAd3B];
      return ads[this.pdtToday % ads.length];
    },
    otherBrowserBanner() {
      const ads = [MEWAd1A, EnkrAd1A, MEWAd1B, EnkrAd1B];
      return ads[this.pdtToday % ads.length];
    },
    enkryptBanner() {
      return this.adVersion ? MEWAd2A : MEWAd2B;
    },
    mewWalletBanner() {
      return this.adVersion ? EnkrAd2A : EnkrAd2B;
    },
    adBanner() {
      if (this.isHardware) {
        // hardware
        return this.hardwareBanner;
      } else if (
        // browser wallet and not enkrypt
        this.identifier === WALLET_TYPES.WEB3_WALLET &&
        !this.isEnkrypt
      ) {
        return this.otherBrowserBanner;
      } else if (this.identifier === WALLET_TYPES.MEW_WALLET) {
        // mew wallet
        return this.mewWalletBanner;
      } else if (
        this.identifier === WALLET_TYPES.WALLET_CONNECT ||
        this.identifier === WALLET_TYPES.WALLET_LINK
      ) {
        // mobile wallet not mew wallet
        return this.otherMobileBanner;
      } else if (this.isEnkrypt) {
        // enkrypt
        return this.enkryptBanner;
      }
      // software
      return this.softwareBanner;
    },
    adLink() {
      return this.adBanner.includes('Enkr')
        ? 'https://www.enkrypt.com'
        : 'https://download.mewwallet.com/?source=mew_web_create';
    }
  },
  mounted() {
    this.testDate = store.get('mew-test-date') || new Date('2024-07-11');
  },
  methods: {
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
