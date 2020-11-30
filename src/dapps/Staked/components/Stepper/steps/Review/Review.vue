<template>
  <div class="review-step d-flex">
    <div class="review-container">
      <div class="d-flex">
        <span class="title">{{ $t('dappsStaked.amount-stake') }}</span>
        <i18n
          class="align-right"
          tag="span"
          path="dappsStaked.validator-required"
        >
          <span slot="number" class="number">1</span>
        </i18n>
      </div>
      <div class="d-flex mt-4">
        <span>{{ $t('dappsStaked.amount') }}:</span>
        <span class="eth-value"
          >{{ details.amount }} {{ $t('common.currency.eth') }}
          <span class="convert-value ml-1"
            >({{ '$' + usdPrice(details.amount) }})</span
          ></span
        >
      </div>
      <div class="d-flex mt-4">
        <span>{{ $t('dappsStaked.one-time-fee') }}:</span>
        <span class="eth-value"
          >{{ oneTimeFee }} {{ $t('common.currency.eth') }}
          <span class="convert-value">({{ '$' + usdPrice(oneTimeFee) }})</span>
        </span>
      </div>
      <div class="d-flex mt-4">
        <span>{{ $t('dappsStaked.total') }}:</span>
        <span class="eth-value"
          >{{ getTotal }} {{ $t('common.currency.eth') }}
          <span class="convert-value">({{ '$' + usdPrice(getTotal) }})</span>
        </span>
      </div>
    </div>
    <div class="address-container mt-3 d-flex">
      <span class="title">{{ $t('dappsStaked.withdraw-title') }}</span>
      <span class="address mt-2">{{ details.address }}</span>
    </div>
    <label class="switch mt-4 d-flex">
      <input type="checkbox" @click="agree" />
      <i18n class="ml-2" tag="span" path="dappsStaked.read-and-agree">
        <span slot="terms-of-service" class="link">{{
          $t('dappsStaked.terms-of-service')
        }}</span>
      </i18n>
    </label>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

export default {
  props: {
    details: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      oneTimeFee: '0.01'
    };
  },
  computed: {
    getTotal() {
      return new BigNumber(this.oneTimeFee)
        .plus(this.details.amount)
        .toFixed(4);
    }
  },
  methods: {
    usdPrice(amount) {
      if (this.details.ethPrice) {
        return new BigNumber(this.details.ethPrice).times(amount);
      }
      return 0;
    },
    agree() {
      this.$emit('completed', true, { key: 'review', value: true });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Review.scss';
</style>
