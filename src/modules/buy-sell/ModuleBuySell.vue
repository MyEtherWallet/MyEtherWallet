<template>
  <div class="mew-component--moon-pay">
    <mew-popup
      :show="open"
      :has-buttons="false"
      :has-title="false"
      :has-padding="false"
      max-width="450"
      :left-btn="leftBtn"
      scrollable
      has-body-content
    >
      <div v-if="step === 0">
        <mew-tabs
          v-if="open"
          :items="tabItems"
          :active-tab="activeTab"
          active-color="greenPrimary"
          has-underline
          class="pt-3"
          :class="addTokenPadding ? 'top-container' : ''"
          @onTab="onTab"
        >
          <template #tabContent1>
            <buy-eth-component
              :order-handler="orderHandler"
              :tab="activeTab"
              :default-currency="defaultCurrency"
              :in-wallet="inWallet"
              :supported-buy="supportedNetwork"
              @selectedCurrency="setSelectedCurrency"
              @openProviders="openProviders"
              @selectedFiat="setSelectedFiat"
              @simplexQuote="setSimplexQuote"
              @toAddress="setToAddress"
              @success="buySuccess"
              @openTokenSelect="checkTokenPadding"
            />
          </template>
          <template v-if="sellSupported" #tabContent2>
            <sell-eth-component
              :order-handler="orderHandler"
              :tab="activeTab"
              :in-wallet="inWallet"
              :default-currency="defaultCurrency"
              @selectedCurrency="setSelectedCurrency"
            />
          </template>
        </mew-tabs>
      </div>
      <buy-provider-component
        v-if="step === 1"
        :order-handler="orderHandler"
        :in-wallet="inWallet"
        :selected-currency="selectedCurrency"
        :selected-fiat="selectedFiat"
        :moonpay-quote="moonpayQuote"
        :simplex-quote="simplexQuote"
        :topper-quote="topperQuote"
        :to-address="toAddress"
        @close="step = 0"
        @openProviders="openProviders"
        @reset="reset"
      />
    </mew-popup>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { isEmpty } from 'lodash';

import {
  ETH
  //  OP,
  // MATIC
  // ARB, BSC
} from '@/utils/networks/types';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';

import handler from './handlers/handlerOrder';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { BUY_SELL } from '@/modules/analytics-opt-in/handlers/configs/events';

export default {
  name: 'MoonPay',
  components: {
    BuyEthComponent: () => import('./components/BuyComponent'),
    SellEthComponent: () => import('./components/SellComponent'),
    BuyProviderComponent: () => import('./components/BuyProviderComponent.vue')
  },
  mixins: [handlerAnalytics],
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: false,
      activeTab: 0,
      orderHandler: {},
      selectedCurrency: {},
      selectedFiat: {},
      moonpayQuote: {},
      step: 0,
      simplexQuote: {},
      topperQuote: {},
      toAddress: '',
      addTokenPadding: false
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'instance']),
    ...mapGetters('wallet', ['tokensList']),
    ...mapGetters('global', ['network']),
    ...mapGetters('external', ['contractToToken']),
    sellSupported() {
      return this.network.type.name === ETH.name;
    },
    inWallet() {
      return (
        this.$route.fullPath.includes('/wallet') && !this.$route.meta.noAuth
      );
    },
    defaultCurrency() {
      if (isEmpty(this.selectedCurrency) && this.supportedNetwork) {
        if (this.inWallet) {
          return this.tokensList[0];
        }
        const token = this.contractToToken(MAIN_TOKEN_ADDRESS);
        token.value = token.symbol;
        return token;
      } else if (isEmpty(this.selectedCurrency) || !this.supportedNetwork) {
        return this.selectedCurrency;
      }
      return this.selectedCurrency;
    },
    supportedNetwork() {
      return this.network.type.canBuy;
    },
    leftBtn() {
      return {
        method: this.close
      };
    },
    tabItems() {
      if (this.sellSupported) {
        return [
          {
            name: `Buy`
          },
          {
            name: `Sell`
          }
        ];
      }
      return [{ name: 'Buy' }];
    }
  },
  watch: {
    open(newVal) {
      this.isOpen = newVal;
      if (newVal) {
        this.orderHandler = new handler();
      }
      this.selectedCurrency = {};
      this.selectedCurrency = this.defaultCurrency;
    },
    address() {
      this.selectedCurrency = this.defaultCurrency;
    },
    network() {
      this.selectedCurrency = {};
      this.selectedCurrency = this.defaultCurrency;
      this.setTokens();
    }
  },
  methods: {
    ...mapActions('external', ['setNetworkTokens']),
    onTab(val) {
      this.trackBuySell(val === 0 ? BUY_SELL.BUY_TAB : BUY_SELL.SELL_TAB);
      this.selectedCurrency = {};
      this.selectedCurrency = this.defaultCurrency;
      this.activeTab = val;
    },
    async setTokens() {
      if (!this.inWallet) {
        const tokenMap = new Map();
        const tokens = await this.network.type.tokens;
        tokens.forEach(token => {
          tokenMap.set(token.address.toLowerCase(), token);
        });
        this.setNetworkTokens(tokenMap);
      }
    },
    close() {
      this.activeTab = 0;
      this.step = 0;
      this.$emit('close', false);
      this.trackBuySell(BUY_SELL.BUY_SELL_CLOSED);
    },
    setSelectedCurrency(e) {
      if (this.selectedCurrency.symbol !== e.symbol) {
        const event =
          this.activeTab === 0 ? BUY_SELL.BUY_INPUT : BUY_SELL.SELL_INPUT;
        this.trackBuySell(event, {
          old: this.selectedCurrency.symbol,
          new: e.symbol
        });
      }
      this.selectedCurrency = e;
    },
    setSelectedFiat(e) {
      if (e.name === 'CAD') {
        this.selectedCurrency = this.defaultCurrency;
      }
      this.selectedFiat = e;
    },
    openProviders(val) {
      this.step = val;
    },
    setMoonpayQuote(val) {
      this.moonpayQuote = val;
    },
    setSimplexQuote(val) {
      this.simplexQuote = val;
    },
    setTopperQuote(val) {
      this.topperQuote = val;
    },
    setToAddress(val) {
      this.toAddress = val;
    },
    reset() {
      this.selectedCurrency = this.defaultCurrency;
      this.selectedFiat = {
        name: 'USD',
        value: 'USD',
        // eslint-disable-next-line
        img: require(`@/assets/images/currencies/USD.svg`)
      };
    },
    buySuccess(items) {
      this.setSimplexQuote(items[0]);
      this.setTopperQuote(items[1]);
      this.setToAddress(items[2]);
      this.setMoonpayQuote(items[3]);
      this.openProviders(items[4]);
      this.setSelectedCurrency(items[5]);
      this.setSelectedFiat(items[6]);
      this.trackBuySell(BUY_SELL.BUY_NOW_BUTTON);
    },
    checkTokenPadding(isOpen) {
      if (this.inWallet) {
        this.addTokenPadding = isOpen;
      } else this.addTokenPadding = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.top-container {
  min-height: 540px;
}
</style>
