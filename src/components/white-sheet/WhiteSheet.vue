<template>
  <v-sheet
    color="mewBg"
    class="mew-component--white-sheet border-radius--10px"
    :class="[
      sideinfo ? 'sideinfo' : '',
      overflowHidden ? 'overflow--hidden' : '',
      $vuetify.theme.dark ? 'box-shadow-dark' : 'box-shadow-light'
    ]"
  >
    <slot />
  </v-sheet>
</template>

<script>
export default {
  props: {
    sideinfo: { default: false, type: Boolean },
    overflowHidden: { default: false, type: Boolean }
  }
};
</script>

<style lang="scss" scoped>
.sideinfo {
  width: 350px;
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
