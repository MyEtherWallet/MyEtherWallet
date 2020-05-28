<template>
  <div class="px-3 mb-10">
    <div class="font-weight-bold">{{ title }}</div>
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
