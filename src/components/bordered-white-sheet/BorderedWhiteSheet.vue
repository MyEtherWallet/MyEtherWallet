<template>
  <div
    class="mew-component--bordered-white-sheet border-radius--10px"
    :class="[$vuetify.theme.dark ? 'box-shadow-dark' : 'box-shadow-light']"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {}
};
</script>

<style lang="scss" scoped>
.mew-component--bordered-white-sheet {
  border: 1px solid var(--v-inputBorder-base);
  box-shadow: 0 10px 15px var(--v-boxShadow-base) !important;
}
</style>
