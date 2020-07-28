<template>
  <div>
    <TxConfirmation :open="openTxConfirmation" :close="closeTxConfirmation" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TxConfirmation from './TxConfirmation';

export default {
  components: {
    TxConfirmation
  },
  computed: mapState({
    openTxConfirmation: state => state.overlays.transactionTxConfirmation.isOpen
  }),
  methods: {
    closeTxConfirmation() {
      this.$store.commit('closeOverlay', 'transactionTxConfirmation');
    }
  }
};
</script>
