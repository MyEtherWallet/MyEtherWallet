<template>
  <!--
  =====================================================================================
    Withdraw Overlay
  =====================================================================================
  -->
  <mew-overlay
    :show-overlay="open"
    title="Select your interest rate"
    :close="close"
  >
    <div>
      <aave-select-interest
        :selected-token="selectedTokenDetails"
        @continue="handleSetInterestRate"
      />
    </div>
  </mew-overlay>
</template>

<script>
import { Toast, WARNING } from '@/modules/toast/handler/handlerToast';
import handlerAave from '../handlers/handlerAave.mixin';
import AaveSelectInterest from './AaveSelectInterest';
export default {
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
      this.rateType = e;
      const param = {
        aavePool: 'proto',
        userAddress: this.address,
        reserve: this.selectedTokenDetails.underlyingAsset
      };
      if (
        e.toLowerCase() ===
        this.selectedTokenInUserSummary.borrowRateMode.toLowerCase()
      ) {
        Toast(`Selected rate is already ${e}`, {}, WARNING);
      } else {
        this.$emit('onConfirm', param);
        this.close();
      }
    }
  }
};
</script>
