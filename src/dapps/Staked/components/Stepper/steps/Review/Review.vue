<template>
  <div class="review-step d-flex">
    <div class="review-container">
      <div class="d-flex">
        <span class="title">{{ $t('dappsStaked.amount-stake') }}</span>
        <i18n tag="span" path="dappsStaked.validators-required">
          <span slot="number" class="number">1</span>
        </i18n>
      </div>
      <div class="d-flex mt-4">
        <span>{{ $t('dappsStaked.amount') }}:</span>
        <span class="eth-value"
          >32 ETH <span class="convert-value">($14,000)</span></span
        >
      </div>
      <div class="d-flex mt-4">
        <span>{{ $t('dappsStaked.one-time-fee') }}:</span>
        <span class="eth-value"
          >0.002 ETH <span class="convert-value">($14,000)</span>
        </span>
      </div>
      <div class="d-flex mt-4">
        <span>{{ $t('dappsStaked.total') }}:</span>
        <span class="eth-value"
          >32.02 ETH <span class="convert-value">($14,000)</span>
        </span>
      </div>
    </div>
    <div class="address-container mt-3 d-flex">
      <span class="title">{{ $t('dappsStaked.withdraw-title') }}</span>
      <span class="address mt-2">{{ address }}</span>
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
export default {
  props: {
    address: {
      default:
        '8c5942ab6420644d681ce7b70df0f95737a9db493cfa4da52c08a398554aab19ccde4467d8e2dbec8c972725b0063130',
      type: String
    }
  },
  methods: {
    agree() {
      this.$emit('completed', { key: 'done', value: true });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Review.scss';
</style>
