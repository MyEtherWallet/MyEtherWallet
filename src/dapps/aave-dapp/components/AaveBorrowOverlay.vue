<template>
  <mew-overlay
    :show-overlay="open"
    title="Select Token to Borrow"
    right-btn-text="Close"
    :close="callClose"
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
          :table-header="aaveTableHandler"
          @selectedBorrow="handleSelectedBorrow"
        />
      </v-sheet>
      <!--
      =====================================================================================
        Aave token borrow form
      =====================================================================================
      -->
      <div v-if="step === 1">
        <aave-amount-form
          :selected-token="selectedToken"
          :handler="handler"
          :action-type="aaveTableHandler"
          @cancelDeposit="handleCancel"
          @emitValues="handleValues"
        />
      </div>
      <!--
      =====================================================================================
        Aave summary borrow
      =====================================================================================
      -->
      <div v-if="step === 2">
        <aave-select-interest :on-stable="true" :handler="handler" />
      </div>
    </template>
  </mew-overlay>
</template>

<script>
import AaveTable from './AaveTable';
// import AaveSummary from './AaveSummary';
import AaveAmountForm from './AaveAmountForm.vue';
import AaveSelectInterest from './AaveSelectInterest.vue';
import { AAVE_TABLE_HEADER } from '../handlers/helpers';
export default {
  components: { AaveTable, AaveAmountForm, AaveSelectInterest },
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
      aaveTableHandler: AAVE_TABLE_HEADER.BORROW,
      amount: '0',
      amountUsd: '$ 0.00'
    };
  },
  methods: {
    handleSelectedBorrow(e) {
      this.selectedToken = e;
      this.step += 1;
    },
    handleValues(e) {
      this.step += 1;
      this.amount = e[0];
      this.amountUsd = e[1];
    },
    handleCancel() {
      this.callClose();
    },
    callClose() {
      this.step = 0;
      this.selectedToken = {};
      this.aaveTableHandler = AAVE_TABLE_HEADER.BORROW;
      this.amount = '0';
      this.amountUsd = '$ 0.00';
      this.close();
    }
  }
};
</script>

<style lang="scss" scoped></style>
