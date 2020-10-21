<template>
  <div></div>
</template>

<script>
import EventNames from '@/utils/web3-provider/events.js';
export default {
  name: 'Confirmation Container',
  created() {
    this.$eventHub.$on(EventNames.SHOW_TX_CONFIRM_MODAL, (tx, resolve) => {});
  }
};
</script>
