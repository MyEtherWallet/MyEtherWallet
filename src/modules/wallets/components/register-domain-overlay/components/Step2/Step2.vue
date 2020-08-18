<template>
  <div>
    <transaction-confirmation />
  </div>
</template>

<script>
import TransactionConfirmation from '@/modules/wallets/components/transaction-confirmation/TransactionConfirmation';

export default {
  components: { TransactionConfirmation },
  props: {},
  data() {
    return {};
  }
};
</script>
