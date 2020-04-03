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
                <span class="mx-3">|</span>Paper Wallet
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
          <div class="mt-5 d-flex align-center">
            <v-sheet
              :width="blockieSize"
              :height="blockieSize"
              color="transparent"
              class="mr-4"
            >
              <blockie
                :address="address"
                :size="8"
                :scale="16"
                :width="blockieSize"
                :height="blockieSize"
              />
            </v-sheet>
            <v-sheet color="transparent" max-width="400px">
              <div class="subtitle-1 font-weight-bold text-uppercase">
                My address icon
              </div>
              <div>
                Always look for the icon when sending to this wallet. And please
                keep your paper wallet at a
                <span class="text-uppercase red--text font-weight-medium"
                  >Safe Place!</span
                >
              </div>
            </v-sheet>
          </div>
          <div class="mt-4 d-flex">
            <v-sheet color="grey">aaa</v-sheet>
            <div>
              <VueQrcode
                value="Hello, World!"
                :options="{ size: 100 }"
              ></VueQrcode>
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
import Blockie from '@/web/components/Blockie';
import VueQrcode from '@xkeshi/vue-qrcode';

export default {
  components: {
    BaseOverlay,
    OverlayTitle,
    WhiteSheet,
    StdButton,
    Blockie,
    VueQrcode
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
    return {
      blockieSize: '70px',
      address: '0xd7B9A9b2F665849C4071Ad5af77d8c76aa30fb32',
      key: '89027359234578623478563284756023475603452623457260345'
    };
  }
};
</script>

<style lang="scss" scoped>
.overlay-content {
  width: 700px;
}
</style>
