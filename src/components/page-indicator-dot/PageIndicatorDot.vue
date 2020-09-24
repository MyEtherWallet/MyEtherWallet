<template>
  <div class="d-flex align-center justify-center py-5">
    <div
      v-for="(i, k) in items"
      :ref="k"
      :key="k"
      class="indicator-dot mx-2"
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
  watch: {
    currentItem(newVal) {
      for (let c = 0; c < this.items; c++) {
        this.$refs[c][0].classList.remove('active');
      }
      this.$refs[newVal - 1][0].classList.add('active');
    }
  },
  mounted() {
    this.$refs[0][0].classList.add('active');
  }
};
</script>

<style lang="scss" scoped>
.indicator-dot {
  $dot-size: 12px;

  height: $dot-size;
  width: $dot-size;
  background-color: var(--v-basicOutlineActive-base);
  border-radius: 100%;
  transition: background-color 0.3s ease;

  &.active {
    background-color: var(--v-basic-base);
  }
}
</style>
