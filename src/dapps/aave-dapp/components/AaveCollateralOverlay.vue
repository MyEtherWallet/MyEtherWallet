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
    title() {
      return Object.keys(this.selectedToken).length === 0
        ? ''
        : this.selectedToken?.toggle?.value
        ? 'Usage as collateral'
        : 'Disable usage as collateral';
    }
  },
  methods: {
    callSwitchCollateral() {
      this.$emit('onConfirm');
    }
  }
};
</script>
