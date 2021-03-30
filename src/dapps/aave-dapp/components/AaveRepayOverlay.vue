<template>
  <!--
  =====================================================================================
    Repay Overlay
  =====================================================================================
  -->
  <mew-overlay
    :show-overlay="open"
    title="Repay"
    right-btn-text="Close"
    :close="close"
  >
    <template #mewOverlayBody>
      <div>
        <aave-amount-form
          :selected-token="selectedToken"
          :handler="handler"
          :action-type="repay"
          @cancel="handleCancel"
          @emitValues="handleRepayAmount"
        />
      </div>
    </template>
  </mew-overlay>
</template>

<script>
import { ACTION_TYPES } from '../handlers/helpers';
import AaveAmountForm from './AaveAmountForm';
export default {
  components: {
    AaveAmountForm
  },
  props: {
    handler: {
      type: [Object, null],
      validator: item => typeof item === 'object' || null,
      default: () => {}
    },
    selectedToken: {
      default: () => {
        return {};
      },
      type: Object
    },
    open: {
      default: false,
      type: Boolean
    },
    close: {
      default: () => {},
      type: Function
    }
  },
  data() {
    return {
      repay: ACTION_TYPES.repay,
      amount: '',
      amountUsd: '$ 0.00'
    };
  },
  computed: {},
  methods: {
    handleRepayAmount(e) {
      this.amount = e;
    },
    handleCancel() {
      this.amount = '0';
      this.close();
    }
  }
};
</script>
