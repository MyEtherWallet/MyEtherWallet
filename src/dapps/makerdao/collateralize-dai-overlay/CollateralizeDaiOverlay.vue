<template>
  <mew-overlay
    title="Collateralize DAI"
    :show-overlay="open"
    right-btn-text="Close"
  >
    <template #mewOverlayBody>
      <div>Collateralize DAI Overlay</div>
      <div>Manage My Vault</div>
      <div>Migrate</div>
      <div>Upgrade</div>
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
