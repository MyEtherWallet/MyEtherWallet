<!--
  =====================================================================================
    Mew Sheet 
    slot: used to place custom ui
  =====================================================================================
  -->
<template>
  <div class="mew-sheet">
    <slot />
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.mew-sheet {
  border-radius: 10px;
  //box-shadow: 0 0 15px var(--v-boxShadow-base) !important;
  border: 1px solid var(--v-greyMedium-base);
}
</style>
