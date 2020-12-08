<template>
  <mew-overlay
    color-type="mewBg"
    :show-overlay="open"
    title="My paper wallet"
    right-btn-text="Close"
    @closeOverlay="$emit('close')"
  >
    <template #mewOverlayBody>
      <div ref="printContainer" class="to-print">
        <content-to-print :address="address" :private-key="key" />
      </div>

      <v-sheet color="transparent" max-width="800px">
        <mew6-white-sheet>
          <div class="pa-10">
            <div class="d-block d-lg-flex justify-space-between align-start">
              <div class="d-flex align-center">
                <img
                  height="35"
                  src="@/assets/images/icons/logo-mew-dark.png"
                />
                <div class="primary--text d-none d-lg-block">
                  <span class="mx-3">|</span>Paper Wallet
                </div>
              </div>
              <div class="mt-3 mt-lg-0">
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
            <div class="mt-4 d-block d-lg-flex align-content-stretch">
              <v-sheet
                min-height="100px"
                class="d-flex flex-column justify-center flex-grow-1 px-8 border-radius--10px mr-0 mr-lg-5"
                color="tableHeader"
              >
                <div class="subtitle-1 font-weight-black text-uppercase">
                  My Public Address
                </div>
                <div
                  style="max-width: 50vw"
                  class="monospace text-overflow--break-word"
                >
                  {{ address }}
                </div>
              </v-sheet>

              <v-sheet height="130px" class="qr-image">
                <VueQrcode
                  :value="address"
                  :options="{ size: 130 }"
                ></VueQrcode>
              </v-sheet>
            </div>

            <div class="cut-line my-7"></div>

            <div class="font-weight-black">
              You might LOSE your MONEY if you share this Private Key with
              anyone!
            </div>
            <div class="mt-4 d-block d-lg-flex align-content-stretch">
              <v-sheet
                min-height="100px"
                class="d-flex flex-column justify-center flex-grow-1 px-8 border-radius--10px mr-0 mr-lg-5"
                color="tableHeader"
              >
                <div class="subtitle-1 font-weight-black text-uppercase">
                  My Address
                </div>
                <div
                  style="max-width: 50vw"
                  class="monospace text-overflow--break-word"
                >
                  {{ address }}
                </div>
              </v-sheet>
              <v-sheet height="130px" class="qr-image">
                <VueQrcode
                  :value="address"
                  :options="{ size: 130 }"
                ></VueQrcode>
              </v-sheet>
            </div>

            <div class="py-2"></div>

            <div class="mt-4 d-block d-lg-flex align-content-stretch">
              <v-sheet
                min-height="100px"
                class="d-flex flex-column justify-center flex-grow-1 px-8 border-radius--10px mr-0 mr-lg-5"
                color="tableHeader"
              >
                <div
                  class="subtitle-1 font-weight-black text-uppercase red--text"
                >
                  My Private Key
                </div>
                <div
                  style="max-width: 50vw"
                  class="monospace text-overflow--break-word"
                >
                  {{ key }}
                </div>
              </v-sheet>
              <v-sheet height="130px" class="qr-image">
                <VueQrcode :value="key" :options="{ size: 130 }"></VueQrcode>
              </v-sheet>
            </div>

            <div v-if="false" class="cut-line my-7"></div>

            <div v-if="false" class="text-center">
              <img
                src="@/assets/images/backgrounds/bg-paper-wallet.png"
                alt="Spaceman"
                width="250"
              />
            </div>
          </div>
        </mew6-white-sheet>

        <div class="d-flex justify-center mt-12">
          <mew-button title="Print" btn-size="xlarge" @click.native="print" />
        </div>
      </v-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import VueQrcode from '@xkeshi/vue-qrcode';
import printJS from 'print-js';
import html2canvas from 'html2canvas';
import contentToPrint from './content-to-print/ContentToPrint';

export default {
  components: {
    VueQrcode,
    contentToPrint
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
  },
  methods: {
    async print() {
      try {
        const element = this.$refs.printContainer;
        const screen = await html2canvas(element, {
          async: true,
          logging: false
        }).then(canvas => {
          return canvas;
        });
        if (screen && screen.toDataURL !== '') {
          printJS({
            printable: screen.toDataURL('image/png'),
            documentTitle:
              'MyEtherwallet Paper Wallet (DO NOT SHARE THIS WITH OTHER PEOPLE)',
            type: 'image',
            onError: () => {
              /*
              Toast.responseHandler(
                this.$t('errorsGlobal.print-support-error'),
                Toast.ERROR
              );
              */
            }
          });
        } else {
          /*
          Toast.responseHandler(
            this.$t('errorsGlobal.print-support-error'),
            Toast.ERROR
          );
          */
        }
      } catch (e) {
        // Toast.responseHandler(e, Toast.ERROR);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.overlay-content {
  //width: 800px;
}

.qr-image {
  margin: -6px 0;
}

.cut-line {
  border-bottom: 1px dotted black;
}

.to-print {
  position: fixed;
  top: -5000px;
  left: 0;
  width: 800px;
}
</style>
