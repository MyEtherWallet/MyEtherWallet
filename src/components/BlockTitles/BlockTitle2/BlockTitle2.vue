<template>
  <div class="d-flex align-center justify-space-between width--100-percent">
    <div class="d-flex align-center">
      <div v-if="text" class="title font-weight-bold mr-2">{{ text }}</div>
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
