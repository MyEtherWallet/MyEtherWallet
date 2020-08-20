<template>
  <mew-overlay title="Withdraw" :show-overlay="open" right-btn-text="Close">
    <template v-slot:mewOverlayBody>
      Withdraw
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
  data: function () {
    return {};
  },
  methods: {}
};
</script>
