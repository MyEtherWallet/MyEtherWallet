<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <h2 class="text-center mb-6">Confirmation</h2>
    <WhiteSheet>
      <div class="overlay-content pa-7"></div>
      <ConfirmTransaction />
    </WhiteSheet>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '../BaseOverlay';
import WhiteSheet from '@/components/Common/WhiteSheet';
import ConfirmTransaction from '@/components/WarningBlocks/ConfirmTransaction';

export default {
  components: { BaseOverlay, WhiteSheet, ConfirmTransaction },
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
  min-width: 500px;
}
</style>
