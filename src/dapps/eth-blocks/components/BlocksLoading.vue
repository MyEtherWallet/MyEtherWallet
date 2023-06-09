<template>
  <!--
  ===================================================
    Loading indicator.
    Used in Mint.
  ===================================================
  -->
  <v-sheet
    color="transparent"
    min-height="148"
    class="d-flex align-content-center eth-block-block-loading"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      class="ma-auto"
    ></v-progress-circular>
  </v-sheet>
</template>

<script>
export default {
  name: 'BlocksLoading'
};
</script>

<style lang="scss" scoped>
.staked-status-container {
  max-width: 500px;
}
.border-container {
  border: 1px solid var(--v-selectBorder-base);
}
</style>
