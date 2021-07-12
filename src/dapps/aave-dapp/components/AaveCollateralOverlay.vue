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
        :user-summary="userSummary"
        :selected-token="preSelectedToken"
        :reserves-data="reservesData"
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
import handlerAaveOverlay from '../handlers/handlerAaveOverlay.mixin';
export default {
  components: { AaveSummary },
  mixins: [handlerAaveOverlay],
  props: {
    userSummary: {
      type: Object,
      default: () => {}
    },
    reservesData: {
      type: Array,
      default: () => []
    },
    preSelectedToken: {
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
