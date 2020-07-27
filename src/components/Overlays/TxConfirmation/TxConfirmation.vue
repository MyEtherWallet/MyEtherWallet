<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <OverlayTitle title="Confirmation" />
    <mew6-white-sheet>
      <div class="overlay-content">
        <div class="pa-8">
          <FromToBlock />
          <BalanceBlock />

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
import BaseOverlay from '../BaseOverlay';
import OverlayTitle from '@/components/OverlayTitle';
import ConfirmTransaction from '@/components/WarningBlocks/ConfirmTransaction';
import DividerX from '@/components/DividerX';
import FromToBlock from '@/components/FromToBlock';
import BalanceBlock from '@/components/BalanceBlock';
import ExpantionBlock from '@/components/ExpantionBlock';

export default {
  components: {
    BaseOverlay,
    OverlayTitle,
    ConfirmTransaction,
    DividerX,
    FromToBlock,
    BalanceBlock,
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
