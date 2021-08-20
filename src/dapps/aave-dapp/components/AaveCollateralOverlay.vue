<template>
  <!--
  =====================================================================================
    Collateral Overlay
  =====================================================================================
  -->
  <mew-overlay :show-overlay="open" :title="title" :close="close">
    <aave-summary
      :handler="handler"
      :selected-token="preSelectedToken"
      :action-type="collateral"
      @onConfirm="callSwitchCollateral"
    />
  </mew-overlay>
</template>

<script>
import AaveSummary from './AaveSummary';
import { ACTION_TYPES } from '@/dapps/aave-dapp/handlers/helpers';
import { mapState } from 'vuex';
import aaveOverlayMixin from '../handlers/aaveOverlayMixin';
export default {
  components: { AaveSummary },
  mixins: [aaveOverlayMixin],
  data() {
    return {
      collateral: ACTION_TYPES.collateral
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    title() {
      return Object.keys(this.preSelectedToken).length === 0
        ? ''
        : this.preSelectedToken?.toggle?.value
        ? 'Usage as collateral'
        : 'Disable usage as collateral';
    }
  },
  methods: {
    callSwitchCollateral() {
      const param = {
        aavePool: 'proto',
        userAddress: this.address,
        reserve: this.actualToken.underlyingAsset,
        interestRateMode: this.type,
        usageAsCollateral: !this.actualToken.usageAsCollateralEnabled
      };

      this.$emit('onConfirm', param);
      this.close();
    }
  }
};
</script>
