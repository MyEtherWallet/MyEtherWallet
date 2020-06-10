<template>
  <v-btn
    :class="[
      'mew-component--std-button',
      bold ? 'font-weight-bold' : '',
      text ? 'no-padding' : '',
      textColor
    ]"
    :elevation="elevated ? 7 : 0"
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
    :style="customStyle"
    :text="text"
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
    minWidth: { default: '', type: String },
    size: { default: 'x-large', type: String },
    height: { default: '', type: String },
    elevated: { default: false, type: Boolean },
    bold: { default: false, type: Boolean },
    depressed: { default: false, type: Boolean },
    text: { default: false, type: Boolean },
    customStyle: { default: '', type: String }
  }
};
</script>

<style lang="scss" scoped>
.mew-component--std-button {
  border-radius: 5px;
  text-transform: none;
  letter-spacing: 1px;
  font-size: 14px !important;
  font-weight: 500;
}
.v-btn:not(.v-btn--round).v-size--x-large {
  height: 62px;
  padding: 0 30px;
}
.v-btn:not(.v-btn--round).v-size--large {
  height: 52px;
  padding: 0 30px;
}
.theme--light.v-btn--active::before,
.theme--dark.v-btn--active::before {
  opacity: 0;
}
.no-padding {
  padding: 0 !important;
  min-width: 0 !important;
}
.v-application .elevation-7 {
  box-shadow: 0 4px 5px -2px rgba(0, 0, 0, 0.07),
    0 7px 10px 1px rgba(0, 0, 0, 0.07), 0 2px 16px 1px rgba(0, 0, 0, 0.07) !important;
}
</style>
