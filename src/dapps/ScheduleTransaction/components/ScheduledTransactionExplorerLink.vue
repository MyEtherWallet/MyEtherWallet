<template functional>
  <a
    :href="'https://app.chronologic.network/awaiting/scheduler/' + props.txHash"
    target="_blank"
    rel="noopener noreferrer"
  >
    {{ props.linkText ? props.linkText : props.txHash }}
  </a>
</template>

<script>
export default {
  name: 'ScheduledTransactionExplorerLink',
  props: {
    txHash: {
      type: String,
      default: ''
    },
    linkText: {
      type: String,
      default: null
    }
  }
};
</script>
