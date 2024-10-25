<template>
  <div class="border-block border-radius--5px">
    <slot />
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.border-block {
  border: 1px solid var(--v-greyMedium-base);
}
</style>
