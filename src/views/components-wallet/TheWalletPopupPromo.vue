<template>
  <app-modal
    width="420"
    :show="showWalletPromo"
    title="Buy crypto with 0% fees"
    has-body-content
    :has-buttons="false"
    :title-center="false"
    :has-close-button="false"
  >
    <template #dialogBody>
      <div class="textMedium--text mt-2 mew-heading-4">
        MEW has joined with Moonpay to offer more crypto buying and selling
        options. For a limited time
      </div>
      <div class="textLight--text mb-10 mew-heading-4">
        Offer ends {{ end }}
      </div>

      <div>
        <div
          v-for="item in items"
          :key="item.subtext"
          class="d-flex align-center ma-2"
        >
          <img
            class="icon-container mr-2 pa-1"
            :src="item.img"
            height="32px"
            width="32px"
          />
          {{ item.symbol }}
        </div>
      </div>
      <mew-button
        class="mt-11"
        title="Buy Crypto"
        has-full-width
        btn-size="xlarge"
        @click.native="goToPromo()"
      />
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/core/components/AppModal';
import { mapActions, mapState } from 'vuex';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { EventBus } from '@/core/plugins/eventBus';
import { MOONPAY_EVENT, MOONPAY_OFFER_END } from '@/modules/moon-pay/helpers';

export default {
  name: 'TheWalletPopupPromo',
  components: { AppModal },
  mixins: [handlerAnalytics],
  data() {
    return {
      items: [
        {
          decimals: 18,
          img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/ETH-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg',
          name: 'ETH',
          subtext: 'Ethereum',
          value: 'Ethereum',
          symbol: 'ETH Ethereum'
        },
        {
          decimals: 18,
          img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/USDT-0xdAC17F958D2ee523a2206206994597C13D831ec7-eth.png',
          name: 'USDT',
          subtext: 'Tether',
          value: 'Tether',
          symbol: 'USDT Tether'
        },
        {
          decimals: 6,
          img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/USDC-0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48-eth.svg',
          name: 'USDC',
          subtext: 'USD Coin',
          value: 'USD Coin',
          symbol: 'USDC USD Coin'
        },
        {
          decimals: 18,
          img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/MATIC-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-matic.png',
          name: 'MATIC',
          subtext: 'Polygon',
          value: 'Polygon',
          symbol: 'MATIC Polygon'
        },
        {
          decimals: 18,
          img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/BNB-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
          name: 'BNB',
          subtext: 'Binance Smart Chain',
          value: 'Binance Smart Chain',
          symbol: 'BNB Binance'
        }
      ],
      end: MOONPAY_OFFER_END
    };
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
