<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <OverlayTitle title="Confirmation" />
    <WhiteSheet>
      <div class="overlay-content">
        <div class="pa-8">
          <FromToBlock />
          <BalanceBlock />

          <DividerX class="my-9" />

          <ExpantionBlock />

          <DividerX class="my-9" />

          <div class="text-center">
            <StdButton>Confirm & send</StdButton>
          </div>
        </div>
        <ConfirmTransaction />
      </div>
    </WhiteSheet>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '../BaseOverlay';
import OverlayTitle from '@/components/OverlayTitle';
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import ConfirmTransaction from '@/components/WarningBlocks/ConfirmTransaction';
import StdButton from '@/web//components/StdButton';
import DividerX from '@/components/DividerX';
import FromToBlock from '@/components/FromToBlock';
import BalanceBlock from '@/components/BalanceBlock';
import ExpantionBlock from '@/components/ExpantionBlock';

export default {
  components: {
    BaseOverlay,
    OverlayTitle,
    WhiteSheet,
    ConfirmTransaction,
    StdButton,
    DividerX,
    FromToBlock,
    BalanceBlock,
    ExpantionBlock
  },
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function() {
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
@import '@/assets/styles/GlobalVariables.scss';

.overlay-content {
  width: 650px;
}
</style>
