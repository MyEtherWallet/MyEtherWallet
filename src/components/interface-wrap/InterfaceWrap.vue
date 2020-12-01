<template>
  <div class="pt-5 pt-lg-8">
    <div class="left-border pl-7 headline font-weight-bold mb-1">
      {{ title }}
    </div>
    <div class="pa-3 pa-lg-10">
      <slot />
    </div>
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
<style lang="scss" scoped>
.left-border {
  border-left: 5px solid var(--v-primary-base);
}
</style>
