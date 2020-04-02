<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <div class="overlay-content">
      <OverlayTitle title="My paper wallet" />
      <WhiteSheet>
        <div class="pa-10">
          <div class="d-flex justify-space-between align-start">
            <div class="d-flex align-center">
              <img width="100" src="@/assets/images/icons/logo-mew-dark.png" />
              <div class="text-color--mew-green">
                <span class="mx-4">|</span>Paper Wallet
              </div>
            </div>
            <div>
              <div class="d-flex align-center mr-3 mb-2">
                <img
                  class="mr-2"
                  height="20"
                  src="@/assets/images/icons/icon-support.svg"
                />
                <div>support@myetherwallet.com</div>
              </div>
              <div class="d-flex align-center mr-3">
                <img
                  class="mr-2"
                  height="20"
                  src="@/assets/images/icons/icon-support.svg"
                />
                <div>https://www.myetherwallet.com</div>
              </div>
            </div>
          </div>
        </div>
      </WhiteSheet>
    </div>
    <div class="d-flex justify-center mt-12">
      <StdButton size="x-large" buttonclass="button--green">
        Print
      </StdButton>
    </div>
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
.overlay-content {
  width: 700px;
}
</style>
