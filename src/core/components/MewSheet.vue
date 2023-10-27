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

<style lang="scss">
.mew-sheet {
  border-radius: 10px;
  border: 1px solid var(--v-greyMedium-base);
}
</style>
