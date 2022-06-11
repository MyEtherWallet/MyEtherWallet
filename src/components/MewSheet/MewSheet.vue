    <!--
  =====================================================================================
    Mew Sheet 
    slot: used to place custom ui
  =====================================================================================
  -->
<template>
  <v-sheet
    color="mewBg"
    class="mew-sheet"
  >
    <slot />
  </v-sheet>
</template>

<script>
export default {};
</script>

<style lang="scss">
.mew-sheet {
  border-radius: 10px;
  box-shadow: 0 0 15px var(--v-boxShadow-base) !important;
}
</style>
