<template>
  <div class="d-flex align-center justify-center py-5">
    <div
      v-for="(i, k) in items"
      :key="k"
      class="indicator-dot mx-2"
      :class="k + 1 === currentItem ? 'active' : ''"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'PageIndicatorDot',
  props: {
    items: { default: 1, type: Number },
    currentItem: { default: 1, type: Number }
  },
  data: () => ({}),
  watch: {}
};
</script>

<style lang="scss" scoped>
.indicator-dot {
  $dot-size: 12px;

  height: $dot-size;
  width: $dot-size;
  background-color: var(--v-greyMedium-base);
  border-radius: 100%;
  transition: background-color 0.3s ease;

  &.active {
    background-color: var(--v-textDark-base);
  }
}
</style>
