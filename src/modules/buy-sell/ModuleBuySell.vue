<template>
  <div class="mew-component--moon-pay">
    <mew-popup
      :show="open"
      :has-buttons="false"
      :has-title="false"
      :has-padding="false"
      :max-width="step === 0 ? '450' : '500'"
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
            <div class="py-8 px-8 moonpay-buy-component">
              <!-- ========================================================================= -->
              <!-- Sending amount in fiat -->
              <!-- ========================================================================= -->
              <div class="mt-2">
                <div class="font-weight-medium textDark--text mb-2">
                  How much do you want to spend?
                </div>
                <div class="d-flex align-center">
                  <mew-input
                    v-model="amount"
                    hide-clear-btn
                    type="number"
                    class="no-right-border"
                    style="max-height: 92px; max-width: 251px"
                    :error-messages="amountErrorMessages"
                    @keydown.native="preventCharE($event)"
                  />
                  <mew-select
                    v-model="selectedFiat"
                    style="max-width: 135px; margin-top: -30px"
                    :items="buyFiats"
                    is-custom
                    class="selectedFiat no-left-border"
                  />
                </div>
              </div>

              <!-- ========================================================================= -->
              <!-- Receiving amount in crypto -->
              <!-- ========================================================================= -->
              <div class="mt-2">
                <div class="d-flex align-center mb-2">
                  <div class="font-weight-medium textDark--text mr-1">
                    You will get
                  </div>
                  <mew-tooltip v-if="!loading" style="height: 21px">
                    <template #contentSlot>
                      <div>
                        Includes 4.75% fee (First transaction is free).
                        <br />
                        <br />
                        {{ networkFeeText }}
                        <br />
                        <br />
                        {{ dailyLimit }}
                        <br />
                        {{ monthlyLimit }}
                      </div>
                    </template>
                  </mew-tooltip>
                </div>
                <div class="d-flex align-start">
                  <mew-input
                    is-read-only
                    :value="!loading ? `${cryptoToFiat}` : 'Loading...'"
                    hide-clear-btn
                    class="no-right-border"
                  />
                  <div
                    class="d-flex align-center token-select-button"
                    @click="openTokenSelect = true"
                  >
                    <mew-token-container
                      :img="selectedCurrency.img"
                      size="28px"
                    />
                    <div class="basic--text ml-2">
                      {{ selectedCurrency.symbol | concatName }}
                    </div>
                    <v-icon class="ml-auto" size="20px" color="titlePrimary">
                      mdi-chevron-down
                    </v-icon>
                  </div>
                </div>
              </div>

              <!-- ========================================================================= -->
              <!-- BUY NEW button -->
              <!-- ========================================================================= -->
              <mew-button
                class="mt-2"
                btn-size="xlarge"
                has-full-width
                :disabled="!disableBuy"
                title="BUY NOW"
                @click.native="buy"
              />

              <!-- ========================================================================= -->
              <!-- Token select popup -->
              <!-- ========================================================================= -->
              <buy-sell-token-select
                :open="openTokenSelect"
                :networks="buyNetworks"
                :selected-currency="selectedCurrency"
                :set-currency="setSelectedCurrency"
                @close="openTokenSelect = false"
              />
            </div>
          </template>
          <template v-if="sellSupported" #tabContent2>
            <sell-eth-component
              :tab="activeTab"
              :default-currency="defaultCurrency"
              :sell-networks="sellNetworks"
              :sell-fiats="sellFiats"
              :close="close"
              @selectedCurrency="setSelectedCurrency"
            />
          </template>
        </mew-tabs>
      </div>
      <buy-provider-component
        v-if="step === 1"
        :selected-fiat="selectedFiat"
        :selected-currency="selectedCurrency"
        :buy-quote="buyQuote"
        :buy-provider="buyProvider"
      />
    </mew-popup>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { isEmpty } from 'lodash';
import BigNumber from 'bignumber.js';
import { sha3 } from 'web3-utils';

import { ETH, OP, ARB, POL } from '@/utils/networks/types';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';

import { formatFiatValue } from '@/core/helpers/numberFormatHelper';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { BUY_SELL } from '@/modules/analytics-opt-in/handlers/configs/events';

export default {
  name: 'MoonPay',
  filters: {
    concatName(val) {
      // should probably be moved globablly
      if (val.length < 4) return val;
      return `${val.substring(0, 4)}...`;
    }
  },
  components: {
    BuySellTokenSelect: () =>
      import('@/modules/buy-sell/components/TokenSelect.vue'),
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
      selectedCurrency: {},
      step: 0,
      // new vars
      buyNetworks: [],
      sellNetworks: [],
      buyFiats: [],
      sellFiats: [],
      amount: '0',
      loading: true,
      buyQuote: [],
      selectedFiat: {
        name: 'USD',
        value: 'USD',
        // eslint-disable-next-line
        img: require(`@/assets/images/currencies/USD.svg`),
        limits: {
          min: 50,
          max: 20000
        }
      },
      openTokenSelect: false,
      isFetching: false
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapGetters('wallet', ['tokensList']),
    ...mapGetters('global', ['network']),
    ...mapGetters('external', ['contractToToken', 'getCoinGeckoTokenById']),
    dailyLimit() {
      return `Daily limit: ${
        formatFiatValue(BigNumber(this.selectedFiat.limits.max).toString(), {
          currency: this.selectedFiat.name
        }).value
      }`;
    },
    monthlyLimit() {
      return `Monthly limit: ${
        formatFiatValue(
          BigNumber(this.selectedFiat.limits.max).times(2).toString(),
          { currency: this.selectedFiat.name }
        ).value
      }`;
    },
    networkFeeText() {
      return `${
        this.network.type.name
      } network fee (for transfers to your wallet) ~${BigNumber(
        this.buyQuote[0]?.fiat_fees || 0
      )
        .div(this.buyQuote[0]?.crypto_price || 0)
        .toString()} ${this.network.type.name}`;
    },
    cryptoToFiat() {
      return BigNumber(this.buyQuote[0]?.crypto_amount || 0).toString();
    },
    disableBuy() {
      return (
        !this.loading &&
        this.amountErrorMessages === '' &&
        this.network.type.canBuy
      );
    },
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
    },
    minVal() {
      return BigNumber(this.selectedFiat.limits.min);
    },
    maxVal() {
      return BigNumber(this.selectedFiat.limits.max);
    },
    amountErrorMessages() {
      if (BigNumber(this.amount).isNaN() || BigNumber(this.amount).eq(0)) {
        return 'Amount required';
      }
      if (BigNumber(this.amount).lt(0)) {
        return `Amount can't be negative`;
      }
      if (this.minVal.gt(this.amount)) {
        return `Amount can't be below provider's minimum: ${
          formatFiatValue(this.minVal.toFixed(), {
            currency: this.selectedFiat.name
          }).value
        } ${this.selectedFiatName}`;
      }
      if (this.maxVal.gt(0) && this.maxVal.lt(this.amount)) {
        return `Amount can't be above provider's maximum: ${
          formatFiatValue(this.maxVal.toFixed(), {
            currency: this.selectedFiat.name
          }).value
        } ${this.selectedFiatName}`;
      }
      return '';
    }
  },
  watch: {
    selectedCurrency: {
      handler: function () {
        this.loading = true;
        this.fetchQuotes();
      }
    },
    selectedFiat: {
      handler: function () {
        this.loading = true;
        this.fetchQuotes();
      }
    },
    amount: {
      handler: function () {
        this.loading = true;
        this.fetchQuotes();
      }
    },
    open(newVal) {
      this.isOpen = newVal;
      if (newVal) {
        this.amount = '300';
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
    async fetchQuotes() {
      this.loading = true;
      if (!this.isOpen || this.isFetching) return;
      this.buyQuote = [];
      const id = sha3(this.address)?.substring(0, 42);
      const network =
        this.network.type.name === 'Polygon' ? 'POL' : this.network.type.name;
      this.isFetching = true; // prevent multiple requests
      const data = await fetch(
        `https://qa.mewwallet.dev/v5/purchase/buy?id=${id}&address=${this.address}&fiatCurrency=${this.selectedFiat.name}&amount=${this.amount}&cryptoCurrency=${this.selectedCurrency.symbol}&chain=${network}&iso=US`
      );
      const response = await data.json();
      this.buyQuote = response;
      this.loading = false;
      this.isFetching = false;
    },
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
          const matchedChain =
            chain.chain === 'POL'
              ? POL
              : chain.chain === OP.name
              ? OP
              : chain.chain === ARB.name
              ? ARB
              : ETH;
          return Object.assign({}, chain, matchedChain, {
            img: matchedChain.icon,
            value: matchedChain.name
          });
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
      const sellFiats = providers
        .find(p => p.provider === 'MOONPAY')
        .fiats.map(item => {
          return {
            name: item.fiat_currency,
            value: item.fiat_currency,
            // eslint-disable-next-line
            img: require(`@/assets/images/fiat/${item.fiat_currency}.svg`),
            limits: item.limits
          };
        });
      providers.forEach(provider => {
        provider.fiats.forEach(fiat => {
          const stored = buyFiats.findIndex(f => f.name === fiat.fiat_currency);
          if (stored === -1) {
            buyFiats.push({
              name: fiat.fiat_currency,
              value: fiat.fiat_currency,
              // eslint-disable-next-line
              img: require(`@/assets/images/fiat/${fiat.fiat_currency}.svg`),
              limits: fiat.limits
            });
          } else {
            if (fiat.limits.min < buyFiats[stored].limits.min) {
              buyFiats[stored].limits.min = fiat.limits.min;
            }
            if (fiat.limits.max > buyFiats[stored].limits.max) {
              buyFiats[stored].limits.max = fiat.limits.max;
            }
          }
        });
      });

      this.buyNetworks = buyNetworks;
      this.sellNetworks = sellNetworks;
      this.buyFiats = buyFiats;
      this.sellFiats = sellFiats;

      // check buy networks and set currency
      buyNetworks.forEach(network => {
        network.assets.forEach(asset => {
          if (asset.symbol === this.defaultCurrency.symbol) {
            this.selectedCurrency = asset;
          }
        });
      });
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
    openProviders(val) {
      this.step = val;
    },
    buy() {
      this.fetchQuotes();
      this.openProviders(1);
      this.trackBuySell(BUY_SELL.BUY_NOW_BUTTON);
    },
    preventCharE(e) {
      if (e.key === 'e') e.preventDefault();
    },
    buyProvider(provider) {
      window.open(provider.url, '_blank');
      this.trackBuySell(BUY_SELL.BUY_PROVIDER_SELECTED, {
        provider: provider.provider
      });
      this.close();
    },
    setSelectedCurrency(currency) {
      this.selectedCurrency = currency;
    }
  }
};
</script>

<style lang="scss" scoped>
// .top-container {
//   min-height: 540px;
// }
//
// Force set button border color(greyMedium) for not selected buttons
.not-selected {
  border: 1px solid var(--v-greyMedium-base);
}
.icon-holder {
  border: 2px solid var(--v-greyMedium-base);
  border-radius: 100px;
  width: 20px;
  height: 20px;
}
.section-block {
  border-radius: 12px;
  left: 0px;
  top: 0px;
  box-sizing: border-box;
  border: 2px solid var(--v-greyMedium-base);
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  margin: 8px 0px;
  position: relative;
}
.section-block:hover {
  cursor: pointer;
  border: 2px solid #1eb19b;
  background-color: #e5eaee;
}
.selected {
  border: 2px solid #1eb19b;
}
.provider-logo {
  position: absolute;
  top: 18px;
  right: 20px;
}
.token-select-button {
  height: 62px;
  border: 1px solid var(--v-inputBorder-base);
  border-radius: 0 8px 8px 0;
  width: 135px;
  padding: 0 11px 0 14px;
  line-height: initial;
  user-select: none;
  cursor: pointer;
  &:hover {
    border: 1px solid var(--v-greyPrimary-base);
  }
}

.best-rate {
  background-color: #05c0a5 !important;
  text-align: center;
  font-size: small;
  width: 64px;
  border-radius: 4px;
  top: -10px;
  position: absolute;
  color: white;
}
</style>
<style lang="scss">
.selectedFiat {
  .mew-token-container {
    img {
      width: 30px !important;
      height: 30px !important;
    }
  }
}
.moonpay-buy-component {
  .v-input__slot {
    height: 62px !important;
  }

  .no-right-border {
    fieldset {
      border-radius: 8px 0 0 8px !important;
    }
  }
  .no-left-border fieldset {
    border-radius: 0 8px 8px 0 !important;
  }
}
</style>
