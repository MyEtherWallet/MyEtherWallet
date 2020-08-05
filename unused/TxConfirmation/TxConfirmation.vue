<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <h2 class="text-center pb-8">Confirmation</h2>
    <mew6-white-sheet>
      <div class="overlay-content">
        <div class="pa-8">
          <from-to-block />
          <balance-block />

          <DividerX class="my-9" />

          <ExpantionBlock />

          <DividerX class="my-9" />

          <div class="text-center">
            <mew-button title="Confirm & send" button-size="xlarge" />
          </div>
        </div>
        <ConfirmTransaction />
      </div>
    </mew6-white-sheet>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '@/containers/GlobalOverlayContainer/components/BaseOverlay';
import ConfirmTransaction from '@/components/WarningBlocks/ConfirmTransaction';
import DividerX from '@/components/divider';
import fromToBlock from '@/components/from-to-block';
import balanceBlock from '@/components/balance-block';
import ExpantionBlock from '@/components/ExpantionBlock';

export default {
  components: {
    BaseOverlay,
    ConfirmTransaction,
    DividerX,
    fromToBlock,
    balanceBlock,
    ExpantionBlock
  },
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.overlay-content {
  width: 650px;
}
</style>
