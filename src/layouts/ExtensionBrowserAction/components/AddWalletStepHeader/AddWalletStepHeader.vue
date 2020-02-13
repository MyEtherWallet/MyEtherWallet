<template>
  <div class="steps-container">
    <div
      :class="[
        step === 2 ? 'active' : '',
        step > 2 ? 'passed' : '',
        'step-item one'
      ]"
    >
      <div class="step-one" />
      <p>{{ $t('mewcx.import-wallet.step-1.title') }}</p>
    </div>
    <div
      :class="[
        step === 3 ? 'active' : '',
        step > 3 ? 'passed' : '',
        'step-item two'
      ]"
    >
      <div class="step-two" />
      <p>{{ $t('mewcx.import-wallet.step-2.title') }}</p>
    </div>
    <div
      :class="[
        step === 4 ? 'active' : '',
        step > 4 ? 'passed' : '',
        'step-item three'
      ]"
    >
      <div class="step-three" />
      <div class="floating-border" />
      <p>{{ $t('mewcx.import-wallet.step-3.title') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AddWalletStepHeader.scss';
</style>
