<template>
  <mew-overlay
    title="Confirmation"
    :show-overlay="open"
    right-btn-text="Close"
    left-btn-text="Back"
    @closeOverlay="$emit('close')"
  >
    <template #mewOverlayBody>
      <mew6-white-sheet class="mt-4">
        <swapTransactionConfirmation v-if="swap" />
        <transactionConfirmation v-else />
      </mew6-white-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import transactionConfirmation from '../transaction-confirmation/TransactionConfirmation';
import swapTransactionConfirmation from '../transaction-confirmation/SwapTransactionConfirmation';

export default {
  components: {
    transactionConfirmation,
    swapTransactionConfirmation
  },
  props: {
    swap: { default: false, type: Boolean },
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
