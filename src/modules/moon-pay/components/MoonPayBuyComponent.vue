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
    <div v-if="!inWallet" class="mb-6">
      <module-address-book
        ref="toAddress"
        label="To Address"
        :is-valid-address-func="isValidToAddress"
        is-home-page
        @setAddress="setAddress"
      />
    </div>
    <div class="mb-6">
      <div class="mew-heading-3 textDark--text mb-5">Select Provider</div>

      <div class="section-block pa-5">
        <div class="d-flex align-center justify-space-between mb-2">
          <div>You will get</div>
          <img src="@/modules/moon-pay/assets/moonpay-logo.svg" height="18" />
        </div>

        <div v-if="!loading && !disableMoonPay" class="mb-4">
          <div class="mew-heading-2 textDark--text mb-1">
            {{ cryptoToFiat }}
            <span class="mew-heading-3">{{ selectedCryptoName }}</span>
          </div>
          <div class="d-flex align-center">
            <div class="mr-1 textDark--text">≈ {{ plusFeeF }}</div>
            <mew-tooltip style="height: 22px">
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

        <div v-else class="mb-4">
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
        <mew-button
          has-full-width
          title="BUY WITH MOONPAY"
          :disabled="disableMoonPay"
          @click.native="buy"
        />
      </div>
    </div>

    <div class="section-block pa-5">
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
          src="@/assets/images/icons/icon-simplex.svg"
          alt="simplex"
          height="28"
        />
      </div>
      <div class="mew-label mb-5">Visa, Mastercard</div>
      <mew-button
        has-full-width
        btn-style="outline"
        :disabled="disableSimplex"
        title="CLICK FOR RATES"
        @click.native="openSimplex"
      />
    </div>
  </div>
</template>

<script>
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';
import MultiCoinValidator from 'multicoin-address-validator';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { isEmpty } from 'lodash';
import BigNumber from 'bignumber.js';
import { LOCALE } from '../helpers';
import { mapGetters, mapActions, mapState } from 'vuex';
import { cloneDeep, isEqual } from 'apollo-utilities';
import { fromWei } from 'web3-utils';
import Web3 from 'web3';
import nodeList from '@/utils/networks';
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
      gasPrice: '0'
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    ...mapState('wallet', ['address']),
    includesFeeText() {
      return `Includes ${this.percentFee} fee (${this.currencyFormatter(
        this.minFee
      )} min)`;
    },
    networkFeeText() {
      return `Ethereum network fee (for transfers to your wallet) ~${this.currencyFormatter(
        this.networkFeeToFiat
      )}`;
    },
    dailyLimit() {
      const value = BigNumber(this.fiatMultiplier).times(10000);
      return `Daily limit: ${this.currencyFormatter(value.toString())}`;
    },
    monthlyLimit() {
      const value = BigNumber(this.fiatMultiplier).times(50000);
      return `Monthly limit: ${this.currencyFormatter(value.toString())}`;
    },
    fiatMultiplier() {
      if (this.hasData) {
        const selectedCurrencyPrice = this.fetchedData.conversion_rates.find(
          item => item.fiat_currency === this.selectedFiatName
        );
        return selectedCurrencyPrice
          ? BigNumber(selectedCurrencyPrice.exchange_rate)
          : BigNumber(1);
      }
      return BigNumber(1);
    },
    inWallet() {
      return (
        this.$route.fullPath.includes('/wallet') && !this.$route.meta.noAuth
      );
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
        ? this.fetchedData.prices.find(
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
        ? fee.plus(this.amount)
        : fee.plus(this.minFee).plus(this.amount);
      return withFee.plus(this.networkFeeToFiat).toString();
    },
    plusFeeF() {
      return this.currencyFormatter(this.plusFee);
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
    disableSimplex() {
      return (
        ((this.selectedCryptoName === 'USDC' ||
          this.selectedCryptoName === 'USDT') &&
          this.amountErrorMessages !== '') ||
        (!this.inWallet && !this.actualValidAddress)
      );
    },
    disableMoonPay() {
      return (
        this.amountErrorMessages !== '' ||
        (!this.inWallet && !this.actualValidAddress)
      );
    },
    paymentOptionString() {
      return `Visa, Mastercard, Apple Pay${this.isEUR ? ', Bank account' : ''}`;
    },
    amountErrorMessages() {
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
      if (this.max.lt(this.amount)) {
        return `Amount can't be above provider's maximum: ${this.max.toFixed()} ${
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

              token.price = this.currencyFormatter(
                actualPrice ? actualPrice.price : '0'
              );
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
      return BigNumber(this.amount).div(this.priceOb.price).toString();
    },
    fiatCurrencyItems() {
      const arrItems = this.hasData
        ? this.fetchedData.fiat_currencies.filter(item => item !== 'RUB')
        : ['USD'];
      return arrItems.map(item => {
        return {
          name: item,
          value: item,
          // eslint-disable-next-line
          img: require(`@/assets/images/currencies/${item}.svg`)
        };
      });
    },
    max() {
      if (this.hasData) {
        const foundLimit = this.fetchedData.limits.find(
          item => item.fiat_currency === this.selectedFiatName
        );
        return foundLimit ? BigNumber(foundLimit.limit.max) : BigNumber(12000);
      }
      return BigNumber(12000);
    },
    min() {
      if (this.hasData) {
        const foundLimit = this.fetchedData.limits.find(
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
          const selectedCurrencyPrice = this.fetchedData.conversion_rates.find(
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
      const web3 = new Web3(node[0].url);
      const gasPrice = await web3.eth.getGasPrice();
      this.gasPrice = gasPrice;
    },
    setAddress(address, valid) {
      this.toAddress = address;
      this.validToAddress = valid;
    },
    isValidToAddress(address) {
      return MultiCoinValidator.validate(address, this.selectedCurrency.name);
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
    setMin() {
      this.amount = this.min.toFixed();
    },
    setMax() {
      this.amount = this.max.toFixed();
    },
    currencyFormatter(value) {
      const locale = this.hasData ? LOCALE[this.selectedFiatName] : 'en-US';
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: this.selectedFiatName
      }).format(value);
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
  width: 18px;
  height: 18px;
}

.section-block {
  border-radius: 8px;
  border: 1px solid var(--v-greyMedium-base);
}
</style>
