<template>
  <a
    :href="'https://app.chronologic.network/awaiting/scheduler/' + txHash"
    target="_blank"
    rel="noopener noreferrer"
  >
    {{ linkText ? linkText : txHash }}
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
