<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <h2 class="text-center mb-6">Confirmation</h2>
    <WhiteSheet>
      <div class="overlay-content">
        <div class="pa-8">
          <div class="text-center">
            <StdButton>Confirm &amp; send</StdButton>
          </div>
        </div>
        <ConfirmTransaction />
      </div>
    </WhiteSheet>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '../BaseOverlay';
import WhiteSheet from '@/components/Common/WhiteSheet';
import ConfirmTransaction from '@/components/WarningBlocks/ConfirmTransaction';
import StdButton from '@/components/StdButton';

export default {
  components: { BaseOverlay, WhiteSheet, ConfirmTransaction, StdButton },
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
  max-width: 550px;
}
</style>
