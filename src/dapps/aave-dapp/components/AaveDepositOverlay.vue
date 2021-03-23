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
      <v-sheet color="white" max-width="650px" class="border-radius--10px pa-4" v-if="step === 0">
        <aave-table :handler="handler" @selectedDeposit="handleSelectedDeposit" />
      </v-sheet>
      <!--
        =====================================================================================
          Aave Summary
        =====================================================================================
        -->
        <div v-if="step === 1">
          <aave-summary :selected-deposit="selectedToken" :handler="handler" />
        </div>
    </template>
  </mew-overlay>
</template>

<script>
import AaveTable from './AaveTable';
import AaveSummary from './AaveSummary';

export default {
  components: { AaveTable, AaveSummary },
  props: {
    open: { default: false, type: Boolean },
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
  watch: {
    open() {
      this.step = 0;
      this.selectedToken = {};
    }
  },
  data() {
    return {
      step: 0,
      selectedToken: {}
    };
  },
  methods: {
    handleSelectedDeposit(val) {
      this.selectedToken = val;
      this.step += 1;
    }
  }
};
</script>

<style lang="scss" scoped></style>
