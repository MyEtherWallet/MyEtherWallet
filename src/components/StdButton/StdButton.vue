<template>
  <v-btn
    x-large
    dark
    depressed
    class="the-button-component"
    v-text="label"
    :disabled="disabled"
  ></v-btn>
</template>

<script>
export default {
  props: {
    label: String,
    disabled: Boolean
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped>
@import "@/global.scss";

.the-button-component {
  background-color: $color--primary--royal-blue !important;
  height: $button--height !important;
  min-width: $button--min-width !important;
  text-transform: $button--text-transform;
  letter-spacing: $button--letter-spacing;
}

.theme--dark.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: $button--primary--disabled--background-color !important;
  color: $button--primary--disabled--text-color !important;
}
</style>
