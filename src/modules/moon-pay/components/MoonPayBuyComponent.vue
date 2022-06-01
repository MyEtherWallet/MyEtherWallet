<template>
  <div class="py-8 px-8">
    <!-- ============================================================== -->
    <!-- Currency Select -->
    <!-- ============================================================== -->
    <div class="mb-2">
      <div class="mew-heading-3 textDark--text mb-5">Select currency</div>
      <mew-select
        label="Currency"
        :items="currencyItems"
        :value="selectedCurrency"
        :disabled="loading"
        is-custom
        @input="setCurrency"
      />
    </div>

    <div class="mb-11">
      <div class="mew-heading-3 textDark--text mb-5">
        How much do you want to spend?
      </div>
      <div class="d-flex align-center">
        <mew-input
          v-model="amount"
          :error-messages="amountErrorMessages"
          class="mr-2"
        />
        <mew-select
          v-model="selectedFiat"
          :items="fiatCurrencyItems"
          is-custom
          class="selectedFiat"
        />
      </div>
      <div class="d-flex align-center">
        <mew-button
          btn-style="outline"
          title="Min"
          class="mr-2 flex-grow-1"
          @click.native="setMin"
        />
        <mew-button
          btn-style="outline"
          title="Max"
          class="flex-grow-1"
          @click.native="setMax"
        />
      </div>
    </div>
    <div class="mb-3">
      <div class="mew-heading-3 textDark--text mb-5">Select Provider</div>
      <div
        v-if="!hideSimplex"
        class="section-block pa-5"
        :class="{ selected: isMoonpay }"
        @click="selectMoonpay"
      >
        <img
          class="provider-logo"
          src="@/modules/moon-pay/assets/moonpay-logo.svg"
          height="18"
        />
        <div v-if="!loading" class="mb-1">
          <div class="d-flex mb-1 align-center justify-space-between">
            <div class="d-flex mew-heading-3 textDark--text">
              {{ cryptoToFiat }}
              <span class="mew-heading-3 pl-1">{{ selectedCryptoName }}</span>
            </div>
          </div>
          <div class="d-flex align-center">
            <div class="mr-1 textDark--text">≈ {{ plusFeeF }}</div>
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
        </div>

        <div v-else class="mb-1">
          <v-skeleton-loader type="heading" class="mb-1" />
          <v-skeleton-loader max-width="200px" type="heading" />
        </div>

        <div class="d-flex align-center mb-1">
          <img
            src="@/assets/images/icons/moonpay/icon-visa.svg"
            alt="Visa"
            height="24"
            class="mr-2"
          />
          <img
            src="@/assets/images/icons/moonpay/icon-master.svg"
            alt="Master"
            height="24"
            class="mr-2"
          />
          <img
            src="@/assets/images/icons/moonpay/icon-apple-pay.svg"
            alt="Master"
            height="24"
            class="mr-2"
          />
          <img
            v-if="isEUR"
            src="@/assets/images/icons/moonpay/icon-bank.svg"
            alt="Bank"
            height="24"
          />
        </div>
        <div class="mew-label mb-5">
          {{ paymentOptionString }}
        </div>
      </div>
    </div>

    <div
      v-if="!hideSimplex"
      class="section-block pa-5"
      :class="{ selected: isSimplex }"
      @click="selectSimplex"
    >
      <div class="mew-heading-3 textDark--text mb-5">Check for rates</div>
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-start mb-1">
          <img
            src="@/assets/images/icons/moonpay/icon-visa.svg"
            alt="Visa"
            height="24"
            class="mr-2"
          />
          <img
            src="@/assets/images/icons/moonpay/icon-master.svg"
            alt="Master"
            height="24"
            class="mr-2"
          />
        </div>
        <img
          class="provider-logo"
          src="@/assets/images/icons/icon-simplex.svg"
          alt="simplex"
          height="28"
        />
      </div>
      <div class="mew-label mb-5">Visa, Mastercard</div>
    </div>
    <!------ WEN USER IS NOT IN WALLET, SHOW BELOW -------->
    <div v-if="!inWallet" class="mt-5">
      <div class="mew-heading-3 textDark--text mb-5">
        Where should we send your crypto?
      </div>
      <module-address-book @setAddress="setAddress" />
      <mew-button
        v-if="!isSimplex"
        has-full-width
        :disabled="!validToAddress || !isMoonpay || disableMoonPay"
        :is-valid-address-func="isValidToAddress"
        :title="moonpayBtnTitle"
        @click.native="buyFromHome"
      />
      <mew-button
        v-if="isSimplex"
        has-full-width
        :disabled="!validToAddress || !isSimplex || disableSimplex"
        :is-valid-address-func="isValidToAddress"
        :title="simplexBtnTitle"
        @click.native="openSimplexFromHome"
      />
    </div>
    <!------ WEN USER IS IN WALLET, SHOW BELOW -------->
    <div v-else class="pa-5">
      <mew-button
        v-if="!isSimplex"
        has-full-width
        :disabled="!isMoonpay || disableMoonPay"
        :title="moonpayBtnTitle"
        @click.native="buy"
      />
      <mew-button
        v-if="isSimplex"
        has-full-width
        :disabled="!isSimplex || disableSimplex"
        :title="simplexBtnTitle"
        @click.native="openSimplex"
      />
    </div>
  </div>
</template>

<script>
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';
import MultiCoinValidator from 'multicoin-address-validator';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { isEmpty, cloneDeep, isEqual } from 'lodash';
import BigNumber from 'bignumber.js';
import { mapGetters, mapActions, mapState } from 'vuex';
import { fromWei } from 'web3-utils';
import Web3 from 'web3';
import nodeList from '@/utils/networks';
import {
  formatFloatingPointValue,
  formatFiatValue
} from '@/core/helpers/numberFormatHelper';
import { getCurrency } from '@/modules/settings/components/currencyList';
export default {
  name: 'ModuleBuyEth',
  components: { ModuleAddressBook },
  props: {
    moonpayHandler: {
      type: Object,
      default: () => {}
    },
    close: {
      type: Function,
      default: () => {}
    },
    defaultCurrency: {
      type: Object,
      default: () => {}
    },
    inWallet: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
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
      isMoonpay: false,
      isSimplex: false
    };
  },
  computed: {
    ...mapGetters('global', ['network', 'getFiatValue']),
    ...mapState('wallet', ['address']),
    ...mapState('external', ['currencyRate']),
    includesFeeText() {
      return `Includes ${this.percentFee} fee (${
        formatFiatValue(this.minFee, this.currencyConfig).value
      } min)`;
    },
    networkFeeText() {
      return `${
        this.selectedCurrency.name
      } network fee (for transfers to your wallet) ~${
        formatFiatValue(this.networkFeeToFiat, this.currencyConfig).value
      }`;
    },
    dailyLimit() {
      const value = BigNumber(this.fiatMultiplier).times(12000);
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
          : BigNumber(1);
      }
      return BigNumber(1);
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
      return this.selectedCurrency.name;
    },
    isEUR() {
      return this.selectedFiatName === 'EUR' || this.selectedFiatName === 'GBP';
    },
    hideSimplex() {
      return (
        this.selectedCryptoName === 'USDC' || this.selectedCryptoName === 'USDT'
      );
    },
    disableSimplex() {
      const simplexMax = this.max.simplex;
      // simplexMax.lt(BigNumber(this.amount));
      return (
        (!this.inWallet && !this.actualValidAddress) ||
        this.loading ||
        this.amountErrorMessages !== '' ||
        simplexMax.lt(BigNumber(this.amount))
      );
    },
    simplexBtnTitle() {
      const simplexMax = this.max.simplex;
      if (simplexMax.lt(BigNumber(this.amount))) {
        return `CANNOT EXCEED PROVIDER MAX OF ${simplexMax}`;
      }
      return 'CONTINUE WITH SIMPLEX';
    },
    disableMoonPay() {
      const moonpayMax = this.max.moonpay;
      return (
        (!this.inWallet && !this.actualValidAddress) ||
        this.loading ||
        this.amountErrorMessages !== '' ||
        moonpayMax.lt(BigNumber(this.amount))
      );
    },
    moonpayBtnTitle() {
      const moonpayMax = this.max.moonpay;
      if (moonpayMax.lt(BigNumber(this.amount))) {
        return `CANNOT EXCEED PROVIDER MAX OF ${moonpayMax}`;
      }
      return 'CONTINUE WITH MOONPAY';
    },
    // disableMax() {
    //   const simplexMax = this.max.simplex;
    //   return simplexMax.lt(BigNumber(this.amount));
    // },
    paymentOptionString() {
      return `Visa, Mastercard, Apple Pay${this.isEUR ? ', Bank account' : ''}`;
    },
    amountErrorMessages() {
      const moonpayMax = this.max.moonpay;
      const simplexMax = this.max.simplex;
      if (BigNumber(this.amount).isNaN() || BigNumber(this.amount).eq(0)) {
        return 'Amount required';
      }
      if (BigNumber(this.amount).lt(0)) {
        return `Amount can't be negative`;
      }
      if (this.min.gt(this.amount)) {
        return `Amount can't be below provider's minimum: ${this.min.toFixed()} ${
          this.selectedFiatName
        }`;
      }
      if (
        moonpayMax.lt(BigNumber(this.amount)) &&
        simplexMax.lt(BigNumber(this.amount))
      ) {
        return `Amount can't be above provider's maximum: ${simplexMax.toFixed()} ${
          this.selectedFiatName
        }`;
      }
      return '';
    },
    currencyItems() {
      // hard writing for now
      const tokensList = [
        {
          decimals: 18,
          img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/ETH-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg',
          name: 'ETH',
          subtext: 'Ethereum',
          value: 'Ethereum',
          symbol: 'ETH',
          network: 'ETH'
        },
        {
          decimals: 18,
          img: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912',
          name: 'MATIC',
          subtext: 'Polygon',
          value: 'Polygon (Matic)',
          symbol: 'MATIC (Matic)',
          network: 'MATIC'
        },
        {
          decimals: 18,
          img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/BNB-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
          name: 'BNB',
          subtext: 'Binance Smart Chain',
          value: 'Binance Smart Chain',
          symbol: 'BNB (BSC/BEP20)',
          network: 'BSC'
        },
        {
          decimals: 6,
          img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/USDT-0xdAC17F958D2ee523a2206206994597C13D831ec7-eth.png',
          name: 'USDT',
          subtext: 'Tether',
          value: 'Tether',
          symbol: 'USDT (ERC20)',
          network: 'ETH'
        },
        {
          decimals: 6,
          img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/USDC-0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48-eth.svg',
          name: 'USDC',
          subtext: 'USD Coin',
          value: 'USD Coin',
          symbol: 'USDC (ERC20)',
          network: 'ETH'
        }
      ];
      const imgs = tokensList.map(item => {
        return item.img;
      });
      const tokensListWPrice =
        this.currencyRates.length > 0
          ? tokensList.map(token => {
              const priceRate = this.currencyRates.find(rate => {
                return rate.crypto_currency === token.name;
              });
              const actualPrice = priceRate.quotes.find(quote => {
                return quote.fiat_currency === this.selectedFiatName;
              });

              token.price = formatFiatValue(
                actualPrice ? actualPrice.price : '0',
                this.currencyConfig
              ).value;
              return token;
            })
          : tokensList;
      const returnedArray = [
        {
          text: 'Select Token',
          imgs: imgs.splice(0, 3),
          total: `${tokensList.length}`,
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
      return formatFloatingPointValue(
        BigNumber(this.plusFee).div(this.priceOb.price).toString()
      ).value;
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
    min() {
      if (this.hasData) {
        const foundLimit = this.fetchedData[0].limits.find(
          item => item.fiat_currency === this.selectedFiatName
        );
        return foundLimit ? BigNumber(foundLimit.limit.min) : BigNumber(30);
      }
      return BigNumber(30);
    }
  },
  watch: {
    selectedCurrency: {
      handler: function (newVal, oldVal) {
        if (!isEqual(newVal, oldVal)) {
          this.fetchCurrencyData();
        }

        this.$emit('selectedCurrency', newVal);
      },
      deep: true
    },
    selectedFiat: {
      handler: function (newVal, oldVal) {
        if (!isEqual(newVal, oldVal)) {
          const selectedCurrencyPrice =
            this.fetchedData[0].conversion_rates.find(
              item => item.fiat_currency === oldVal.name
            );
          const revertedVal = BigNumber(this.amount).div(
            selectedCurrencyPrice.exchange_rate
          );
          const value = BigNumber(revertedVal)
            .times(this.fiatMultiplier)
            .dp(0)
            .toFixed();
          this.amount = value;
        }
      },
      deep: true
    },
    network: {
      handler: function () {
        this.selectedCurrency = this.defaultCurrency;
      },
      deep: true
    },
    moonpayHandler: {
      handler: function () {
        this.fetchCurrencyData();
      },
      deep: true
    },
    amount: {
      handler: function (newVal) {
        const simplexMax = this.max.simplex;
        if (simplexMax.lt(newVal)) {
          this.loading = true;
        } else {
          this.loading = false;
        }
      }
    }
  },
  mounted() {
    this.fetchCurrencyData();
  },
  methods: {
    ...mapActions('global', ['setNetwork']),
    async fetchGasPrice() {
      const nodeType = this.selectedCurrency.hasOwnProperty('network')
        ? this.selectedCurrency.network
        : this.selectedCurrency.name;
      const node = nodeList[nodeType];
      if (!this.web3Connections[nodeType]) {
        const web3 = new Web3(node[0].url);
        this.web3Connections[nodeType] = web3;
      }
      this.gasPrice = await this.web3Connections[nodeType].eth.getGasPrice();
    },
    setAddress(address, valid) {
      this.acutalAddress = address;
      this.toAddress = address;
      this.validToAddress = valid;
    },
    isValidToAddress(address) {
      return MultiCoinValidator.validate(address, this.selectedCurrency.name);
    },
    selectMoonpay() {
      this.isMoonpay = true;
      this.isSimplex = false;
    },
    selectSimplex() {
      this.isSimplex = true;
      this.isMoonpay = false;
    },
    openSimplex() {
      // eslint-disable-next-line
      window.open(
        `https://ccswap.myetherwallet.com/#/?fiat=${this.selectedFiatName.toLowerCase()}&amount=${
          this.amount
        }&to=${this.actualAddress}`,
        '_blank'
      );
    },
    openSimplexFromHome() {
      // eslint-disable-next-line
      window.open(
        `https://ccswap.myetherwallet.com/#/?fiat=${this.selectedFiatName.toLowerCase()}&amount=${
          this.amount
        }&to=${this.toAddress}`,
        '_blank'
      );
    },
    setMin() {
      this.amount = this.min.toFixed();
    },
    setMax() {
      const simplexMax = this.max.simplex;
      this.amount = simplexMax.toString();
    },
    setCurrency(e) {
      this.selectedCurrency = e;
    },
    reset() {
      this.selectedFiat = {
        name: 'USD',
        value: 'USD',
        // eslint-disable-next-line
        img: require(`@/assets/images/currencies/USD.svg`)
      };
      this.loading = true;
      this.fetchData = {};
    },
    fetchCurrencyData() {
      this.loading = true;
      this.fetchData = {};
      this.fetchGasPrice();
      this.moonpayHandler
        .getSupportedFiatToBuy(this.selectedCurrency.name)
        .then(res => {
          this.moonpayHandler.getFiatRatesForBuy().then(res => {
            this.currencyRates = cloneDeep(res);
            this.loading = false;
            this.selectMoonpay();
          });
          this.fetchedData = Object.assign({}, res);
        })
        .catch(e => {
          Toast(e, {}, ERROR);
        });
    },
    buy() {
      this.moonpayHandler
        .buy(
          this.selectedCurrency.name,
          this.selectedFiatName,
          this.amount,
          this.actualAddress
        )
        .then(() => {
          this.reset();
          this.close();
          this.selectedCurrency = this.defaultCurrency;
        })
        .catch(err => {
          this.reset();
          Toast(err, {}, ERROR);
          this.close();
          this.selectedCurrency = this.defaultCurrency;
        });
    },
    buyFromHome() {
      this.moonpayHandler
        .buy(
          this.selectedCurrency.name,
          this.selectedFiatName,
          this.amount,
          this.toAddress
        )
        .then(() => {
          this.reset();
          this.close();
          this.selectedCurrency = this.defaultCurrency;
        })
        .catch(err => {
          this.reset();
          Toast(err, {}, ERROR);
          this.close();
          this.selectedCurrency = this.defaultCurrency;
        });
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
.selectedFiat {
  max-width: 120px;
}
</style>
