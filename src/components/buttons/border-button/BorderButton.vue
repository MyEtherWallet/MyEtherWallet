<template>
  <div class="border-button">
    <slot></slot>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.border-button {
  border: 1px solid var(--v-primaryOutlineActive-base);
  border-radius: 7px;
  box-shadow: 0 8px 15px var(--v-boxShadow-base);
  height: 100%;
}
</style>
