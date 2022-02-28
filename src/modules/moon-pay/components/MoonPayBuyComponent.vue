<template>
  <div class="pt-10 px-8">
    <!-- ============================================================== -->
    <!-- Currency Select -->
    <!-- ============================================================== -->
    <mew-select
      label="Currency"
      :items="currencyItems"
      :value="selectedCurrency"
      :disabled="loading"
      is-custom
      @input="setCurrency"
    />

    <!-- ============================================================== -->
    <!-- Fiat currency select -->
    <!-- ============================================================== -->
    <div class="d-flex align-center justify-space-between mt-3 mb-3">
      <div class="font-weight-medium">Select amount</div>
      <div class="d-flex align-center justify-end">
        <img
          :src="require(`@/assets/images/currencies/${selectedFiat}.svg`)"
          class="icon-holder"
        />
        <v-select
          v-model="selectedFiat"
          style="margin-top: -1px; max-width: 85px"
          hide-details
          :items="fiatCurrencyItems"
          :disabled="loading"
          dense
          solo
          flat
          append-icon="mdi-chevron-down"
        >
          <template #item="data">
            <div class="d-flex align-center">
              <img
                :src="require(`@/assets/images/currencies/${data.item}.svg`)"
                class="icon-holder mr-2"
              />
              {{ data.item }}
            </div>
          </template>
        </v-select>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- Fiat currency pre-selection buttons -->
    <!-- ============================================================== -->
    <v-row dense>
      <v-col v-for="(button, bkey) in buttons" :key="bkey" cols="6">
        <mew-button
          style="height: 96px !important"
          has-full-width
          btn-style="outline"
          color-theme="basic"
          class="not-selected"
          :disabled="loading"
          @click.native="buy(button)"
        >
          <div v-if="!loading" class="py-5">
            <!-- Button top text -->
            <div class="mb-1">
              <div class="letter-spacing--none mew-heading-1 textDark--text">
                {{ button.fiatFormatted ? button.fiatFormatted : button.title }}
              </div>
            </div>

            <!-- Button bottom text -->
            <div>
              <div class="letter-spacing--none mew-label textMedium--text">
                {{ button.subTitle }}
              </div>
            </div>
          </div>
          <div v-else class="py-5">
            <div class="mb-1">
              <v-skeleton-loader type="heading" height="32px" width="172px" />
            </div>
            <div>
              <v-skeleton-loader type="text" height="16px" width="172px" />
            </div>
          </div>
        </mew-button>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { isEmpty } from 'lodash';
import BigNumber from 'bignumber.js';
import { LOCALE } from '../helpers';
import { mapGetters, mapState, mapActions } from 'vuex';
import { cloneDeep, isEqual } from 'apollo-utilities';
export default {
  name: 'ModuleBuyEth',
  props: {
    handler: {
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
      selectedFiat: 'USD',
      fetchedData: {},
      currencyRates: []
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    ...mapState('wallet', ['tokens']),
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
          network: 1
        },
        {
          decimals: 18,
          img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/MATIC-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee-matic.png',
          name: 'MATIC',
          subtext: 'Polygon',
          value: 'Polygon',
          symbol: 'MATIC (Matic)',
          network: 137
        },
        {
          decimals: 18,
          img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/BNB-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
          name: 'BNB',
          subtext: 'Binance Smart Chain',
          value: 'Binance Smart Chain',
          symbol: 'BNB (BSC/BEP20)',
          network: 56
        },
        {
          decimals: 6,
          img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/USDT-0xdAC17F958D2ee523a2206206994597C13D831ec7-eth.png',
          name: 'USDT',
          subtext: 'Tether',
          value: 'Tether',
          symbol: 'USDT (ERC20)',
          network: 1
        },
        {
          decimals: 6,
          img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/USDC-0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48-eth.svg',
          name: 'USDC',
          subtext: 'USD Coin',
          value: 'USD Coin',
          symbol: 'USDC (ERC20)',
          network: 1
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
                return quote.fiat_currency === this.selectedFiat;
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
    fiatCurrencyItems() {
      return this.hasData
        ? this.fetchedData.fiat_currencies.filter(item => item !== 'RUB')
        : ['USD'];
    },
    max() {
      if (this.hasData) {
        const foundLimit = this.fetchedData.limits.find(
          item => item.fiat_currency === this.selectedFiat
        );
        return foundLimit ? BigNumber(foundLimit.limit.max) : BigNumber(12000);
      }
      return BigNumber(12000);
    },
    fiatConversion() {
      if (this.hasData) {
        const fiatConversion = this.fetchedData.conversion_rates.find(
          item => item.fiat_currency === this.selectedFiat
        );
        return fiatConversion
          ? BigNumber(fiatConversion.exchange_rate)
          : BigNumber(1);
      }
      return BigNumber(1);
    },
    currencyPriceFromProvider() {
      if (this.hasData) {
        const selectedCurrencyPrice = this.fetchedData.prices.find(
          item => item.fiat_currency === this.selectedFiat
        );
        return selectedCurrencyPrice
          ? BigNumber(selectedCurrencyPrice.price)
          : BigNumber(1);
      }
      return BigNumber(1);
    },
    buttons() {
      if (this.hasData) {
        return [
          {
            id: '1',
            fiat: this.fiatConversion.times(100).toString(),
            fiatFormatted: this.currencyFormatter(
              this.fiatConversion.times(100).toString()
            ),
            subTitle: `~${BigNumber(100)
              .div(this.currencyPriceFromProvider.decimalPlaces(2))
              .decimalPlaces(4)
              .toString()} ${this.selectedCurrency.name}`
          },
          {
            id: '2',
            fiat: this.fiatConversion.times(250).toString(),
            fiatFormatted: this.currencyFormatter(
              this.fiatConversion.times(250).toString()
            ),
            subTitle: `~${BigNumber(250)
              .div(this.currencyPriceFromProvider.decimalPlaces(2))
              .decimalPlaces(4)
              .toString()} ${this.selectedCurrency.name}`
          },
          {
            id: '3',
            fiat: this.fiatConversion.times(500).toString(),
            fiatFormatted: this.currencyFormatter(
              this.fiatConversion.times(500).toString()
            ),
            subTitle: `~${BigNumber(500)
              .div(this.currencyPriceFromProvider.decimalPlaces(2))
              .decimalPlaces(4)
              .toString()} ${this.selectedCurrency.name}`
          },
          {
            id: '4',
            fiat: this.fiatConversion.times(1000).toString(),
            fiatFormatted: this.currencyFormatter(
              this.fiatConversion.times(1000).toString()
            ),
            subTitle: `~${BigNumber(1000)
              .div(this.currencyPriceFromProvider.decimalPlaces(2))
              .decimalPlaces(4)
              .toString()} ${this.selectedCurrency.name}`
          },
          {
            id: '5',
            fiat: this.fiatConversion.times(5000).toString(),
            fiatFormatted: this.currencyFormatter(
              this.fiatConversion.times(5000).toString()
            ),
            subTitle: `~${BigNumber(5000)
              .div(this.currencyPriceFromProvider.decimalPlaces(2))
              .decimalPlaces(4)
              .toString()} ${this.selectedCurrency.name}`
          },
          {
            id: '6',
            title: 'Custom',
            subTitle: `Up to ${this.currencyFormatter(this.max)}`
          }
        ];
      }
      return [
        { id: '1', fiat: '100', fiatFormatted: '$100', subTitle: '0.16 ETH' },
        { id: '2', fiat: '250', fiatFormatted: '$250', subTitle: '0.16 ETH' },
        { id: '3', fiat: '500', fiatFormatted: '$500', subTitle: '0.16 ETH' },
        { id: '4', fiat: '1000', fiatFormatted: '$1000', subTitle: '0.16 ETH' },
        { id: '5', fiat: '5000', fiatFormatted: '$5000', subTitle: '0.16 ETH' },
        { id: '6', title: 'Custom', subTitle: `Up to $12,000` }
      ];
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
    network: {
      handler: function () {
        this.selectedCurrency = this.defaultCurrency;
      },
      deep: true
    }
  },
  mounted() {
    this.fetchCurrencyData();
  },
  methods: {
    ...mapActions('global', ['setNetwork']),
    currencyFormatter(value) {
      const locale = this.hasData ? LOCALE[this.selectedFiat] : 'en-US';
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: this.selectedFiat
      }).format(value);
    },
    setCurrency(e) {
      this.selectedCurrency = e;
    },
    reset() {
      this.selectedFiat = 'USD';
      this.loading = true;
      this.fetchData = {};
    },
    fetchCurrencyData() {
      this.reset();
      this.handler
        .getSupportedFiatToBuy(this.selectedCurrency.name)
        .then(res => {
          this.handler.getFiatRatesForBuy().then(res => {
            this.currencyRates = cloneDeep(res);
            this.loading = false;
          });
          this.fetchedData = Object.assign({}, res);
        })
        .catch(e => {
          Toast(e, {}, ERROR);
        });
    },
    buy(btn) {
      const amount = btn.hasOwnProperty('fiat') ? btn.fiat.toString() : null;
      this.handler
        .buy(this.selectedCurrency.name, this.selectedFiat, amount)
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
</style>
