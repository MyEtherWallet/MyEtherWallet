<template>
  <!--
  =====================================================================================
    Withdraw Overlay
  =====================================================================================
  -->
  <mew-overlay
    :show-overlay="open"
    title="Select your interest rate"
    right-btn-text="Close"
    :close="close"
  >
    <template #mewOverlayBody>
      <div>
        <aave-select-interest
          :selected-token="actualToken"
          @continue="handleSetInterestRate"
        />
      </div>
    </template>
  </mew-overlay>
</template>

<script>
import { Toast, WARNING } from '@/modules/toast/handler/handlerToast';
import aaveOverlayMixin from '../handlers/aaveOverlayMixin';
import AaveSelectInterest from './AaveSelectInterest';
export default {
  components: {
    AaveSelectInterest
  },
  mixins: [aaveOverlayMixin],
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
        reserve: this.actualToken.underlyingAsset
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
