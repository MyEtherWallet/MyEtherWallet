<template>
  <BaseOverlay :open="open">
    <div class="overlay-close-button"><slot name="closeButton" /></div>
    <div>Hi.</div>
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
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.overlay-close-button {
  position: fixed;
  top: 50px;
  right: 100px;
}
</style>
