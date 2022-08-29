<template>
  <!--
  =====================================================================================
    Collateral Overlay
  =====================================================================================
  -->
  <mew-overlay :show-overlay="open" :title="title" :close="resetToggle">
    <aave-summary
      :selected-token="preSelectedToken"
      :action-type="collateral"
      :amount="tokenAmount"
      @onConfirm="callSwitchCollateral"
    />
  </mew-overlay>
</template>

<script>
import AaveSummary from '../AaveSummary';
import { ACTION_TYPES } from '@/dapps/aave-dapp/handlers/helpers';
import { mapState } from 'vuex';
import handlerAave from '../../handlers/handlerAave.mixin';
export default {
  name: 'AaveCollateralOverlay',
  components: { AaveSummary },
  mixins: [handlerAave],
  props: {
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
      collateral: ACTION_TYPES.collateral
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    title() {
      return !this.selectedTokenInUserSummary
        ? ''
        : !this.selectedTokenInUserSummary?.usageAsCollateralEnabledOnUser
        ? 'Usage as collateral'
        : 'Disable usage as collateral';
    },
    tokenAmount() {
      return this.selectedTokenInUserSummary?.underlyingBalance;
    }
  },
  methods: {
    callSwitchCollateral() {
      const param = {
        reserve: this.selectedTokenDetails.underlyingAsset,
        useAsCollateral:
          !this.selectedTokenInUserSummary.usageAsCollateralEnabledOnUser,
        symbol: this.selectedTokenDetails.symbol
      };
      this.$emit('onConfirm', param);
      this.close();
    },
    resetToggle() {
      const param = {
        reserve: this.selectedTokenDetails.symbol,
        useAsCollateral:
          this.selectedTokenInUserSummary.usageAsCollateralEnabledOnUser
      };
      this.$emit('onClose', param);
      this.close();
    }
  }
};
</script>
