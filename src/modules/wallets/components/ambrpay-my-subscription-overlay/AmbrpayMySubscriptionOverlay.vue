<template>
  <mew-overlay :show-overlay="open">
    <template v-slot:mewOverlayBody>
      <div>My Subscription Overlay</div>
    </template>
  </mew-overlay>
</template>

<script>
export default {
  components: {},
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped></style>
