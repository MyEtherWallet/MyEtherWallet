<template>
  <div class="core--components--app-hover-expanding-block">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'HoverExpandingBlock',
  props: {
    maxWidth: { default: '', type: String }
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped>
.core--components--app-hover-expanding-block {
  overflow-y: auto;
}
</style>
