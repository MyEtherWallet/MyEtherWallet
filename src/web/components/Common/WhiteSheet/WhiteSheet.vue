<template>
  <v-theme-provider root>
    <v-sheet
      color="bg_white_sheet"
      class="border-radius--10px box-shadow"
      :class="[
        sideinfo ? 'sideinfo' : '',
        overflowHidden ? 'overflow--hidden' : ''
      ]"
    >
      <slot />
    </v-sheet>
  </v-theme-provider>
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
/* Set light theme box-shadow for white sheet */
#app.theme--light .box-shadow {
  box-shadow: 0 0 15px var(--v-box_shadow-base);
}

/* Set dark theme box-shadow for white sheet */
#app.theme--dark .box-shadow {
  box-shadow: 0 0 15px #3c3c3c;
}
</style>
