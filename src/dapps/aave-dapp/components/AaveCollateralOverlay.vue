<template>
  <!--
  =====================================================================================
    Collateral Overlay
  =====================================================================================
  -->
  <mew-overlay
    :show-overlay="open"
    :title="title"
    right-btn-text="Close"
    :close="close"
  >
    <template #mewOverlayBody>
      <aave-summary
        :handler="handler"
        :selected-token="selectedToken"
        :action-type="collateral"
        @onConfirm="callSwitchCollateral"
      />
    </template>
  </mew-overlay>
</template>

<script>
import AaveSummary from './AaveSummary';
import { ACTION_TYPES } from '@/dapps/aave-dapp/handlers/helpers';
import { mapState } from 'vuex';
import { _ } from 'web3-utils';
export default {
  components: { AaveSummary },
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
      collateral: ACTION_TYPES.collateral
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    title() {
      return Object.keys(this.selectedToken).length === 0
        ? ''
        : this.selectedToken?.toggle?.value
        ? 'Usage as collateral'
        : 'Disable usage as collateral';
    },
    actualToken() {
      if (
        this.handler &&
        !_.isEmpty(this.handler) &&
        !_.isEmpty(this.selectedToken)
      ) {
        const token = this.handler?.reservesData.find(item => {
          if (item.symbol === this.selectedToken.token) return item;
        });

        return token;
      }
      return {};
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
