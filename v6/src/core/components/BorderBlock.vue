<template>
  <div class="border-block border-radius--5px">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.border-block {
  border: 1px solid var(--v-greyMedium-base);
}
</style>
