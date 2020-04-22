<template>
  <v-btn
    class="std-button"
    :color="color"
    :outlined="outlined"
    :height="height"
    :x-large="size === 'x-large' ? true : false"
    :large="size === 'large' ? true : false"
    :small="size === 'small' ? true : false"
    :x-small="size === 'x-small' ? true : false"
    depressed
    dark
    :class="[
      noMinWidth ? '' : 'btn-min-width',
      fullwidth ? 'btn-full-width' : '',
      fontclass
    ]"
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
    color: { default: 'emerald', type: String },
    outlined: { default: false, type: Boolean },
    to: { default: () => {}, type: Object },
    href: { default: '', type: String },
    disabled: { default: false, type: Boolean },
    noMinWidth: { default: false, type: Boolean },
    fullwidth: { default: false, type: Boolean },
    size: { default: '', type: String },
    height: { default: '', type: String },
    fontclass: { default: 'font-weight-medium', type: String }
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped>
.btn-min-width {
  min-width: 180px !important;
}

.btn-full-width {
  width: 100%;
}

.std-button {
  text-transform: none;
  letter-spacing: 1px;
  font-size: 14px !important;
  font-weight: 500;
}

.v-btn--disabled {
  //border: 0px;
}
</style>
