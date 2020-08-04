<template>
  <v-sheet color="walletBg" class="data-block">
    <slot />
  </v-sheet>
</template>

<script>
export default {
  props: {}
};
</script>

<style lang="scss" scoped>
.data-block {
  position: relative;
  border-radius: 7px;
}
</style>
