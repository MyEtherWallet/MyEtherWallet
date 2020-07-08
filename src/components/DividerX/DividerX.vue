<template>
  <div class="divider-x">
    <div v-if="!dot" class="line" />
    <div v-if="dot" class="dot" />
  </div>
</template>

<script>
export default {
  props: {
    dot: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped>
.line {
  border-bottom: 2px solid #f5f5f5;
}
.dot {
  border-bottom: 2px dotted #f5f5f5;
}
</style>
