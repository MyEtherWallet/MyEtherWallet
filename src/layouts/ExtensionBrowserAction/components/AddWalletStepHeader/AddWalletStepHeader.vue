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
      <p>STEP 1. Choose a method</p>
    </div>
    <div
      :class="[
        step === 3 ? 'active' : '',
        step > 3 ? 'passed' : '',
        'step-item two'
      ]"
    >
      <div class="step-two" />
      <p>STEP 2. Unlock my wallet</p>
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
      <p>STEP 3. Confirm to add</p>
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
