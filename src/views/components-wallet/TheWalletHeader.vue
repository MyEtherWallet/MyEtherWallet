<template>
  <v-container class="the-wallet-header">
    <v-row class="d-flex align-center py-2 pb-md-4 pb-lg-2 px-1">
      <v-col
        cols="12"
        :md="hasAds ? '6' : '8'"
        :lg="hasAds ? '6' : '8'"
        no-gutters
        dense
        :class="[
          $vuetify.breakpoint.md ||
          $vuetify.breakpoint.lg ||
          $vuetify.breakpoint.xl
            ? 'set-fixed-height'
            : '',
          'd-flex align-center justify-space-between'
        ]"
      >
        <div
          v-if="
            !isOfflineApp &&
            (network.type.chainID === 1 || network.type.chainID === 5)
          "
          class="eth-banner d-flex"
        >
          <div class="mr-5">
            <div class="pa-2 d-flex align-center">
              <img
                src="@/assets/images/icons/dapps/icon-dapp-coinbase.svg"
                width="30"
                height="30"
              />
              <!-- <v-icon color="blackBg"> mdi-bank </v-icon> -->
            </div>
          </div>
          <div class="d-flex flex-column align-start">
            <span
              class="font-weight-bold textDark--text"
              style="font-size: 0.95rem"
            >
              <b>NEW: Stake any amount of ETH powered by Coinbase</b>
            </span>
            <span
              :class="[
                $vuetify.breakpoint.md ||
                $vuetify.breakpoint.lg ||
                $vuetify.breakpoint.xl
                  ? ''
                  : 'py-2',
                'mew-body textMedium--text'
              ]"
              >Stake ETH with no minimums and start earning up to 4% APR right
              away; unstake at any time.
              <br v-if="ads.length > 0" />
              <span
                class="greenPrimary--text font-weight-bold cursor--pointer"
                @click="stakeNow"
                >Stake now</span
              >
            </span>
          </div>
        </div>
      </v-col>
      <v-col
        v-if="
          $vuetify.breakpoint.md ||
          $vuetify.breakpoint.lg ||
          $vuetify.breakpoint.xl
        "
        :cols="ads.length >= 1 ? '6' : '4'"
        class="ml-auto d-flex align-center justify-end"
      >
        <div v-if="hasAds" class="d-flex justify-space-between">
          <v-menu
            v-for="(ad, idx) in ads"
            :key="ad.buttonIcon + `${idx}`"
            open-on-hover
            :close-on-content-click="true"
            close-delay="500"
            offset-y
            nudge-top="-10"
            nudge-left="200"
            content-class="img-holder"
          >
            <template #activator="{ on, attrs }">
              <div
                class="d-flex align-center justify-center white--text mr-3 cursor--pointer ad-button-template"
                v-bind="attrs"
                :style="ad.buttonGradient"
                v-on="on"
              >
                <img
                  :src="`https://img.mewapi.io/?image=${ad.buttonIcon}`"
                  height="40"
                  width="40"
                />
                <span :style="ad.titleColor"> {{ ad.buttonTitle }} </span>
              </div>
            </template>
            <a
              :href="ad.popoverLink"
              target="_blank"
              @click="buttonTracking(ad.adName)"
            >
              <img
                :src="`https://img.mewapi.io/?image=${ad.popoverImg}`"
                width="300"
              />
            </a>
          </v-menu>
        </div>
        <a
          v-if="ads.length < 3"
          class="ad-button-template prototype-background d-flex align-center justify-center white--text mr-3"
          href="https://www.myetherwallet.com/advertise-with-us"
          target="_blank"
          rel="noopener noreferrer"
          @click="buttonTracking('AdvertiseWithUs')"
        >
          <span> Advertise With Us </span>
        </a>
        <div class="align-center d-none d-lg-block">
          <notification-overlay
            v-if="online"
            :invert-icon="$vuetify.theme.dark"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { STAKING } from '@/modules/analytics-opt-in/handlers/configs/events.js';
// import { BUYSELL_EVENT } from '@/modules/buy-sell/helpers';
// import { EventBus } from '@/core/plugins/eventBus';
import { COINBASE_STAKING_ROUTES } from '@/dapps/coinbase-staking/configs';
export default {
  components: {
    notificationOverlay: () =>
      import('@/modules/notifications/ModuleNotifications')
  },
  mixins: [handlerAnalytics],
  data() {
    return {
      ads: []
    };
  },
  computed: {
    ...mapState('wallet', ['identifier', 'isOfflineApp']),
    ...mapState('global', ['online']),
    ...mapGetters('global', ['network', 'isEthNetwork']),
    hasAds() {
      return this.ads.length > 0;
    }
  },
  mounted() {
    this.setHeaderAds();
  },
  methods: {
    async setHeaderAds() {
      const res = await fetch('https://partners.mewapi.io/ads-web');
      const ads = await res.json();
      this.ads = ads;
    },
    // buyCryptoNow() {
    //   EventBus.$emit(BUYSELL_EVENT);
    // },
    stakeNow() {
      this.$router.push({
        name: COINBASE_STAKING_ROUTES.STAKE.NAME
      });
      this.trackStaking(STAKING.HEADER_NOW);
    },
    buttonTracking(name) {
      this.trackAd(name);
    }
  }
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: var(--v-greenPrimary-base) !important;
  font-weight: 500;
}

.mew-connect-text > div {
  font-size: 12px;
  line-height: 15px;
  font-weight: 500;
  color: var(--v-greenPrimary-base);
}

.party-popper-container {
  background-color: var(--v-whiteBg-base);
  box-shadow: 0px 5px 30px rgba(166, 173, 201, 0.22),
    0px 5px 5px rgba(154, 160, 185, 0.05);
  border-radius: 100px;
}

.time-container {
  background-color: var(--v-blueMedium-base);
  border-radius: 4px;
}

.margin-one-off {
  margin-top: 2px;
}

.set-fixed-height {
  height: 52px;
}

.eth-banner {
  margin-left: -15px;
}

.ad-button-template {
  border-radius: 12px;
  height: 48px;
  min-width: 130px;
  padding: 0 15px;

  img {
    padding: 7px;
  }
}

.img-holder {
  background-color: white;
  border: 1px #99a1b3 solid;
  border-radius: 12px;
}
</style>
