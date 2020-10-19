<template>
  <mew-overlay
    :show-overlay="open"
    title="Register domain"
    right-btn-text="Cancel"
    @closeOverlay="$emit('close')"
  >
    <template #mewOverlayBody>
      <domain-taken />
      <mew-stepper :items="stepperItems" :on-step="onStep">
        <template #stepperContent1><Step1 /></template>
        <template #stepperContent2><Step2 /></template>
        <template #stepperContent3><Step3 /></template>
      </mew-stepper>
    </template>
  </mew-overlay>
</template>

<script>
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import domainTaken from './components/domain-taken/DomainTaken';

export default {
  components: { Step1, Step2, Step3, domainTaken },
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {
      onStep: 3,
      stepperItems: [
        {
          step: 1,
          name: 'STEP 1. Request registration'
        },
        {
          step: 2,
          name: 'STEP 2. Register domain'
        },
        {
          step: 3,
          name: 'STEP 3. Complete registration'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.check-icon {
  font-size: 65px !important;
}
</style>
