<template>
  <div class="mew-component--mobule-buy-eth pt-10 custom-scroll-bar">
    <!-- ============================================================== -->
    <!-- Currency Select -->
    <!-- ============================================================== -->
    <mew-select
      label="Currency"
      :items="currencyItems"
      :value="selectedCurrency"
      :disabled="loading"
      @input="setCurrency"
    />

    <!-- ============================================================== -->
    <!-- Fiat currency select -->
    <!-- ============================================================== -->
    <div class="d-flex align-center justify-space-between mt-3 mb-3">
      <div class="font-weight-medium">Select amount</div>
      <v-select
        v-model="selectedFiat"
        style="margin-top: -1px; max-width: 100px"
        hide-details
        :items="fiatCurrencyItems"
        :disabled="loading"
        dense
        solo
        flat
        append-icon="mdi-chevron-down"
      ></v-select>
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
                {{
                  button.crypto
                    ? `~${button.crypto} ${selectedCurrency.name}`
                    : button.subTitle
                }}
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
import { mapGetters } from 'vuex';
import { isEqual } from 'apollo-utilities';
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
    currencyItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      amountToBuy: '0',
      loading: true,
      selectedCurrency: {
        name: 'ETH',
        subtext: 'Ethereum',
        value: 'eth'
      },
      selectedFiat: 'USD',
      fetchedData: {}
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    hasData() {
      return !isEmpty(this.fetchedData);
    },
    fiatCurrencyItems() {
      return this.hasData ? this.fetchedData.fiat_currencies : ['USD'];
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
            crypto: BigNumber(100)
              .div(this.currencyPriceFromProvider.decimalPlaces(2))
              .decimalPlaces(4)
              .toString()
          },
          {
            id: '2',
            fiat: this.fiatConversion.times(250).toString(),
            fiatFormatted: this.currencyFormatter(
              this.fiatConversion.times(250).toString()
            ),
            crypto: BigNumber(250)
              .div(this.currencyPriceFromProvider.decimalPlaces(2))
              .decimalPlaces(4)
              .toString()
          },
          {
            id: '3',
            fiat: this.fiatConversion.times(500).toString(),
            fiatFormatted: this.currencyFormatter(
              this.fiatConversion.times(500).toString()
            ),
            crypto: BigNumber(500)
              .div(this.currencyPriceFromProvider.decimalPlaces(2))
              .decimalPlaces(4)
              .toString()
          },
          {
            id: '4',
            fiat: this.fiatConversion.times(1000).toString(),
            fiatFormatted: this.currencyFormatter(
              this.fiatConversion.times(1000).toString()
            ),
            crypto: BigNumber(1000)
              .div(this.currencyPriceFromProvider.decimalPlaces(2))
              .decimalPlaces(4)
              .toString()
          },
          {
            id: '5',
            fiat: this.fiatConversion.times(5000).toString(),
            fiatFormatted: this.currencyFormatter(
              this.fiatConversion.times(5000).toString()
            ),
            crypto: BigNumber(5000)
              .div(this.currencyPriceFromProvider.decimalPlaces(2))
              .decimalPlaces(4)
              .toString()
          },
          {
            id: '6',
            title: 'Custom',
            subTitle: `Up to ${this.currencyFormatter(this.max)}`
          }
        ];
      }
      return [
        { id: '1', fiat: '100', fiatFormatted: '$100', crypto: '0.16' },
        { id: '2', fiat: '250', fiatFormatted: '$250', crypto: '0.16' },
        { id: '3', fiat: '500', fiatFormatted: '$500', crypto: '0.16' },
        { id: '4', fiat: '1000', fiatFormatted: '$1000', crypto: '0.16' },
        { id: '5', fiat: '5000', fiatFormatted: '$5000', crypto: '0.16' },
        { id: '6', title: 'Custom', subTitle: `Up to $12,000` }
      ];
    }
  },
  watch: {
    amountToBuy(newVal) {
      if (!newVal) {
        this.amountToBuy = '0';
      }
    },
    selectedCurrency: {
      handler: function (newVal, oldVal) {
        if (!isEqual(newVal, oldVal)) {
          this.fetchCurrencyData();
        }
      },
      deep: true
    },
    network: {
      handler: function () {
        this.selectedCurrency = this.selectedCurrency = {
          name: 'ETH',
          subtext: 'Ethereum',
          value: 'eth'
        };
      },
      deep: true
    }
  },
  mounted() {
    this.fetchCurrencyData();
  },
  methods: {
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
      this.selectedCurrency = {
        name: 'ETH',
        subtext: 'Ethereum',
        value: 'eth'
      };
    },
    fetchCurrencyData() {
      this.reset();
      this.handler
        .getSupportedFiatToBuy(this.selectedCurrency.name)
        .then(res => {
          this.loading = false;
          this.fetchedData = Object.assign({}, res);
        })
        .catch(e => {
          this.loading = false;
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
        })
        .catch(err => {
          this.reset();
          Toast(err, {}, ERROR);
          this.close();
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
</style>
