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
        <div v-if="!promoOver && !isOfflineApp" class="d-flex align-center">
          <div
            class="party-popper-container ml-2 mr-3 d-flex pa-3"
            style="filter: invert(1)"
          >
            <img
              src="@/assets/images/icons/icon-party-popper.png"
              width="20px"
              height="20px"
            />
          </div>
          <div
            class="d-flex flex-column flex-md-row flex-lg-row flex-xl-row align-start align-md-center align-lg-center align-xl-center"
          >
            <div class="d-flex">
              <span class="mr-2 textMedium--text font-weight-bold">
                Buy & sell crypto with 0% fees
              </span>
              <mew-button
                title="Buy crypto"
                btn-size="medium"
                class="d-md-none d-lg-none d-xl-none"
                @click.native="buyCryptoNow"
              />
            </div>
            <div>
              <span
                class="mew-label textMedium--text mr-2 margin-one-off d-none d-md-inline d-lg-inline d-xl-inline"
                >Promo ends in:</span
              >
              <span
                class="font-weight-medium time-container textMedium--text mew-label mr-1 margin-one-off pa-1"
              >
                {{ daysLeft }} {{ dayText }}
              </span>
              <span
                class="font-weight-medium time-container textMedium--text mew-label margin-one-off pa-1"
              >
                {{ hoursLeft }} h
              </span>
            </div>
          </div>
        </div>
        <div
          v-else-if="promoOver && !isOfflineApp && network.type.canBuy"
          class="eth-banner d-flex"
        >
          <div class="mr-5">
            <white-sheet class="pa-3">
              <v-icon color="blackBg"> mdi-bank </v-icon>
            </white-sheet>
          </div>
          <div class="d-flex flex-column align-start">
            <span
              class="font-weight-bold textDark--text"
              style="font-size: 0.95rem"
            >
              You can now buy crypto with low fees
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
              >Enjoy 0.9% fee when you select ‘Bank account’ as payment method.
              <br v-if="ads.length > 0" />
              <span
                class="greenPrimary--text font-weight-bold cursor--pointer"
                @click="buyCryptoNow"
                >Buy crypto now.</span
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
import moment from 'moment';
import { mapGetters, mapState } from 'vuex';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { BUYSELL_EVENT, MOONPAY_OFFER_END } from '@/modules/buy-sell/helpers';
import { EventBus } from '@/core/plugins/eventBus';
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
    ...mapGetters('global', ['network']),
    daysLeft() {
      const eventDate = moment(MOONPAY_OFFER_END);
      const todaysDate = moment();
      return eventDate.diff(todaysDate, 'days');
    },
    hoursLeft() {
      const today = moment();
      const tomorrowsDate = moment().add(1, 'days').startOf('day');
      const duration = moment.duration(tomorrowsDate.diff(today));
      return Math.ceil(duration.asHours());
    },
    dayText() {
      return `day${this.daysLeft > 1 ? 's' : ''}`;
    },
    promoOver() {
      return moment(moment()).isAfter(MOONPAY_OFFER_END);
    },
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
    buyCryptoNow() {
      EventBus.$emit(BUYSELL_EVENT);
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
