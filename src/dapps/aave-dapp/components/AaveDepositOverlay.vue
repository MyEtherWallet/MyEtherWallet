<template>
  <mew-overlay
    :show-overlay="open"
    title="Select Token to Deposit"
    right-btn-text="Close"
    :close="close"
  >
    <template #mewOverlayBody>
      <!--
      =====================================================================================
        Aave token deposit table
      =====================================================================================
      -->
      <v-sheet
        v-if="step === 0"
        color="white"
        max-width="650px"
        class="border-radius--10px pa-4"
      >
        <aave-table
          :handler="handler"
          @selectedDeposit="handleSelectedDeposit"
        />
      </v-sheet>
      <!--
        =====================================================================================
          Aave Summary
        =====================================================================================
        -->
      <div v-if="step === 1 || step === 3">
        <aave-summary
          :selected-token="selectedToken"
          :handler="handler"
          :amount="amount"
          :amount-usd="amountUsd"
          :step="step"
          @confirmed="handleConfirm"
        />
      </div>
      <div v-if="step === 2">
        <aave-amount-form
          :selected-token="selectedToken"
          :handler="handler"
          @cancelDeposit="handleCancel"
          @confirmDepositAmt="handleDepositAmount"
          @makeDeposit="emitDeposit"
        />
      </div>
    </template>
  </mew-overlay>
</template>

<script>
import AaveTable from './AaveTable';
import AaveSummary from './AaveSummary';
import AaveAmountForm from './AaveAmountForm.vue';

export default {
  components: { AaveTable, AaveSummary, AaveAmountForm },
  props: {
    open: {
      default: false,
      type: Boolean
    },
    close: {
      default: function () {
        return {};
      },
      type: Function
    },
    handler: {
      type: [Object, null],
      validator: item => typeof item === 'object' || null,
      default: () => {}
    }
  },
  data() {
    return {
      step: 0,
      selectedToken: {},
      amount: '0',
      amountUsd: '$ 0.00'
    };
  },
  watch: {
    open(newVal) {
      if (!newVal) {
        this.step = 0;
        this.selectedToken = {};
      }
    }
  },
  methods: {
    handleSelectedDeposit(val) {
      this.selectedToken = val;
      this.step += 1;
    },
    handleConfirm() {
      this.step += 1;
    },
    handleDepositAmount(e) {
      this.step += 1;
      this.amount = e[0];
      this.amountUsd = e[1];
    },
    handleCancel() {
      this.close();
    },
    emitDeposit(e) {
      this.$emit('makeDeposit', e);
      this.close();
    }
  }
};
</script>

<style lang="scss" scoped></style>
