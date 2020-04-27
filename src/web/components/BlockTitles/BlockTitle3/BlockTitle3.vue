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
@import '@/assets/styles/GlobalVariables.scss';

.left-border {
  border-left: 5px solid $emerald;
}
</style>
