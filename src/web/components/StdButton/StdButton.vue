<template>
  <v-btn
    class="mew-component--std-button"
    :class="[
      bold ? 'font-weight-bold' : '',
      shadow ? 'button-shadow' : '',
      textColor
    ]"
    :color="color"
    :outlined="outlined"
    :height="height"
    :x-large="size === 'x-large' ? true : false"
    :large="size === 'large' ? true : false"
    :small="size === 'small' ? true : false"
    :x-small="size === 'x-small' ? true : false"
    :depressed="depressed"
    dark
    :min-width="minWidth ? minWidth : '200px'"
    :disabled="disabled"
    :to="to"
    :href="href"
    :target="href ? '_blank' : ''"
  >
    <slot class="d-flex align-center" />
  </v-btn>
</template>

<script>
export default {
  props: {
    textColor: { default: '', type: String },
    color: { default: 'emerald', type: String },
    outlined: { default: false, type: Boolean },
    to: { default: () => {}, type: Object },
    href: { default: '', type: String },
    disabled: { default: false, type: Boolean },
    minWidth: { default: false, type: Boolean },
    size: { default: 'x-large', type: String },
    height: { default: '', type: String },
    bold: { default: false, type: Boolean },
    depressed: { default: false, type: Boolean }
  }
};
</script>

<style lang="scss" scoped>
.mew-component--std-button {
  text-transform: none;
  letter-spacing: 1px;
  font-size: 14px !important;
  font-weight: 500;
  padding: 0 35px !important;
}
.v-btn:not(.v-btn--round).v-size--x-large {
  height: 62px;
}
</style>
