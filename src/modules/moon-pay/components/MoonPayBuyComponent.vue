<template>
  <div class="py-8 px-8 moonpay-buy-component">
    <!-- ========================================================================= -->
    <!-- Sending amount in fiat -->
    <!-- ========================================================================= -->
    <div class="mt-4">
      <div class="font-weight-medium textDark--text mb-2">
        How much do you want to spend?
      </div>
      <div class="d-flex align-start">
        <mew-input
          v-model="amount"
          hide-clear-btn
          type="number"
          :error-messages="amountErrorMessages"
          class="no-right-border"
          @keydown.native="preventCharE($event)"
        />
        <mew-select
          v-model="selectedFiat"
          style="max-width: 135px"
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
          :value="
            !loading
              ? `${cryptoToFiat} ${selectedCryptoName} ≈ ${plusFeeF} `
              : 'Loading...'
          "
          hide-clear-btn
          class="no-right-border"
        />
        <div
          class="d-flex align-center token-select-button"
          @click="openTokenSelect = true"
        >
          <mew-token-container :img="selectedCurrency.img" size="28px" />
          <div class="basic--text" style="margin-left: 8px">
            {{ selectedCurrency.name }}
          </div>
          <v-icon class="ml-auto" size="20px" color="titlePrimary">
            mdi-chevron-down
          </v-icon>
        </div>
      </div>
    </div>

    <!-- ======================================================================================== -->
    <!-- Currency Select -->
    <!-- HIDDEN FOR NOW! HIDDEN FOR NOW! HIDDEN FOR NOW! HIDDEN FOR NOW! HIDDEN FOR NOW! -->
    <!-- HIDDEN FOR NOW! HIDDEN FOR NOW! HIDDEN FOR NOW! HIDDEN FOR NOW! HIDDEN FOR NOW! -->
    <!-- HIDDEN FOR NOW! HIDDEN FOR NOW! HIDDEN FOR NOW! HIDDEN FOR NOW! HIDDEN FOR NOW! -->
    <!-- ======================================================================================== -->
    <div v-show="false" class="mt-2">
      <div class="font-weight-medium textDark--text mb-2">Select currency</div>
      <mew-select
        ref="selectedCurrency"
        label="Currency"
        :items="currencyItems"
        :value="selectedCurrency"
        :disabled="disableCurrencySelect"
        :error-messages="currencyErrorMessages"
        is-custom
        @input="setCurrency"
      />
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
    <moonpay-token-select
      :open="openTokenSelect"
      :currency-items="currencyItems"
      :selected-currency="selectedCurrency"
      :set-currency="setCurrency"
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
  formatFiatValue
} from '@/core/helpers/numberFormatHelper';
import { getCurrency } from '@/modules/settings/components/currencyList';
import { buyContracts } from './tokenList';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook.vue';
import MoonpayTokenSelect from '@/modules/moon-pay/components/MoonPayTokenSelect.vue';

export default {
  name: 'ModuleBuyEth',
  components: { ModuleAddressBook, MoonpayTokenSelect },
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
  data() {
    return {
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
      showMoonpay: true,
      disableCurrencySelect: true
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
        this.selectedCurrency.symbol
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
      return !isEmpty(this.fetchedData)
        ? this.fetchedData[0].prices.find(
            item => item.fiat_currency === this.selectedFiatName
          )
        : { crypto_currency: 'ETH', fiat_currency: 'USD', price: '3379.08322' };
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
      return this.selectedCurrency.symbol;
    },
    isEUR() {
      return this.selectedFiatName === 'EUR' || this.selectedFiatName === 'GBP';
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
      if (this.min.gt(this.amount)) {
        return `Amount can't be below provider's minimum: ${
          formatFiatValue(this.min.toFixed(), this.currencyConfig).value
        } ${this.selectedFiatName}`;
      }
      if (this.maxVal.lt(this.amount)) {
        return `Amount can't be above provider's maximum: ${
          formatFiatValue(this.maxVal.toFixed(), this.currencyConfig).value
        } ${this.selectedFiatName}`;
      }
      return '';
    },
    currencyErrorMessages() {
      if (!this.supportedBuy) {
        return 'Please switch your network to the Ethereum Mainnet on Metamask.';
      }
      return '';
    },
    tokens() {
      if (this.inWallet) {
        return buyContracts.reduce((arr, item) => {
          const inList = this.tokensList.find(t => {
            if (t.contract.toLowerCase() === item.toLowerCase()) return t;
          });
          if (inList) {
            arr.push(inList);
            return arr;
          }
          const token = this.contractToToken(item);
          if (token) arr.push(token);
          return arr;
        }, []);
      }
      const arr = new Array();
      for (const contract of buyContracts) {
        const token = this.contractToToken(contract);
        if (token) arr.push(token);
      }
      return arr;
    },
    currencyItems() {
      if (!this.supportedBuy) return;
      const tokensListWPrice =
        this.currencyRates.length > 0
          ? this.tokens.map(token => {
              const priceRate = this.currencyRates.find(rate => {
                return rate.crypto_currency === token.symbol;
              });
              const actualPrice = priceRate?.quotes.find(quote => {
                return quote.fiat_currency === this.selectedFiatName;
              });
              token.price = formatFiatValue(
                actualPrice ? actualPrice.price : '0',
                this.currencyConfig
              ).value;
              token.value = token.name;
              token.name = token.symbol;
              return token;
            })
          : this.tokens;
      const returnedArray = [
        {
          text: 'Select Token',
          divider: true,
          selectLabel: true
        },
        ...tokensListWPrice
      ];
      return returnedArray;
    },
    hasData() {
      return !isEmpty(this.fetchedData);
    },
    cryptoToFiat() {
      return this.showMoonpay
        ? this.moonpayCryptoAmount
        : this.simplexCryptoAmount;
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
      const arrItems = this.hasData
        ? this.fetchedData[0].fiat_currencies.filter(item => item !== 'RUB')
        : ['USD'];
      return getCurrency(arrItems);
    },
    max() {
      if (this.hasData) {
        const moonpayMax = this.fetchedData[0]?.limits.find(
          item => item.fiat_currency === this.selectedFiatName
        );
        const simplexMax = this.fetchedData[1]?.limits.find(
          item => item.fiat_currency === this.selectedFiatName
        );
        return {
          moonpay: moonpayMax
            ? BigNumber(moonpayMax.limit.max)
            : BigNumber(12000),
          simplex: simplexMax
            ? BigNumber(simplexMax.limit.max)
            : BigNumber(12000)
        };
      }
      return {
        moonpay: BigNumber(12000),
        simplex: BigNumber(12000)
      };
    },
    maxVal() {
      const moonpayMax = this.max.moonpay;
      const simplexMax = this.max.simplex;
      const maxVal = Math.max(moonpayMax.toString(), simplexMax.toString());
      return BigNumber(maxVal);
    },
    min() {
      if (this.hasData) {
        const foundLimit = this.fetchedData[0].limits.find(
          item => item.fiat_currency === this.selectedFiatName
        );
        return foundLimit ? BigNumber(foundLimit.limit.min) : BigNumber(30);
      }
      return BigNumber(30);
    },
    hideSimplex() {
      return (
        this.selectedCryptoName === 'USDC' || this.selectedCryptoName === 'USDT'
      );
    }
  },
  watch: {
    selectedCurrency: {
      handler: function (newVal, oldVal) {
        const supportedCoins = {
          ETH: 'ETH',
          BNB: 'BNB',
          MATIC: 'MATIC'
        };
        if (
          !newVal ||
          (newVal?.contract?.toLowerCase() === MAIN_TOKEN_ADDRESS &&
            !supportedCoins[newVal.symbol])
        ) {
          this.selectedCurrency = oldVal;
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
          this.amount = newVal.name != 'JPY' ? '300' : '30000';
          this.$emit('selectedFiat', newVal);
        }
      },
      deep: true
    },
    network: {
      handler: function () {
        this.selectedCurrency = {};
        this.selectedCurrency = this.defaultCurrency;
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
        const simplexMax = this.max.simplex;
        this.checkMoonPayMax();
        if (
          simplexMax.lt(newVal) ||
          isEmpty(newVal) ||
          this.min.gt(newVal) ||
          isNaN(newVal)
        ) {
          this.loading = true;
        } else {
          this.loading = false;
          this.getSimplexQuote();
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
    }
  },
  mounted() {
    // Watch for currency menu isActive
    const selectedCurrencyRef = this.$refs.selectedCurrency;
    const menuRef = selectedCurrencyRef.$children[0].$refs.menu;
    this.$watch(
      () => {
        return menuRef.isActive;
      },
      val => {
        // If menu is closed make sure search is cleared
        if (!val) {
          if (
            selectedCurrencyRef.search !== '' ||
            selectedCurrencyRef.selectItems.length === 0
          )
            selectedCurrencyRef.search = '';
        }
      }
    );

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
        ETH: 'ETH',
        BNB: 'BSC',
        MATIC: 'MATIC'
      };
      const nodeType = !supportedNodes[this.selectedCurrency?.symbol]
        ? 'ETH'
        : supportedNodes[this.selectedCurrency.symbol];
      const node = nodeList[nodeType];
      if (!this.web3Connections[nodeType]) {
        const web3 = new Web3(node[0].url);
        this.web3Connections[nodeType] = web3;
      }
      this.gasPrice = await this.web3Connections[nodeType].eth.getGasPrice();
    },
    isLT(num, num2) {
      return BigNumber(num).lt(num2);
    },
    isValidToAddress(address) {
      return MultiCoinValidator.validate(address, this.selectedCurrency.symbol);
    },
    checkMoonPayMax() {
      const moonpayMax = this.max.moonpay;
      const hideMoonpay = this.isLT(moonpayMax, this.amount);
      this.$emit('hideMoonpay', hideMoonpay);
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
          this.orderHandler.getFiatRatesForBuy().then(res => {
            this.currencyRates = cloneDeep(res);
            this.loading = false;
            this.disableCurrencySelect = false;
          });
          this.fetchedData = Object.assign({}, res);
        })
        .catch(e => {
          Toast(e, {}, ERROR);
        });
      this.getSimplexQuote();
    },
    getSimplexQuote() {
      if (
        this.hideSimplex ||
        !this.actualValidAddress ||
        isEmpty(this.amount) ||
        this.min.gt(this.amount) ||
        isNaN(this.amount) ||
        this.maxVal.lt(this.amount) ||
        this.amountErrorMessages !== ''
      )
        return;
      this.loading = true;
      this.disableCurrencySelect = true;
      this.simplexQuote = {};
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
          this.compareQuotes();
        })
        .catch(e => {
          Toast(e, {}, ERROR);
        });
    },
    compareQuotes() {
      const moonpayMax = this.max.moonpay;
      // Moonpay has better rate and is not above max
      this.showMoonpay = this.isLT(moonpayMax, this.amount) // max < amount
        ? false
        : this.isLT(this.simplexQuote.crypto_amount, this.moonpayCryptoAmount);
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
      this.checkMoonPayMax();
      this.$emit('success', [
        this.simplexQuote,
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
  height: 56px;
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
    height: 47px !important;
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
