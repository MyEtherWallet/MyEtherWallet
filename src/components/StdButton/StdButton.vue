<template>
  <v-btn
    x-large
    dark
    depressed
    class="std-button"
    :class="buttonclass"
    :disabled="disabled"
  >
    <slot />
  </v-btn>
</template>

<script>
export default {
  props: {
    buttonclass: { default: 'button--green', type: String },
    disabled: { default: false, type: Boolean }
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.std-button {
  height: 60px !important;
  min-width: 180px !important;
  text-transform: none;
  letter-spacing: -0.1px;
  font-size: 14px !important;
  font-weight: 600;
}

.button--green {
  background-color: $emerald !important;
}

.button--green-border {
  background-color: transparent !important;
  border: 1px solid $emerald;
  color: $emerald !important;
}

.v-btn--disabled {
  border: 0px;
}
</style>
