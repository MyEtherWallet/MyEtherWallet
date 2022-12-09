<template>
  <v-sheet
    :max-width="maxWidth"
    :min-width="minWidth"
    :width="fullWidth ? '100%' : ''"
    color="bgWalletBlock"
    class="mew-component--white-sheet border-radius--10px box-shadow"
    :class="[
      sideinfo ? 'sideinfo' : '',
      overflowHidden ? 'overflow--hidden' : '',
      noShadow ? '' : 'bs-wallet-block'
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
