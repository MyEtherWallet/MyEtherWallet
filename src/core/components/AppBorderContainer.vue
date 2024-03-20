<template>
  <div class="app-border-container" :class="selected ? 'selected' : ''">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'AppBorderContainer',
  props: {
    selected: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.app-border-container {
  padding: 15px 17px;
  border-radius: 12px;
  border: 2px solid #e3e9ed;
  transition: border 0.15s ease;
  &.selected {
    border: 2px solid var(--v-greenPrimary-base);
  }
}
</style>
