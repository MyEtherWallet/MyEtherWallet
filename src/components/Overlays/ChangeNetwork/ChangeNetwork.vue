<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <v-theme-provider root>
      <v-sheet color="transparent" width="600px">
        <OverlayTitle title="Network" />
        <WhiteSheet>
          <div class="pa-5">
            aaa
          </div>
        </WhiteSheet>
        <div class="d-flex justify-center mt-9">
          <StdButton size="x-large">
            Change
          </StdButton>
        </div>
      </v-sheet>
    </v-theme-provider>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '../BaseOverlay';
import OverlayTitle from '@/components/OverlayTitle';
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import StdButton from '@/web/components/StdButton';

export default {
  components: {
    BaseOverlay,
    OverlayTitle,
    WhiteSheet,
    StdButton
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

<style lang="scss" scoped></style>
