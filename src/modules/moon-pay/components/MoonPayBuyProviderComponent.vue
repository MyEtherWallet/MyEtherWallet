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
        src="@/modules/moon-pay/assets/moonpay-logo.svg"
        height="18"
      />
      <div class="mb-3">
        <div class="d-flex mb-1 align-center justify-space-between">
          <div class="d-flex mew-heading-3 textDark--text">
            {{ buyObj.cryptoToFiat }}
            <span class="mew-heading-3 pl-1">{{ selectedCryptoName }}</span>
          </div>
        </div>
        <div class="d-flex align-center">
          <div class="mr-1 textDark--text">≈ {{ buyObj.plusFeeF }}</div>
          <mew-tooltip style="height: 21px">
            <template #contentSlot>
              <div>
                {{ buyObj.includesFeeText }}
                <br />
                <br />
                {{ buyObj.networkFeeText }}
                <br />
                <br />
                {{ buyObj.dailyLimit }}
                <br />
                {{ buyObj.monthlyLimit }}
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
      <div>
        <mew-button
          btn-size="large"
          btn-style="light"
          color-theme="basic"
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
        <div class="d-flex mb-1 align-center justify-space-between">
          <div class="d-flex mew-heading-3 textDark--text">
            {{ simplexQuote.crypto_amount }}
            <span class="mew-heading-3 pl-1">{{ selectedCryptoName }}</span>
          </div>
        </div>
        <div class="d-flex align-center">
          <div class="mr-1 textDark--text">
            ≈ {{ currencyFormatter(simplexQuote.fiat_base_amount) }}
          </div>
          <mew-tooltip style="height: 21px">
            <template #contentSlot>
              <div>
                {{ buyObj.includesFeeText }}
                <br />
                <br />
                {{ buyObj.networkFeeText }}
                <br />
                <br />
                {{ buyObj.dailyLimit }}
                <br />
                {{ buyObj.monthlyLimit }}
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
          color-theme="basic"
          has-full-width
          :title="simplexBtnTitle"
          @click.native="openSimplex"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MultiCoinValidator from 'multicoin-address-validator';
import { mapGetters, mapActions, mapState } from 'vuex';

import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { LOCALE } from '../helpers';
export default {
  name: 'ModuleBuyEthProvider',
  props: {
    orderHandler: {
      type: Object,
      default: () => {}
    },
    close: {
      type: Function,
      default: () => {}
    },
    inWallet: {
      type: Boolean,
      default: false
    },
    onlySimplex: {
      type: Boolean,
      default: false
    },
    selectedFiat: {
      type: Object,
      default: () => ({})
    },
    selectedCurrency: {
      type: Object,
      default: () => ({})
    },
    buyObj: {
      type: Object,
      default: () => ({})
    },
    simplexQuote: {
      type: Object,
      default: () => ({})
    },
    toAddress: {
      type: String,
      default: ''
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
    actualAddress() {
      return this.inWallet ? this.address : this.toAddress;
    },
    selectedCryptoName() {
      return this.selectedCurrency.symbol;
    },
    isEUR() {
      return this.selectedFiatName === 'EUR' || this.selectedFiatName === 'GBP';
    },
    hideMoonpay() {
      return this.onlySimplex;
    },
    hideSimplex() {
      return (
        this.selectedCryptoName === 'USDC' || this.selectedCryptoName === 'USDT'
      );
    },
    simplexBtnTitle() {
      return 'BUY WITH SIMPLEX';
    },
    moonpayBtnTitle() {
      return 'BUY WITH MOONPAY';
    },
    paymentOptionString() {
      return `Visa, Mastercard, Apple Pay${this.isEUR ? ', Bank account' : ''}`;
    }
  },
  methods: {
    ...mapActions('global', ['setNetwork']),
    isValidToAddress(address) {
      return MultiCoinValidator.validate(address, this.selectedCurrency.symbol);
    },
    openSimplex() {
      this.orderHandler
        .simplexBuy(
          this.selectedCryptoName,
          this.selectedFiatName,
          this.buyObj.fiatAmount,
          this.actualAddress
        )
        .then(() => {
          this.reset();
          this.close();
          this.$emit('reset');
        })
        .catch(err => {
          this.reset();
          Toast(err, {}, ERROR);
          this.close();
          this.$emit('reset');
        });
    },
    currencyFormatter(value) {
      const locale = this.hasData ? LOCALE[this.selectedFiatName] : 'en-US';
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: this.selectedFiatName
      }).format(value);
    },
    reset() {
      this.loading = true;
      this.fetchData = {};
    },
    buy() {
      this.orderHandler
        .buy(
          this.selectedCryptoName,
          this.selectedFiatName,
          this.buyObj.fiatAmount,
          this.actualAddress
        )
        .then(() => {
          this.reset();
          this.close();
          this.$emit('reset');
        })
        .catch(err => {
          this.reset();
          Toast(err, {}, ERROR);
          this.close();
          this.$emit('reset');
        });
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
