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
          class="pt-3 top-container"
          @onTab="onTab"
        >
          <template #tabContent1>
            <buy-eth-component
              :order-handler="orderHandler"
              :default-currency="defaultCurrency"
              :supported-buy="supportedNetwork"
              :buy-networks="buyNetworks"
              :buy-fiats="buyFiats"
              @selectedCurrency="setSelectedCurrency"
              @openProviders="openProviders"
              @selectedFiat="setSelectedFiat"
              @success="buySuccess"
            />
          </template>
          <template v-if="sellSupported" #tabContent2>
            <sell-eth-component
              :order-handler="orderHandler"
              :tab="activeTab"
              :default-currency="defaultCurrency"
              @selectedCurrency="setSelectedCurrency"
            />
          </template>
        </mew-tabs>
      </div>
      <buy-provider-component
        v-if="step === 1"
        :order-handler="orderHandler"
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
import { mapGetters, mapState } from 'vuex';
import { isEmpty } from 'lodash';

import { ETH, OP, ARB } from '@/utils/networks/types';
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
      step: 0,
      toAddress: '',
      buyNetworks: [],
      sellNetworks: [],
      buyFiats: [],
      sellFiats: []
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapGetters('wallet', ['tokensList']),
    ...mapGetters('global', ['network']),
    ...mapGetters('external', ['contractToToken', 'getCoinGeckoTokenById']),
    sellSupported() {
      return this.network.type.name === ETH.name;
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
        this.fetchNetworks();
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
    }
  },
  methods: {
    async fetchNetworks() {
      const data = await fetch('https://qa.mewwallet.dev/v5/purchase/info');
      const response = await data.json();
      const { assets, providers } = response;
      const buyNetworks = assets
        .filter(
          asset =>
            asset.chain === ETH.name ||
            asset.chain === 'POL' ||
            asset.chain === OP.name ||
            asset.chain === ARB.name
        )
        .map(chain => {
          const assets = chain.assets.map(asset => {
            const cgToken =
              this.getCoinGeckoTokenById(asset.coingecko_id) || {};
            const token = this.contractToToken(asset.contract_address) || {};
            return Object.assign({}, asset, token, cgToken);
          });
          chain.assets = assets;
          return chain;
        });

      const sellNetworks = buyNetworks
        .filter(network => network.chain === 'ETH')
        .map(network => {
          const filteredTokens = network.assets.filter(asset =>
            asset.providers.includes('MOONPAY')
          );
          return Object.assign({}, network, { assets: filteredTokens });
        });
      const buyFiats = [];
      const sellFiats = providers.find(p => p.provider === 'MOONPAY').fiats;
      providers.forEach(provider => {
        provider.fiats.forEach(fiat => {
          if (!buyFiats.find(f => f.fiat_currency === fiat)) {
            buyFiats.push({
              name: fiat.fiat_currency,
              value: fiat.fiat_currency,
              img: require(`@/assets/images/fiat/${fiat.fiat_currency}.svg`),
              limits: fiat.limits
            });
          }
        });
      });

      this.buyNetworks = buyNetworks;
      this.sellNetworks = sellNetworks;
      this.buyFiats = buyFiats;
      this.sellFiats = sellFiats;
    },
    onTab(val) {
      this.trackBuySell(val === 0 ? BUY_SELL.BUY_TAB : BUY_SELL.SELL_TAB);
      this.selectedCurrency = {};
      this.selectedCurrency = this.defaultCurrency;
      this.activeTab = val;
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
      this.openProviders();
      this.setSelectedFiat(items[6]);
      this.trackBuySell(BUY_SELL.BUY_NOW_BUTTON);
    }
  }
};
</script>

<style lang="scss" scoped>
// .top-container {
//   min-height: 540px;
// }
//
</style>
