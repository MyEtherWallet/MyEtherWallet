<template>
  <div class="mb-3">
    <div class="mew-heading-3 font-weight-bold">{{ title }}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: { default: '', type: String }
  },
  data() {
    return {};
  }
};
</script>
