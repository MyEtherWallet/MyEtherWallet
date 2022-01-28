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
          :btn-style="
            buttonSelected.id === button.id && !loading ? '' : 'outline'
          "
          :class="
            buttonSelected.id === button.id && !loading ? '' : 'not-selected'
          "
          :disabled="loading"
          @click.native="buttonClicked(button)"
        >
          <div v-if="!loading" class="py-5">
            <!-- Button top text -->
            <div class="mb-1">
              <div
                class="letter-spacing--none mew-heading-1"
                :class="
                  buttonSelected.id === button.id
                    ? 'whiteAlways--text'
                    : 'textDark--text'
                "
              >
                {{ button.fiatFormatted ? button.fiatFormatted : button.title }}
              </div>
            </div>

            <!-- Button bottom text -->
            <div>
              <div
                class="letter-spacing--none mew-label"
                :class="
                  buttonSelected.id === button.id
                    ? 'whiteAlways--text'
                    : 'textMedium--text'
                "
              >
                {{
                  button.crypto
                    ? `${button.crypto} ${selectedCurrency.name}`
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

    <div v-if="showAmountInput" class="mt-6">
      <mew-input
        v-model="amountToBuy"
        type="number"
        label="Amount"
        placeholder="Enter amount to buy"
        :max-btn-obj="{}"
        :error-messages="errorMessages"
      />
    </div>

    <!-- ============================================================== -->
    <!-- Summary -->
    <!-- ============================================================== -->
    <!-- <div class="mt-6">
      <div class="d-flex align-center justify-space-between">
        <div class="font-weight-medium">Summary</div>
        <div class="mew-label textMedium--text d-flex align-center">
          <v-icon color="textMedium" small class="mr-1">
            mdi-clock-time-three-outline
          </v-icon>
          Valid for 9s
        </div>
      </div>
      <div class="d-flex align-center justify-space-between mt-4">
        <div>ETH price</div>
        <div class="text-right">$4,352.54</div>
      </div>
      <div class="d-flex align-center justify-space-between mt-4">
        <div>You get</div>
        <div class="text-right">0.234827 ETH</div>
      </div>

      <expanding-block class="mt-4" btn-right btn-bottom>
        <template #headerShow>
          <div class="greenPrimary--text">Show fees</div>
        </template>
        <template #headerHide>
          <div class="greenPrimary--text">Hide fees</div>
        </template>
        <template #content>
          <div>
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="textLight--text">Processing fee</div>
              <div class="textLight--text text-right">0.234827 ETH</div>
            </div>
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="textLight--text">Network fee</div>
              <div class="textLight--text text-right">0.234827 ETH</div>
            </div>
          </div>
        </template>
      </expanding-block>

      <div class="d-flex align-center justify-space-between mt-4">
        <div class="font-weight-medium">Total</div>
        <div class="text-right">$1,000 ETH</div>
      </div>
    </div> -->

    <!-- ============================================================== -->
    <!-- Buy button -->
    <!-- ============================================================== -->
    <div>
      <div class="d-flex justify-center mt-9 mb-7">
        <mew-checkbox
          v-model="agreeToSend"
          :label="`Send ${selectedCurrency.name} to current wallet address`"
        />
      </div>
      <mew-button
        title="Buy now"
        btn-size="xlarge"
        has-full-width
        :disabled="isBuyDisabled"
        @click.native="buy"
      />
    </div>
  </div>
</template>

<script>
// import ExpandingBlock from '@/core/components/AppExpandingBlock';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { isEmpty } from 'lodash';
import BigNumber from 'bignumber.js';
import { LOCALE } from '../helpers';
import { mapGetters } from 'vuex';
export default {
  name: 'ModuleBuyEth',
  // components: { ExpandingBlock },
  props: {
    handler: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      amountToBuy: '0',
      agreeToSend: false,
      loading: true,
      selectedCurrency: {
        name: 'ETH',
        subtext: 'Ethereum',
        value: 'eth'
      },
      selectedFiat: 'USD',
      buttonSelected: {
        id: '1',
        fiat: '100',
        fiatFormatted: '$100',
        crypto: '0.16'
      },
      currencyItems: [
        {
          text: 'Select a currency',
          selectLabel: true,
          divider: true
        },
        {
          name: 'ETH',
          subtext: 'Ethereum',
          value: 'eth'
        },
        {
          name: 'USDC',
          subtext: 'USD Coin',
          value: 'usdc'
        },
        {
          name: 'USDT',
          subtext: 'Tether',
          value: 'usdt'
        }
      ],
      fetchedData: {}
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    isBuyDisabled() {
      return this.errorMessages !== '' || !this.agreeToSend;
    },
    errorMessages() {
      if (this.showAmountInput) {
        if (BigNumber(this.amountToBuy).lt(this.min)) {
          return `Entered amount is below the provider's minumun: ${this.currencyFormatter(
            this.min.toString()
          )}`;
        }
        if (BigNumber(this.amountToBuy).gt(this.max)) {
          return `Entered amount is above the provider's maximum: ${this.currencyFormatter(
            this.max.toString()
          )}`;
        }
      }
      return '';
    },
    showAmountInput() {
      return BigNumber(this.buttonSelected.id).eq(6);
    },
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
    min() {
      if (this.hasData) {
        const foundLimit = this.fetchedData.limits.find(
          item => item.fiat_currency === this.selectedFiat
        );
        return foundLimit ? BigNumber(foundLimit.limit.min) : BigNumber(30);
      }
      return BigNumber(30);
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
    currencyFormatter(value) {
      const locale = this.hasData ? LOCALE[this.selectedFiat] : 'en-US';
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: this.selectedFiat
      }).format(value);
    },
    buttonClicked(btn) {
      this.buttonSelected = btn;
    },
    setCurrency(e) {
      this.selectedCurrency = e;
    },
    reset() {
      this.selectedFiat = 'USD';
      this.buttonSelected = {
        id: '1',
        fiat: '100',
        fiatFormatted: '$100',
        crypto: '0.16'
      };
      this.loading = true;
      this.fetchData = {};
    },
    fetchCurrencyData() {
      this.reset();
      this.handler
        .getSupportedFiatToBuy(this.selectedCurrency.name)
        .then(res => {
          this.loading = false;
          this.fetchedData = Object.assign({}, res);
          this.amountToBuy = this.min.toString();
        })
        .catch(e => {
          this.loading = false;
          Toast(e, {}, ERROR);
        });
    },
    buy() {
      const amount = this.showAmountInput
        ? BigNumber(this.amountToBuy)
        : BigNumber(this.buttonSelected.fiat);
      this.handler
        .buy(this.selectedCurrency.name, this.selectedFiat, amount.toString())
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          Toast(err, {}, ERROR);
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
