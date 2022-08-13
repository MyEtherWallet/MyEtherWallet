<template>
  <!--
  =====================================================================================
    Withdraw Overlay
  =====================================================================================
  -->
  <mew-overlay
    :show-overlay="open"
    title="Select your interest rate"
    :close="resetToggle"
  >
    <aave-select-interest
      :selected-token="selectedTokenDetails"
      @continue="handleSetInterestRate"
    />
  </mew-overlay>
</template>

<script>
import { Toast, WARNING } from '@/modules/toast/handler/handlerToast';
import handlerAave from '../../handlers/handlerAave.mixin';
import { INTEREST_TYPES } from '../../handlers/helpers';
import AaveSelectInterest from '../AaveSelectInterest';
export default {
  name: 'AaveSetAprOverlay',
  components: {
    AaveSelectInterest
  },
  mixins: [handlerAave],
  data() {
    return {
      rateType: ''
    };
  },
  methods: {
    handleSetInterestRate(e) {
      this.rateType = e.type;
      const type =
        this.selectedTokenInUserSummary.variableBorrows > 0
          ? INTEREST_TYPES.variable
          : INTEREST_TYPES.stable;
      const param = {
        reserve: this.selectedTokenDetails.underlyingAsset,
        rateMode: type === INTEREST_TYPES.variable ? 2 : 1, // rateMode to switch FROM
        symbol: this.selectedTokenDetails.symbol
      };
      if (e.type === type) {
        Toast(`Selected rate is already ${e.type}`, {}, WARNING);
      } else {
        this.$emit('onConfirm', param);
        this.close();
      }
    },
    resetToggle() {
      const type =
        this.selectedTokenInUserSummary.variableBorrows > 0
          ? INTEREST_TYPES.variable
          : INTEREST_TYPES.stable;
      const param = {
        reserve: this.selectedTokenDetails.symbol,
        value: type === INTEREST_TYPES.variable // rateMode to reset to
      };
      this.$emit('onClose', param);
      this.close();
    }
  }
};
</script>
