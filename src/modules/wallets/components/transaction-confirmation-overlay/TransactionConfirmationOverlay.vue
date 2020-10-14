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
        <transactionConfirmation />
      </mew6-white-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import transactionConfirmation from '../transaction-confirmation/TransactionConfirmation';

export default {
  components: {
    transactionConfirmation
  },
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
