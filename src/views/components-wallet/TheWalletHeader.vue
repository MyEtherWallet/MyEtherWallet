<template>
  <v-row class="d-flex align-center py-2 pb-md-4 pb-lg-2 px-1">
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
      cols="12"
      md="8"
      lg="8"
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
      <div v-if="!promoOver" class="d-flex align-center">
        <div class="party-popper-container ml-2 mr-3 d-flex pa-3">
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
      <div v-else class="d-flex align-center">
        <div class="mr-5">
          <v-icon color="black"> mdi-bank </v-icon>
        </div>
        <div class="d-flex flex-column align-start">
          <span class="mew-body font-weight-bold textDark--text"
            >You can now Buy crypto with low fees</span
          >
          <span
            :class="[
              $vuetify.breakpoint.md ||
              $vuetify.breakpoint.lg ||
              $vuetify.breakpoint.xl
                ? ''
                : 'py-2',
              'mew-body textMedium--text'
            ]"
            >Enjoy 0.9% fee when you select ‘Bank account’ as payment
            method.</span
          >
          <mew-button
            title="Buy crypto"
            btn-size="medium"
            class="d-md-none d-lg-none d-xl-none"
            @click.native="buyCryptoNow"
          />
        </div>
      </div>
      <!-- Hide this button when screen is smaller -->
      <mew-button
        title="Buy crypto now"
        btn-size="medium"
        class="d-none d-md-inline-flex d-lg-inline-flex d-xl-inline-flex"
        @click.native="buyCryptoNow"
      />
    </v-col>
    <v-col
      v-if="
        $vuetify.breakpoint.md ||
        $vuetify.breakpoint.lg ||
        $vuetify.breakpoint.xl
      "
      cols="4"
      class="ml-auto d-flex align-center justify-end"
    >
      <div class="align-center d-none d-lg-block">
        <notification-overlay />
      </div>
    </v-col>
  </v-row>
</template>

<script>
// import mobileStatus from './HeaderMobileStatus';
import notificationOverlay from '@/modules/notifications/ModuleNotifications';
import moment from 'moment';
import { mapState } from 'vuex';
import { MOONPAY_EVENT, MOONPAY_OFFER_END } from '@/modules/moon-pay/helpers';
import { EventBus } from '@/core/plugins/eventBus';
export default {
  components: {
    notificationOverlay
    // mobileStatus
  },
  computed: {
    ...mapState('wallet', ['identifier']),
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
    }
  },
  methods: {
    buyCryptoNow() {
      EventBus.$emit(MOONPAY_EVENT);
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
  background-color: var(--v-whiteBackground-base);
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
</style>
