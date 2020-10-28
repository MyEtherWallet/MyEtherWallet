<template>
  <mew-overlay
    color-type="mewBg"
    :show-overlay="open"
    title="My paper wallet"
    right-btn-text="Close"
    @closeOverlay="$emit('close')"
  >
    <template #mewOverlayBody>
      <v-sheet color="transparent" max-width="800px">
        <mew6-white-sheet>
          <div class="pa-10">
            <div class="d-flex justify-space-between align-start">
              <div class="d-flex align-center">
                <img
                  height="35"
                  src="@/assets/images/icons/logo-mew-dark.png"
                />
                <div class="primary--text">
                  <span class="mx-3">|</span>Paper Wallet
                </div>
              </div>
              <div>
                <div class="d-flex align-center mr-3 mb-2">
                  <v-icon class="mr-2" color="titlePrimary" small
                    >mdi-email-open</v-icon
                  >
                  <div>support@myetherwallet.com</div>
                </div>
                <div class="d-flex align-center mr-3">
                  <v-icon class="mr-2" color="titlePrimary" small
                    >mdi-home</v-icon
                  >
                  <div>https://www.myetherwallet.com</div>
                </div>
              </div>
            </div>
            <div class="mt-5 d-flex align-center">
              <mew-blockie
                :address="address"
                width="60px"
                height="60px"
                class="mr-4"
              />
              <v-sheet color="transparent" max-width="400px">
                <div class="subtitle-1 font-weight-black text-uppercase">
                  My address icon
                </div>
                <div>
                  Always look for the icon when sending to this wallet. And
                  please keep your paper wallet at a
                  <span class="text-uppercase red--text font-weight-medium"
                    >Safe Place!</span
                  >
                </div>
              </v-sheet>
            </div>
            <div class="mt-4 d-flex align-content-stretch">
              <v-sheet
                class="d-flex flex-column justify-center flex-grow-1 px-8 border-radius--10px"
                :color="gray"
              >
                <div class="subtitle-1 font-weight-black text-uppercase">
                  My Public Address
                </div>
                <div>{{ address }}</div>
              </v-sheet>

              <v-sheet height="130px" class="qr-image">
                <VueQrcode
                  :value="address"
                  :options="{ size: 130 }"
                ></VueQrcode>
              </v-sheet>
            </div>

            <div
              class="cut-line my-5 mx-n4 gray3--text overflow--hidden white-space--nowrap"
            >
              --------------------------------------------------------------------------------------------------------
            </div>

            <div class="font-weight-black">
              You might LOSE your MONEY if you share this Private Key with
              anyone!
            </div>
            <div class="mt-4 d-flex align-content-stretch">
              <v-sheet
                class="d-flex flex-column justify-center flex-grow-1 px-8 border-radius--10px"
                :color="gray"
              >
                <div class="subtitle-1 font-weight-black text-uppercase">
                  My Address
                </div>
                <div>{{ address }}</div>
              </v-sheet>
              <v-sheet height="130px" class="qr-image">
                <VueQrcode
                  :value="address"
                  :options="{ size: 130 }"
                ></VueQrcode>
              </v-sheet>
            </div>
            <div class="mt-4 d-flex align-content-stretch">
              <v-sheet
                class="d-flex flex-column justify-center flex-grow-1 px-8 border-radius--10px"
                :color="gray"
              >
                <div
                  class="subtitle-1 font-weight-black text-uppercase red--text"
                >
                  My Private Key
                </div>
                <div>{{ key }}</div>
              </v-sheet>
              <v-sheet height="130px" class="qr-image">
                <VueQrcode :value="key" :options="{ size: 130 }"></VueQrcode>
              </v-sheet>
            </div>
            <div
              class="cut-line my-5 mx-n4 gray3--text overflow--hidden white-space--nowrap"
            >
              --------------------------------------------------------------------------------------------------------
            </div>

            <div class="text-center">
              <img
                src="@/assets/images/backgrounds/bg-paper-wallet.png"
                alt="Spaceman"
                height="250"
              />
            </div>
          </div>
        </mew6-white-sheet>

        <div class="d-flex justify-center mt-12">
          <mew-button title="Print" btn-size="xlarge" />
        </div>
      </v-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import VueQrcode from '@xkeshi/vue-qrcode';

export default {
  components: {
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
      gray: '#f6f6f6',
      address: '0xd7B9A9b2F665849C4071Ad5af77d8c76aa30fb32',
      key: '89027359234578623478563284756023475603452623457260345'
    };
  }
};
</script>

<style lang="scss" scoped>
.overlay-content {
  width: 800px;
}

.qr-image {
  margin: -6px 0;
}

.cut-line {
  font-size: 22px;
  letter-spacing: 5px;
  text-align: center;
}
</style>
