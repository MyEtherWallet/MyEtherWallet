<template>
  <mew-overlay
    :show-overlay="open"
    title="Notifications"
    right-btn-text="Close"
  >
    <template v-slot:mewComponent>
      <tx-notification
        badge-type="in"
        tx-status="success"
        tx-title="in"
        from-address="0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D"
        amount="0.004 ETH"
        duration="1 min ago"
      />
      <tx-notification
        badge-type="out"
        tx-status="pending"
        tx-title="out"
        from-address="0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D"
        amount="0.004 ETH"
        duration="1 min ago"
      />
      <tx-notification
        badge-type="swap"
        tx-status="error"
        tx-title="swap"
        from-address="0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D"
        amount="0.004 ETH"
        duration="1 min ago"
      />
    </template>
  </mew-overlay>
</template>

<script>
export default {
  components: {},
  props: {
    open: { default: false, type: Boolean }
  },
  data() {
    return {};
  }
};
</script>
