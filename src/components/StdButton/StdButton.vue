<template>
  <v-btn
    x-large
    dark
    depressed
    class="std-button"
    :class="[buttonclass, minwidth == true ? 'btn-min-width' : '']"
    :disabled="disabled"
    :to="to"
    :href="href"
  >
    <slot class="d-flex align-center" />
  </v-btn>
</template>

<script>
export default {
  props: {
    buttonclass: { default: 'button--green', type: String },
    to: { default: () => {}, type: Object },
    href: { default: '', type: String },
    disabled: { default: false, type: Boolean },
    minwidth: { default: true, type: Boolean }
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.btn-min-width {
  min-width: 180px !important;
}

.std-button {
  height: 56px !important;
  text-transform: none;
  letter-spacing: 0px;
  font-size: 14px !important;
  font-weight: 500;
}

.button--green {
  background-color: $emerald !important;
  color: white !important;
}

.button--green-border {
  background-color: transparent !important;
  border: 1px solid $emerald;
  color: $emerald !important;
}

.button--white {
  background-color: white !important;
  color: $emerald !important;
}

.button--white-border {
  background-color: transparent !important;
  border: 1px solid white;
  color: white !important;
}

.v-btn--disabled {
  border: 0px;
}
</style>
