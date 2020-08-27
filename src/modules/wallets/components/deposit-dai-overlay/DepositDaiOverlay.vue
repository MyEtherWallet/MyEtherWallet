<template>
  <mew-overlay title="Deposit" :show-overlay="open" right-btn-text="Close">
    <template v-slot:mewOverlayBody>
      Deposit
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
