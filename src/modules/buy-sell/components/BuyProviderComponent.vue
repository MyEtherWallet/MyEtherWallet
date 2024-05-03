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
          color-theme="buttonGrayLight"
          has-full-width
          :title="simplexBtnTitle"
          @click.native="openSimplex"
        />
      </div>
    </div>

    <div v-if="hideSimplex && hideMoonpay" class="section-block pa-5">
      <div class="d-flex mew-heading-3 textDark--text">No Providers found</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, defineEmits } from 'vue';
import MultiCoinValidator from 'multicoin-address-validator';
import { isEmpty } from 'lodash';

import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { LOCALE } from '../helpers';
import { BUY_SELL } from '@/modules/analytics-opt-in/handlers/configs/events';
import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';

// injections
const { trackBuySell } = useAmplitude();
const { address } = useWalletStore();

// props
const props = defineProps({
  orderHandler: {
    type: Object,
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
});

// emit
const emit = defineEmits(['close', 'reset']);

// data
const loading = ref(false);

// computed
const selectedFiatName = computed(() => {
  return props.selectedFiat.name;
});
const actualAddress = computed(() => {
  return props.inWallet ? address.value : props.toAddress;
});
const selectedCryptoName = computed(() => {
  return props.selectedCurrency.symbol;
});
const isEUR = computed(() => {
  return selectedFiatName.value === 'EUR' || selectedFiatName.value === 'GBP';
});
const hideMoonpay = computed(() => {
  return props.onlySimplex;
});
const hideSimplex = computed(() => {
  return isEmpty(props.simplexQuote);
});
const simplexBtnTitle = computed(() => {
  return 'BUY WITH SIMPLEX';
});
const moonpayBtnTitle = computed(() => {
  return 'BUY WITH MOONPAY';
});
const paymentOptionString = computed(() => {
  return `Visa, Mastercard, Apple Pay${isEUR.value ? ', Bank account' : ''}`;
});

// methods
const isValidToAddress = address => {
  return MultiCoinValidator.validate(address, props.selectedCurrency.symbol);
};
const openSimplex = () => {
  if (!validToAddress()) return;
  trackBuySell(BUY_SELL.BUY_W_SIMPLEX);
  props.orderHandler
    .simplexBuy(
      selectedCryptoName.value,
      selectedFiatName.value,
      props.buyObj.fiatAmount,
      actualAddress.value
    )
    .then(() => {
      trackBuySell(BUY_SELL.BUY_W_SIMPLEX_SUCCESS);
      reset();
      emit('close');
      emit('reset');
    })
    .catch(err => {
      trackBuySell(BUY_SELL.BUY_W_SIMPLEX_FAILED);
      reset();
      Toast(err, {}, ERROR);
      emit('close');
      emit('reset');
    });
};
const currencyFormatter = value => {
  const locale = props.hasData ? LOCALE[selectedFiatName.value] : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: selectedFiatName.value
  }).format(value);
};
const reset = () => {
  loading.value = true;
};
const buy = () => {
  if (!validToAddress()) return;
  trackBuySell(BUY_SELL.BUY_W_MOONPAY);
  props.orderHandler
    .buy(
      selectedCryptoName.value,
      selectedFiatName.value,
      props.buyObj.fiatAmount,
      actualAddress.value
    )
    .then(() => {
      trackBuySell(BUY_SELL.BUY_W_MOONPAY_SUCCESS);
      reset();
      emit('close');
      emit('reset');
    })
    .catch(err => {
      trackBuySell(BUY_SELL.BUY_W_MOONPAY_FAILED);
      reset();
      Toast(err, {}, ERROR);
      emit('close');
      emit('reset');
    });
};
const validToAddress = () => {
  if (isEmpty(actualAddress.value)) {
    Toast('To address cannot be empty!', {}, ERROR);
    emit('close');
    return false;
  }
  return true;
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
