<template>
  <v-sheet
    :max-width="maxWidth"
    :min-width="minWidth"
    :width="fullWidth ? '100%' : ''"
    color="mewBg"
    class="mew-component--white-sheet border-radius--10px"
    :class="[
      sideinfo ? 'sideinfo' : '',
      overflowHidden ? 'overflow--hidden' : '',
      $vuetify.theme.dark && !noShadow ? 'box-shadow-dark' : '',
      !$vuetify.theme.dark && !noShadow ? 'box-shadow-light' : ''
    ]"
  >
    <slot />
  </v-sheet>
</template>

<script>
export default {
  props: {
    sideinfo: { default: false, type: Boolean },
    overflowHidden: { default: false, type: Boolean },
    maxWidth: { default: '', type: String },
    minWidth: { default: '', type: String },
    fullWidth: { default: false, type: Boolean },
    noShadow: { default: false, type: Boolean }
  }
};
</script>

<style lang="scss" scoped>
.sideinfo {
  width: 100%;
}
</style>

<style lang="scss">
.mew-component--white-sheet.box-shadow-light {
  box-shadow: 0 0 15px var(--v-boxShadow-base) !important;
}
.mew-component--white-sheet.box-shadow-dark {
  box-shadow: 0 0 15px #3c3c3c !important;
}
</style>
