<template>
  <a
    :href="'localhost:8081/awaiting/scheduler/' + txHash"
    target="_blank"
    rel="noopener noreferrer"
  >
    {{ txHash }}
  </a>
</template>

<script>
export default {
  name: 'ScheduledTransactionExplorerLink',
  props: {
    txHash: {
      type: String,
      default: ''
    }
  }
};
</script>
