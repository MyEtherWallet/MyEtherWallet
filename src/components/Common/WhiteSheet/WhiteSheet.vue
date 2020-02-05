<template>
  <v-sheet class="white-sheet">
    <slot />
  </v-sheet>
</template>

<script>
export default {
  props: {}
};
</script>

<style lang="scss" scoped>
.white-sheet {
  border-radius: 15px;
  box-shadow: 0 0 20px #0000000f;
}
</style>
