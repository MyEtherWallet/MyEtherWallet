<template>
  <div class="py-8 px-8 pt-3">
    <div
      class="d-flex align-center textDark--text mb-10 cursor--pointer"
      @click="$emit('close')"
    >
      <v-icon color="textDark">mdi-arrow-left mr-4</v-icon>
      <div class="mew-heading-2">Select provider</div>
    </div>

    <!-- ============================================================== -->
    <!-- Moonpay -->
    <!-- ============================================================== -->
    <div v-if="!hideMoonpay" class="section-block pa-5 mb-6">
      <img
        class="provider-logo"
        src="@/modules/buy-sell/assets/moonpay-logo.svg"
        height="18"
      />
      <div class="mb-3">
        <div class="d-flex mb-1 align-center">
          <div class="d-flex mew-heading-3 textDark--text mr-1">
            {{ moonpayQuote.cryptoToFiat }}
            <span class="mew-heading-3 pl-1">{{ selectedCryptoName }}</span>
          </div>
          <mew-tooltip>
            <template #contentSlot>
              <div>
                {{ moonpayQuote.includesFeeText }}
                <br />
                <br />
                {{ moonpayQuote.networkFeeText }}
                <br />
                <br />
                {{ moonpayQuote.dailyLimit }}
                <br />
                {{ moonpayQuote.monthlyLimit }}
              </div>
            </template>
          </mew-tooltip>
        </div>
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
          alt="applepay"
          height="24"
          class="mr-2"
        />
        <img
          src="@/assets/images/icons/moonpay/icon-paypal-logo.svg"
          alt="paypal"
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
      <div>
        <mew-button
          btn-size="large"
          btn-style="light"
          color-theme="buttonGrayLight"
          has-full-width
          :is-valid-address-func="isValidToAddress"
          :title="moonpayBtnTitle"
          @click.native="buy"
        />
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- Simplex -->
    <!-- ============================================================== -->
    <div v-if="!hideSimplex" class="section-block pa-5">
      <div v-if="!loading" class="mb-3">
        <div class="d-flex mb-1 align-center">
          <div class="d-flex mew-heading-3 textDark--text mr-1">
            {{ simplexQuote.crypto_amount }}
            <span class="mew-heading-3 pl-1">{{ selectedCryptoName }}</span>
          </div>
          <mew-tooltip>
            <template #contentSlot>
              <div>
                {{ moonpayQuote.includesFeeText }}
                <br />
                <br />
                {{ moonpayQuote.networkFeeText }}
                <br />
                <br />
                {{ moonpayQuote.dailyLimit }}
                <br />
                {{ moonpayQuote.monthlyLimit }}
              </div>
            </template>
          </mew-tooltip>
        </div>
      </div>

      <div v-else class="mb-3">
        <v-skeleton-loader type="heading" class="mb-1" />
        <v-skeleton-loader max-width="200px" type="heading" />
      </div>

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
      <div>
        <mew-button
          btn-size="large"
          btn-style="light"
          color-theme="buttonGrayLight"
          has-full-width
          :title="simplexBtnTitle"
          @click.native="openSimplex"
        />
      </div>
    </div>
    <!-- ============================================================== -->
    <!-- Topper -->
    <!-- ============================================================== -->
    <div v-if="!hideTopper" class="section-block pa-5">
      <div v-if="!loading" class="mb-3">
        <div class="d-flex mb-1 align-center">
          <div class="d-flex mew-heading-3 textDark--text mr-1">
            {{ topperQuote.cryptoToFiat }}
            <span class="mew-heading-3 pl-1">{{ selectedCryptoName }}</span>
          </div>
          <mew-tooltip>
            <template #contentSlot>
              <div>
                {{ topperQuote.includesFeeText }}
                <br />
                <br />
                {{ topperQuote.networkFeeText }}
                <br />
                <br />
                {{ topperQuote.dailyLimit }}
                <br />
                {{ topperQuote.monthlyLimit }}
              </div>
            </template>
          </mew-tooltip>
        </div>
      </div>

      <div v-else class="mb-3">
        <v-skeleton-loader type="heading" class="mb-1" />
        <v-skeleton-loader max-width="200px" type="heading" />
      </div>

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
          <img
            src="@/assets/images/icons/moonpay/icon-apple-pay.svg"
            alt="ApplePay"
            height="24"
            class="mr-2"
          />
          <img
            src="@/assets/images/icons/moonpay/icon-google-pay-logo.svg"
            alt="googlePay"
            height="35"
            class="mr-2"
            style="margin-top: -5px"
          />
          <img
            src="@/assets/images/icons/moonpay/icon-pix-logo.svg"
            alt="pixpay"
            height="24"
            class="mr-2"
          />
        </div>
        <img
          class="provider-logo"
          src="@/assets/images/icons/icon-topper.png"
          alt="topper"
          height="28"
        />
      </div>
      <div class="mew-label mb-5">
        Visa, Mastercard, Apple Pay, Google Pay, Pix
      </div>
      <div>
        <mew-button
          btn-size="large"
          btn-style="light"
          color-theme="buttonGrayLight"
          has-full-width
          :title="topperBtnTitle"
          @click.native="openTopper"
        />
      </div>
    </div>

    <div v-if="hideSimplex && hideMoonpay" class="section-block pa-5">
      <div class="d-flex mew-heading-3 textDark--text">No Providers found</div>
    </div>
  </div>
</template>

<script>
import MultiCoinValidator from 'multicoin-address-validator';
import { mapGetters, mapState } from 'vuex';
import { isEmpty } from 'lodash';

import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { BUY_SELL } from '@/modules/analytics-opt-in/handlers/configs/events';
import BigNumber from 'bignumber.js';

export default {
  name: 'ModuleBuyEthProvider',
  mixins: [handlerAnalytics],
  props: {
    orderHandler: {
      type: Object,
      default: () => {}
    },
    selectedFiat: {
      type: Object,
      default: () => ({})
    },
    selectedCurrency: {
      type: Object,
      default: () => ({})
    },
    moonpayQuote: {
      type: Object,
      default: () => ({})
    },
    simplexQuote: {
      type: Object,
      default: () => ({})
    },
    topperQuote: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    ...mapState('wallet', ['address']),
    selectedFiatName() {
      return this.selectedFiat.name;
    },
    selectedCryptoName() {
      return this.selectedCurrency.symbol;
    },
    isEUR() {
      return this.selectedFiatName === 'EUR' || this.selectedFiatName === 'GBP';
    },
    hideMoonpay() {
      return isEmpty(this.moonpayQuote);
    },
    hideSimplex() {
      return isEmpty(this.simplexQuote);
    },
    hideTopper() {
      return BigNumber(this.topperQuote.cryptoToFiat).isZero();
    },
    simplexBtnTitle() {
      return 'BUY WITH SIMPLEX';
    },
    moonpayBtnTitle() {
      return 'BUY WITH MOONPAY';
    },
    topperBtnTitle() {
      return 'BUY WITH TOPPER';
    },
    paymentOptionString() {
      return `Visa, Mastercard, Apple Pay, Paypal${
        this.isEUR ? ', Bank account' : ''
      }`;
    }
  },
  methods: {
    isValidToAddress(address) {
      return MultiCoinValidator.validate(address, this.selectedCurrency.symbol);
    },
    openTopper() {
      if (!this.validToAddress()) return;
      this.trackBuySell(BUY_SELL.BUY_W_TOPPER);
      const param = {
        fiatCurrency: this.selectedFiatName,
        cryptoCurrency: this.selectedCryptoName,
        requestedAmount: this.topperQuote.fiatAmount,
        address: this.address
      };
      this.orderHandler
        .getTopperUrl(param)
        .then(res => {
          window.open(res.url, '_blank');
          this.trackBuySell(BUY_SELL.BUY_W_TOPPER_SUCCESS);
          this.reset();
          this.$emit('close');
          this.$emit('reset');
        })
        .catch(err => {
          this.trackBuySell(BUY_SELL.BUY_W_TOPPER_FAILED);
          this.reset();
          Toast(err, {}, ERROR);
          this.$emit('close');
          this.$emit('reset');
        });
    },
    openSimplex() {
      if (!this.validToAddress()) return;
      this.trackBuySell(BUY_SELL.BUY_W_SIMPLEX);
      this.orderHandler
        .simplexBuy(
          this.selectedCryptoName,
          this.selectedFiatName,
          this.moonpayQuote.fiatAmount,
          this.address
        )
        .then(() => {
          this.trackBuySell(BUY_SELL.BUY_W_SIMPLEX_SUCCESS);
          this.reset();
          this.$emit('close');
          this.$emit('reset');
        })
        .catch(err => {
          this.trackBuySell(BUY_SELL.BUY_W_SIMPLEX_FAILED);
          this.reset();
          Toast(err, {}, ERROR);
          this.$emit('close');
          this.$emit('reset');
        });
    },
    reset() {
      this.loading = true;
      this.fetchData = {};
    },
    buy() {
      if (!this.validToAddress()) return;
      this.trackBuySell(BUY_SELL.BUY_W_MOONPAY);
      this.orderHandler
        .buy(
          this.selectedCryptoName,
          this.selectedFiatName,
          this.moonpayQuote.fiatAmount,
          this.address
        )
        .then(() => {
          this.trackBuySell(BUY_SELL.BUY_W_MOONPAY_SUCCESS);
          this.reset();
          this.$emit('close');
          this.$emit('reset');
        })
        .catch(err => {
          this.trackBuySell(BUY_SELL.BUY_W_MOONPAY_FAILED);
          this.reset();
          Toast(err, {}, ERROR);
          this.$emit('close');
          this.$emit('reset');
        });
    },
    validToAddress() {
      if (isEmpty(this.address)) {
        Toast('To address cannot be empty!', {}, ERROR);
        this.$emit('close');
        return false;
      }
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
.section-block {
  border-radius: 12px;
  left: 0px;
  top: 0px;
  box-sizing: border-box;
  border: 1px solid var(--v-greyMedium-base);
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  margin: 8px 0px;
  position: relative;
}
.provider-logo {
  position: absolute;
  top: 18px;
  right: 20px;
}
</style>
