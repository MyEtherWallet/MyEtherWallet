<template>
  <app-modal
    width="395"
    :show="showWalletPromo"
    title="Buy crypto with 0% fees"
    has-body-content
    :has-buttons="false"
    :has-close-button="false"
  >
    <template #dialogBody>
      <div class="d-flex align-center justify-center my-5">
        <img
          src="@/assets/images/icons/icon-party-popper.png"
          width="78px"
          height="78px"
        />
      </div>
      <div class="text-center mew-body textMedium--text">
        MEW has joined with <u>Moonpay</u> to offer more crypto buying and
        selling options. Help us celebrate with zero fees when you buy and sell
        crypto this week.
      </div>
      <mew-button
        class="mt-8"
        title="Buy Crypto"
        has-full-width
        btn-size="xlarge"
        @click.native="goToPromo()"
      />
      <v-row class="mt-5 d-flex justify-center" no-gutters dense>
        <v-col class="d-flex align-center" cols="4">
          <img src="@/assets/images/icons/icon-visa.svg" class="mr-5" />
          <img src="@/assets/images/icons/icon-mastercard.svg" class="mr-5" />
          <img src="@/assets/images/icons/icon-bank.svg" />
        </v-col>
      </v-row>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/core/components/AppModal';
import { mapActions, mapState } from 'vuex';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { EventBus } from '@/core/plugins/eventBus';
import { MOONPAY_EVENT } from '@/modules/moon-pay/helpers';

export default {
  name: 'TheWalletPopupPromo',
  components: { AppModal },
  mixins: [handlerAnalytics],
  data() {
    return {};
  },
  computed: {
    ...mapState('global', ['showWalletPromo'])
  },
  methods: {
    ...mapActions('global', ['neverShowPromo']),
    /**
     * Hides promo popup forever
     */
    setHidePopUp() {
      this.neverShowPromo();
    },

    /**
     * Hides promo popup forever and navigates to the promo link.
     * Edit this function to route to new link
     */
    goToPromo() {
      this.setHidePopUp();
      this.trackDapp('moonPayPromo');
      EventBus.$emit(MOONPAY_EVENT);
    }
  }
};
</script>
<style lang="scss" scoped>
.icon-container {
  box-shadow: inset 0px 0px 2px rgba(0, 0, 0, 0.16);
  border-radius: 40px;
}
</style>
