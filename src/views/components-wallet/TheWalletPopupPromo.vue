<template>
  <app-modal
    width="395"
    :show="showPromo"
    :title="title"
    has-body-content
    :has-buttons="false"
    :has-close-button="false"
    :close="setHidePopUp"
  >
    <template #dialogBody>
      <div v-if="!isPromoOver">
        <div class="d-flex align-center justify-center my-5">
          <img
            src="@/assets/images/icons/icon-party-popper.png"
            width="78px"
            height="78px"
          />
        </div>
        <div class="text-center mew-body textMedium--text">
          MEW has joined with
          <a
            class="textMedium--text"
            href="https://www.moonpay.com/buy"
            target="_blank"
            ><u>Moonpay</u></a
          >
          to offer more crypto buying and selling options. Help us celebrate
          with zero fees when you buy and sell crypto this week.
        </div>
      </div>
      <div v-else>
        <div class="text-center mew-body textMedium--text">
          Enjoy 0.9% fee wen you select ‘Bank account’ as payment method.
        </div>
        <div class="d-flex justify-center align-center pa-5 mt-5">
          <div class="icon-container mr-2 d-flex align-center pa-2">
            <img
              src="https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/ETH-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg"
              width="34px"
              height="34px"
            />
          </div>
          <div
            v-for="icon in tokenIcons"
            :key="icon"
            class="icon-container mr-2 d-flex align-center"
          >
            <img :src="icon" width="50px" height="50px" />
          </div>
        </div>
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
import { MOONPAY_EVENT, MOONPAY_OFFER_END } from '@/modules/moon-pay/helpers';
import moment from 'moment';

export default {
  name: 'TheWalletPopupPromo',
  components: { AppModal },
  mixins: [handlerAnalytics],
  data() {
    return {
      tokenIcons: [
        'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/USDT-0xdAC17F958D2ee523a2206206994597C13D831ec7-eth.png',
        'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/USDC-0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48-eth.svg',
        'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/MATIC-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-matic.png',
        'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/BNB-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png'
      ]
    };
  },
  computed: {
    ...mapState('global', ['showWalletPromo', 'promoOver']),
    isPromoOver() {
      return moment(moment()).isAfter(MOONPAY_OFFER_END);
    },
    title() {
      return this.isPromoOver
        ? 'You can now Buy and Sell crypto with low fees'
        : 'Buy crypto with 0% fees';
    },
    showPromo() {
      if (this.showWalletPromo) {
        return this.showWalletPromo;
      }

      return !this.promoOver;
    }
  },
  methods: {
    ...mapActions('global', ['neverShowPromo', 'setPromoOver']),
    /**
     * Hides promo popup forever
     */
    setHidePopUp() {
      if (this.showWalletPromo) {
        this.neverShowPromo();
      }
      if (!this.promoOver) {
        this.setPromoOver();
      }
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
