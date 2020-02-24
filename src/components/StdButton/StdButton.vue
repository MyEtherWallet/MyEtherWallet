<template>
  <v-btn
    :x-large="size === 'x-large' ? true : false"
    :large="size === 'large' ? true : false"
    :small="size === 'small' ? true : false"
    :x-small="size === 'x-small' ? true : false"
    text
    dark
    depressed
    class="std-button"
    :class="[buttonClass, minWidth == true ? 'btn-min-width' : '', fontclass]"
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
    buttonClass: { default: 'button--green', type: String },
    to: { default: () => {}, type: Object },
    href: { default: '', type: String },
    disabled: { default: false, type: Boolean },
    minWidth: { default: true, type: Boolean },
    size: { default: 'x-large', type: String },
    fontclass: { default: 'font-weight-medium', type: String }
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
  text-transform: none;
  letter-spacing: 0px;
  font-size: 14px !important;
  font-weight: 500;
}

.button--green {
  background-color: $emerald !important;
  color: white !important;
}

.button--text-green {
  background-color: transparent !important;
  color: $emerald !important;
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
