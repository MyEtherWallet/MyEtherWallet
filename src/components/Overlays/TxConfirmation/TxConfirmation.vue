<template>
  <BaseOverlay :open="open">
    <slot />
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '../BaseOverlay';

export default {
  components: { BaseOverlay },
  props: {
    open: { default: false, type: Boolean }
  },
  data() {
    return {
      openBaseOverlay: false
    };
  },
  watch: {
    open(newVal) {
      this.openBaseOverlay = newVal;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';
</style>
