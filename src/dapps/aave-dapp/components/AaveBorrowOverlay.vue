<template>
  <mew-overlay
    :show-overlay="open"
    title="Select Token to Borrow"
    right-btn-text="Close"
    :close="close"
  >
    <template #mewOverlayBody>
      <!--
      =====================================================================================
        Aave token borrow table
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
          :table-header="AAVE_TABLE_HEADER"
          @selectedBorrow="handleSelectedBorrow"
        />
      </v-sheet>
      <!--
      =====================================================================================
        Aave token borrow form
      =====================================================================================
      -->
      <div v-if="step === 2">
        <aave-amount-form
          :selected-token="selectedToken"
          :handler="handler"
          :action-type="AAVE_TABLE_HEADER"
          @cancelDeposit="handleCancel"
          @confirmDepositAmt="handleDepositAmount"
        />
      </div>
    </template>
  </mew-overlay>
</template>

<script>
import AaveTable from './AaveTable';
// import AaveSummary from './AaveSummary';
import AaveAmountForm from './AaveAmountForm.vue';
import { AAVE_TABLE_HEADER } from '../handlers/helpers';
export default {
  components: { AaveTable, AaveAmountForm },
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
      AAVE_TABLE_HEADER: AAVE_TABLE_HEADER.BORROW
    };
  },
  methods: {
    handleSelectedBorrow(e) {
      this.selectedToken = e;
      this.step += 1;
    }
  }
};
</script>

<style lang="scss" scoped></style>
