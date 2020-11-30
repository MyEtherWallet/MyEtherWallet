<template>
  <div class="mew-component--button-tabs d-flex">
    <div
      v-for="(t, key) in tabs"
      :key="key"
      :class="key + 1 === value ? 'active' : ''"
      @click="updateDate(key + 1)"
    >
      {{ t }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    value: {
      type: Number,
      default: 1
    }
  },
  methods: {
    updateDate(val) {
      this.$emit('input', val);
    }
  }
};
</script>

<style lang="scss" scoped>
.mew-component--button-tabs {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 15px var(--v-boxShadow-base) !important;

  > div {
    font-weight: 500;
    padding: 20px;
    cursor: pointer;
    background-color: white;
    user-select: none;

    &.active {
      background-color: var(--v-basic-base);
      color: white;
    }
  }
}
</style>
