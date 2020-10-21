<template>
  <div>
    <transaction-confirmation />
  </div>
</template>

<script>
import EventNames from '@/utils/web3-provider/events.js';
import transactionConfirmation from './transaction-confirmation';
export default {
  name: 'Confirmation Container',
  components: {
    transactionConfirmation
  },
  created() {
    this.$eventHub.$on(EventNames.SHOW_TX_CONFIRM_MODAL, (tx, resolve) => {});
  },
  methods: {
    openTransactionConfirmation() {}
  }
};
</script>
