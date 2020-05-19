<template>
  <div class="divider-x"></div>
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
.divider-x {
  border-bottom: 2px solid #f5f5f5;
  width: 100%;
}
</style>
