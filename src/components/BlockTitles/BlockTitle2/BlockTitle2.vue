<template>
  <div class="d-flex align-center justify-space-between width--100-percent">
    <div class="d-flex align-center">
      <div v-if="text" class="title font-weight-bold">{{ text }}</div>
      <slot name="object-next-to-title" />
    </div>
    <slot name="right-button" />
  </div>
</template>

<script>
export default {
  props: {
    text: { default: '', type: String }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
