<template>
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
          :error-messages="amountErrorMessages"
          class="no-right-border"
          style="max-height: 92px; max-width: 251px"
          @keydown.native="preventCharE($event)"
        />
        <mew-select
          v-model="selectedFiat"
          style="max-width: 135px; margin-top: -30px"
          :items="fiatCurrencyItems"
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
        <div class="font-weight-medium textDark--text mr-1">You will get</div>
        <mew-tooltip style="height: 21px">
          <template #contentSlot>
            <div>
              {{ includesFeeText }}
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
          <mew-token-container :img="selectedCurrency.img" size="28px" />
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
    <!-- Receiver's address -->
    <!-- ========================================================================= -->
    <div v-if="!inWallet" class="mt-2">
      <div class="font-weight-medium textDark--text mb-2">
        Where should we send your crypto?
      </div>
      <module-address-book
        ref="addressInput"
        label="Enter Crypto Address"
        :currency="selectedCryptoName"
        :enable-save-address="false"
        :is-home-page="true"
        @setAddress="setAddress"
      />
    </div>

    <!-- ========================================================================= -->
    <!-- BUY NEW button -->
    <!-- ========================================================================= -->
    <mew-button
      class="mt-2"
      btn-size="xlarge"
      has-full-width
      :disabled="disableBuy"
      :title="buyBtnTitle"
      :is-valid-address-func="isValidToAddress"
      @click.native="buy"
    />

    <!-- ========================================================================= -->
    <!-- Token select popup -->
    <!-- ========================================================================= -->
    <buy-sell-token-select
      :open="openTokenSelect"
      :currency-items="tokens"
      :selected-currency="selectedCurrency"
      :set-currency="setCurrency"
      :in-wallet="inWallet"
      @close="openTokenSelect = false"
    />
  </div>
</template>

<script>
import MultiCoinValidator from 'multicoin-address-validator';
import { isEmpty, cloneDeep, isEqual } from 'lodash';
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { fromWei, toBN } from 'web3-utils';

import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import nodeList from '@/utils/networks';
import {
  formatFloatingPointValue,
  formatFiatValue,
  formatIntegerValue,
  formatPercentageValue
} from '@/core/helpers/numberFormatHelper';
import { getCurrency } from '@/modules/settings/components/currencyList';
import { coingeckoContracts } from './tokenList';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import { ETH, MATIC, OP, ARB } from '@/utils/networks/types';
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook.vue';
import { getCoinGeckoTokenMarketDataByIds } from '@/apollo/queries/wallets/wallets.graphql';

export default {
  name: 'ModuleBuyEth',
  filters: {
    concatName(val) {
      // should probably be moved globablly
      if (val.length < 4) return val;
      return `${val.substring(0, 4)}...`;
    }
  },
  components: {
    ModuleAddressBook: ModuleAddressBook,
    BuySellTokenSelect: () =>
      import('@/modules/buy-sell/components/TokenSelect.vue')
  },
  props: {
    orderHandler: {
      type: Object,
      default: () => {}
    },
    defaultCurrency: {
      type: Object,
      default: () => {}
    },
    inWallet: {
      type: Boolean,
      default: false
    },
    supportedBuy: {
      type: Boolean,
      default: false
    }
  },
  apollo: {
    getCoinGeckoTokenMarketDataByIds: {
      query: getCoinGeckoTokenMarketDataByIds,
      variables() {
        return {
          ids: coingeckoContracts[this.network.type.name]
        };
      },
      skip() {
        return !this.supportedBuy;
      },
      result({ data }) {
        if (data) {
          this.tokens = [];
          const { getCoinGeckoTokenMarketDataByIds } = data;
          const locTokens = this.isCAD
            ? getCoinGeckoTokenMarketDataByIds.filter(item => {
                return item.id === this.network.type.coingeckoID;
              })
            : getCoinGeckoTokenMarketDataByIds;
          const parsedLoc = locTokens.map(token => {
            return {
              name: this.names[token.id],
              symbol: this.symbols[token.id],
              subtext: token.symbol.toUpperCase(),
              value: token.symbol.toUpperCase(),
              img: `https://img.mewapi.io/?image=${token.image}`,
              market_cap: token.market_cap,
              market_capf: formatIntegerValue(token.market_cap).value,
              price_change_percentage_24h: token.price_change_percentage_24h,
              price_change_percentage_24hf: formatPercentageValue(
                token.price_change_percentage_24h
              ).value,
              price: token.current_price,
              pricef: formatFiatValue(token.current_price).value
            };
          });
          const tokensListWPrice =
            this.currencyRates.length > 0
              ? parsedLoc.map(token => {
                  const priceRate = this.currencyRates.find(rate => {
                    return rate.crypto_currency === token.symbol;
                  });
                  const actualPrice = priceRate?.quotes.find(quote => {
                    return quote.fiat_currency === this.selectedFiatName;
                  });
                  token.price = formatFiatValue(
                    actualPrice?.price || '0',
                    this.currencyConfig
                  ).value;
                  token.value = token.symbol;
                  return token;
                })
              : parsedLoc;
          this.tokens = tokensListWPrice ? [...tokensListWPrice] : [];
        }
      }
    }
  },
  data() {
    return {
      symbols: {
        ethereum: 'ETH',
        dai: 'DAI',
        tether: 'USDT',
        'usd-coin': 'USDC',
        'paypal-usd': 'PYUSD',
        'true-usd': 'TUSD',
        'first-digital-usd': 'FDUSD-SC',
        'binance-bridged-usdc-bnb-smart-chain': 'USDC-SC',
        'binance-bridged-usdt-bnb-smart-chain': 'USDT-SC',
        'matic-network': 'MATIC',
        'bridged-usdc-polygon-pos-bridge': 'USDC-MATIC',
        'polygon-bridged-usdt-polygon': 'USDT-MATIC',
        'arbitrum-bridged-usdt-arbitrum': 'USDT-ARBITRUM',
        'bridged-usdt': 'USDT-OPTIMISM'
      },
      names: {
        ethereum: 'Ethereum',
        dai: 'Dai Stablecoin',
        tether: 'Tether',
        'usd-coin': 'USD Coin',
        'paypal-usd': 'Paypal USD',
        'true-usd': 'True USD',
        'first-digital-usd': 'First Digital USD',
        'binance-bridged-usdc-bnb-smart-chain': 'USD Coin',
        'binance-bridged-usdt-bnb-smart-chain': 'Tether',
        'matic-network': 'MATIC',
        'bridged-usdc-polygon-pos-bridge': 'USD Coin',
        'polygon-bridged-usdt-polygon': 'Tether',
        'arbitrum-bridged-usdt-arbitrum': 'Tether',
        'bridged-usdt': 'Tether'
      },
      openTokenSelect: false,
      selectedCurrency: this.defaultCurrency,
      loading: true,
      selectedFiat: {
        name: 'USD',
        value: 'USD',
        // eslint-disable-next-line
        img: require(`@/assets/images/currencies/USD.svg`)
      },
      fetchedData: {},
      currencyRates: [],
      amount: '300',
      toAddress: '',
      validToAddress: false,
      gasPrice: '0',
      web3Connections: {},
      simplexQuote: {},
      disableCurrencySelect: true,
      localCryptoAmount: '0',
      tokens: []
    };
  },
  computed: {
    ...mapGetters('global', ['network', 'getFiatValue']),
    ...mapState('wallet', ['web3', 'address']),
    ...mapState('external', ['currencyRate', 'coinGeckoTokens']),
    ...mapGetters('external', ['contractToToken']),
    ...mapGetters('wallet', ['tokensList']),
    includesFeeText() {
      return `Includes ${this.percentFee} fee (${
        formatFiatValue(this.minFee, this.currencyConfig).value
      } min)`;
    },
    networkFeeText() {
      return `${
        this.network.type.name
      } network fee (for transfers to your wallet) ~${
        formatFiatValue(this.networkFeeToFiat, this.currencyConfig).value
      }`;
    },
    dailyLimit() {
      const moonpayMax = this.max.moonpay;
      const simplexMax = this.max.simplex;
      const value = Math.max(moonpayMax.toString(), simplexMax.toString());
      return `Daily limit: ${
        formatFiatValue(value.toString(), this.currencyConfig).value
      }`;
    },
    monthlyLimit() {
      const value = BigNumber(this.fiatMultiplier).times(50000);
      return `Monthly limit: ${
        formatFiatValue(value.toString(), this.currencyConfig).value
      }`;
    },
    currencyConfig() {
      const fiat = this.selectedFiat.value;
      const rate = this.currencyRate[fiat];
      const currency = fiat;
      return { rate, currency };
    },
    fiatMultiplier() {
      if (this.hasData) {
        const selectedCurrencyPrice = this.fetchedData[0].conversion_rates.find(
          item => item.fiat_currency === this.selectedFiatName
        );
        return selectedCurrencyPrice
          ? BigNumber(selectedCurrencyPrice.exchange_rate)
          : toBN(1);
      }
      return toBN(1);
    },
    selectedFiatName() {
      return this.selectedFiat.name;
    },
    actualAddress() {
      return this.inWallet ? this.address : this.toAddress;
    },
    actualValidAddress() {
      return this.inWallet ? true : this.validToAddress;
    },
    networkFee() {
      return fromWei(BigNumber(this.gasPrice).times(21000).toString());
    },
    priceOb() {
      if (!isEmpty(this.fetchedData)) {
        if (this.fetchedData[0] && this.fetchedData[0].prices.length > 0) {
          const inMoonpay = this.fetchedData[0].prices.find(
            item => item.fiat_currency === this.selectedFiatName
          );
          if (inMoonpay) return inMoonpay;
        }

        if (this.fetchedData[1] && this.fetchedData[1].prices.length > 0) {
          const inSimplex = this.fetchedData[1].prices.find(
            item => item.fiat_currency === this.selectedFiatName
          );
          return inSimplex;
        }
      }

      return {
        crypto_currency: ETH.name,
        fiat_currency: 'USD',
        price: '3379.08322'
      };
    },
    networkFeeToFiat() {
      return BigNumber(this.networkFee).times(this.priceOb.price).toString();
    },
    minFee() {
      return BigNumber(4.43).times(this.fiatMultiplier).toString();
    },
    plusFee() {
      const fee = this.isEUR
        ? BigNumber(BigNumber(0.7).div(100)).times(this.amount)
        : BigNumber(BigNumber(3.25).div(100)).times(this.amount);
      const withFee = fee.gt(this.minFee)
        ? BigNumber(this.amount).minus(fee)
        : BigNumber(this.amount).minus(fee).minus(this.minFee);
      return withFee.minus(this.networkFeeToFiat).toString();
    },
    plusFeeF() {
      return formatFiatValue(this.plusFee, this.currencyConfig).value;
    },
    percentFee() {
      return this.isEUR ? '0.7%' : '3.25%';
    },
    selectedCryptoName() {
      return this.selectedCurrency?.symbol ? this.selectedCurrency.symbol : '';
    },
    isEUR() {
      return this.selectedFiatName === 'EUR' || this.selectedFiatName === 'GBP';
    },
    isCAD() {
      return this.selectedFiatName === 'CAD';
    },
    disableBuy() {
      return (
        (!this.inWallet && !this.actualValidAddress) ||
        this.loading ||
        this.amountErrorMessages !== '' ||
        !this.supportedBuy
      );
    },
    buyBtnTitle() {
      return 'BUY NOW';
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
          formatFiatValue(this.minVal.toFixed(), this.currencyConfig).value
        } ${this.selectedFiatName}`;
      }
      if (this.maxVal.gt(0) && this.maxVal.lt(this.amount)) {
        return `Amount can't be above provider's maximum: ${
          formatFiatValue(this.maxVal.toFixed(), this.currencyConfig).value
        } ${this.selectedFiatName}`;
      }
      return '';
    },
    hasData() {
      return !isEmpty(this.fetchedData);
    },
    cryptoToFiat() {
      return BigNumber(this.moonpayCryptoAmount).gt(this.simplexCryptoAmount)
        ? BigNumber(this.moonpayCryptoAmount).gt(this.topperCryptoAmount)
          ? this.moonpayCryptoAmount
          : this.topperCryptoAmount
        : BigNumber(this.simplexCryptoAmount).gt(this.topperCryptoAmount)
        ? this.simplexCryptoAmount
        : this.topperCryptoAmount;
    },
    topperCryptoAmount() {
      return this.topperQuote.cryptoToFiat;
    },
    moonpayCryptoAmount() {
      return formatFloatingPointValue(
        BigNumber(this.plusFee).div(this.priceOb.price).toString()
      ).value;
    },
    simplexCryptoAmount() {
      return formatFloatingPointValue(this.simplexQuote.crypto_amount).value;
    },
    fiatCurrencyItems() {
      if (this.hasData) {
        const simplexCurrencies = Object.values(this.fetchedData).find(item => {
          return item.name === 'SIMPLEX' || item.name === 'MOONPAY';
        });

        const arrItems =
          simplexCurrencies.fiat_currencies.length > 0
            ? simplexCurrencies.fiat_currencies.filter(item => item !== 'RUB')
            : ['USD'];
        const currencies = getCurrency(arrItems);
        return currencies;
      }
      return ['USD'];
    },
    max() {
      if (this.hasData) {
        const dataToArray = Object.values(this.fetchedData);
        const moonPay = dataToArray.find(item => item.name === 'MOONPAY');
        const simplex = dataToArray.find(item => item.name === 'SIMPLEX');
        const topper = dataToArray.find(item => item.name === 'TOPPER');
        const moonpayMax = moonPay?.limits.find(
          item => item.fiat_currency === this.selectedFiatName
        );
        const simplexMax = simplex?.limits.find(
          item => item.fiat_currency === this.selectedFiatName
        );
        const topperMax = topper?.limits.find(
          item => item.fiat_currency === this.selectedFiatName
        );
        return {
          moonpay: moonpayMax ? BigNumber(moonpayMax.limit.max) : BigNumber(0),
          simplex: simplexMax ? BigNumber(simplexMax.limit.max) : BigNumber(0),
          topper: topperMax ? BigNumber(topperMax.limit.max) : BigNumber(0)
        };
      }
      return {
        moonpay: BigNumber(0),
        simplex: BigNumber(0),
        topper: BigNumber(0)
      };
    },
    min() {
      if (this.hasData) {
        const dataToArray = Object.values(this.fetchedData);
        const moonPay = dataToArray.find(item => item.name === 'MOONPAY');
        const simplex = dataToArray.find(item => item.name === 'SIMPLEX');
        const topper = dataToArray.find(item => item.name === 'TOPPER');
        const moonpayMax = moonPay?.limits.find(
          item => item.fiat_currency === this.selectedFiatName
        );
        const simplexMax = simplex?.limits.find(
          item => item.fiat_currency === this.selectedFiatName
        );
        const topperMax = topper?.limits.find(
          item => item.fiat_currency === this.selectedFiatName
        );
        return {
          moonpay: moonpayMax ? BigNumber(moonpayMax.limit.min) : BigNumber(0),
          simplex: simplexMax ? BigNumber(simplexMax.limit.min) : BigNumber(0),
          topper: topperMax ? BigNumber(topperMax.limit.min) : BigNumber(0)
        };
      }
      return {
        moonpay: BigNumber(0),
        simplex: BigNumber(0),
        topper: BigNumber(0)
      };
    },
    maxVal() {
      const moonpayMax = this.max.moonpay;
      const simplexMax = this.max.simplex;
      const topperMax = this.max.topper;
      return BigNumber(simplexMax).gt(moonpayMax) &&
        BigNumber(simplexMax).gt(topperMax)
        ? simplexMax
        : BigNumber(moonpayMax).gt(topperMax)
        ? moonpayMax
        : topperMax;
    },
    minVal() {
      const moonpayMax = this.min.moonpay;
      const simplexMax = this.min.simplex;
      const topperMax = this.min.topper;
      return BigNumber(simplexMax).lt(moonpayMax) &&
        BigNumber(simplexMax).lt(topperMax)
        ? simplexMax
        : BigNumber(moonpayMax).lt(topperMax)
        ? moonpayMax
        : topperMax;
    },
    topperQuote() {
      const topper = Object.values(this.fetchedData).find(
        item => item.name === 'TOPPER'
      );
      if (topper) {
        const topperFiatPrice = BigNumber(
          topper.prices.find(
            item => item.fiat_currency === this.selectedFiatName
          ).price || 0
        );
        // const cryptoToFiat = BigNumber(this.amount).times(topperFiatPrice);
        const cryptoToFiatWithFees = BigNumber(this.amount)
          .minus(BigNumber(0.18))
          // topper fee
          .minus(BigNumber(this.amount).times(0.029))
          // mew fee
          .minus(BigNumber(this.amount).times(0.0175))
          // topper price
          .div(topperFiatPrice);

        const cryptoToFiatWithFeesF = formatFiatValue(
          cryptoToFiatWithFees.toString(),
          this.currencyConfig
        ).value;
        const topperLimit = topper.limits.find(
          item => item.fiat_currency === this.selectedFiatName
        ).limit;

        return {
          cryptoToFiat: formatFloatingPointValue(
            cryptoToFiatWithFees.toString()
          ).value,
          selectedCryptoName: this.selectedCryptoName,
          plusFeeF: cryptoToFiatWithFeesF,
          includesFeeText: `Includes 4.75% fee (First transaction is free).`,
          networkFeeText: `${
            this.network.type.name
          } network fee (for transfers to your wallet) ~${
            formatFiatValue(0.18, this.currencyConfig).value
          }`,
          dailyLimit: `Daily limit: ${
            formatFiatValue(topperLimit.max.toString(), this.currencyConfig)
              .value
          }`,
          monthlyLimit: `Monthly limit: ${
            formatFiatValue(
              BigNumber(topperLimit.max).times(15).toString(),
              this.currencyConfig
            ).value
          }`,
          fiatAmount: this.amount
        };
      }
      return {
        cryptoToFiat: '0',
        selectedCryptoName: this.selectedCryptoName,
        plusFeeF: '0',
        includesFeeText: '0',
        networkFeeText: '0',
        dailyLimit: '0',
        monthlyLimit: '0',
        fiatAmount: this.amount
      };
    }
  },
  watch: {
    selectedCurrency: {
      handler: function (newVal, oldVal) {
        const supportedCoins = {
          ETH: ETH.name,
          MATIC: MATIC.name,
          OP: OP.name,
          ARB: ARB.name
        };
        if (
          !newVal ||
          (newVal?.contract?.toLowerCase() === MAIN_TOKEN_ADDRESS &&
            !supportedCoins[newVal?.symbol])
        ) {
          return;
        }
        if (!isEqual(newVal, oldVal)) {
          this.fetchCurrencyData();
        }
        this.$emit('selectedCurrency', this.selectedCurrency);
      },
      deep: true
    },
    selectedFiat: {
      handler: function (newVal, oldVal) {
        if (!isEqual(newVal, oldVal)) {
          const token = this.tokens.find(
            item => item.symbol === this.selectedCryptoName
          );
          if (token) {
            const price = token?.price || this.tokens[0]?.price;
            const parsedPrice = `${price}`.substring(1, price.length);
            this.amount = BigNumber(this.localCryptoAmount)
              .multipliedBy(parsedPrice)
              .toFixed(2);
            this.localCryptoAmount = BigNumber(this.amount)
              .div(parsedPrice)
              .toString();
          }

          this.$emit('selectedFiat', newVal);
        }
      },
      deep: true
    },
    network: {
      handler: function () {
        this.tokens = [];
        this.selectedCurrency = {};
        this.selectedCurrency = this.defaultCurrency;
        this.$apollo.queries.getCoinGeckoTokenMarketDataByIds.refresh();
      },
      deep: true
    },
    orderHandler: {
      handler: function () {
        this.fetchCurrencyData();
      },
      deep: true
    },
    amount: {
      handler: function (newVal) {
        const simplexMax = this.max.simplex.multipliedBy(this.fiatMultiplier);
        if (
          simplexMax.lt(newVal) ||
          isEmpty(newVal) ||
          this.minVal.gt(newVal) ||
          isNaN(newVal)
        ) {
          this.loading = true;
        } else {
          this.loading = false;
          this.getSimplexQuote();
          this.localCryptoAmount = BigNumber(this.amount)
            .div(this.priceOb.price)
            .toString();
        }
      }
    },
    validToAddress: {
      handler: function (newVal) {
        if (!newVal) return;
        this.$emit('toAddress', this.toAddress);
        this.getSimplexQuote();
      }
    },
    coinGeckoTokens: {
      handler: function () {
        this.fetchCurrencyData();
      }
    },
    openTokenSelect() {
      this.$emit('openTokenSelect', this.openTokenSelect);
    }
  },
  mounted() {
    if (!this.inWallet) this.$refs.addressInput.$refs?.addressSelect.clear();
    this.fetchCurrencyData();
  },
  methods: {
    setAddress(newVal, isValid, data) {
      if (data.type === 'RESOLVED' && !data.value.includes('.'))
        this.toAddress = data.value;
      else this.toAddress = newVal;
      this.validToAddress = isValid;
    },
    async fetchGasPrice() {
      const supportedNodes = {
        ETH: ETH.name,
        MATIC: MATIC.name,
        OP: OP.name,
        ARB: ARB.name
      };
      const nodeType = !supportedNodes[this.selectedCurrency?.symbol]
        ? ETH.name
        : supportedNodes[this.selectedCurrency.symbol];
      const node = nodeList[nodeType];
      if (!this.web3Connections[nodeType]) {
        const web3 = new Web3(node[0].url);
        this.web3Connections[nodeType] = web3;
      }
      this.gasPrice = await this.web3Connections[nodeType].eth.getGasPrice();
    },
    isValidToAddress(address) {
      return MultiCoinValidator.validate(address, this.selectedCurrency.symbol);
    },
    setCurrency(e) {
      this.selectedCurrency = e;
    },
    fetchCurrencyData() {
      this.loading = true;
      this.disableCurrencySelect = true;
      this.fetchData = {};
      this.fetchGasPrice();
      this.orderHandler
        .getSupportedFiatToBuy(this.selectedCurrency?.symbol)
        .then(res => {
          this.orderHandler.getFiatRatesForBuy().then(rateRes => {
            this.currencyRates = cloneDeep(rateRes);
            this.loading = false;
            this.disableCurrencySelect = false;
          });
          this.fetchedData = Object.assign({}, res);
          this.localCryptoAmount = BigNumber(this.amount)
            .div(this.priceOb.price)
            .toString();
          this.getSimplexQuote();
        })
        .catch(e => {
          Toast(e, {}, ERROR);
        });
    },
    getSimplexQuote() {
      this.simplexQuote = {};
      const simplex = Object.values(this.fetchedData).find(
        item => item.name === 'SIMPLEX'
      );
      if (
        simplex.prices.length === 0 ||
        !this.actualValidAddress ||
        isEmpty(this.amount) ||
        this.min.simplex.gt(this.amount) ||
        isNaN(this.amount) ||
        (this.max.simplex.gt(0) && this.max.simplex.lt(this.amount)) ||
        this.amountErrorMessages !== ''
      ) {
        return;
      }
      this.loading = true;
      this.disableCurrencySelect = true;
      this.orderHandler
        .getSimplexQuote(
          this.selectedCryptoName,
          this.selectedFiatName,
          this.amount,
          this.actualAddress
        )
        .then(res => {
          this.simplexQuote = Object.assign({}, res);
          this.loading = false;
          this.disableCurrencySelect = false;
          this.$emit('simplexQuote', this.simplexQuote);
        })
        .catch(e => {
          const error = e.response ? e.response.data.error : e;
          this.loading = false;
          this.$emit('simplexQuote', {});
          Toast(error, {}, ERROR);
        });
    },
    buy() {
      const buyObj = {
        cryptoToFiat: this.moonpayCryptoAmount,
        selectedCryptoName: this.selectedCryptoName,
        plusFeeF: this.plusFeeF,
        includesFeeText: this.includesFeeText,
        networkFeeText: this.networkFeeText,
        dailyLimit: this.dailyLimit,
        monthlyLimit: this.monthlyLimit,
        fiatAmount: this.amount
      };
      this.$emit('success', [
        this.simplexQuote,
        this.topperQuote,
        this.toAddress,
        buyObj,
        1,
        this.selectedCurrency,
        this.selectedFiat
      ]);
    },
    preventCharE(e) {
      if (e.key === 'e') e.preventDefault();
    }
  }
};
</script>

<style lang="scss" scoped>
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
  height: 145px;
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
</style>
<style lang="scss">
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
