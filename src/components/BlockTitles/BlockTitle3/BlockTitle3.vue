<template>
  <div class="left-border pl-7 headline font-weight-bold">{{ text }}</div>
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
.left-border {
  border-left: 5px solid var(--v-emerald-base);
}
</style>
