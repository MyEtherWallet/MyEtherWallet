<template>
  <div>
    <mew-overlay
      color-type="mewBg"
      :show-overlay="open"
      title="My paper wallet"
      right-btn-text="Close"
      :close="close"
    >
      <template #mewOverlayBody>
        <v-sheet max-width="800px" color="transparent">
          <mew6-white-sheet class="pa-12">
            <!--
            ===============================================
            Printable paper wallet content
            ===============================================
            -->
            <div ref="printContainer" class="printable-wallet">
              <paper-wallet-content printable />
            </div>

            <!--
            ===============================================
            Paper wallet to show
            ===============================================
            -->
            <paper-wallet-content />
          </mew6-white-sheet>

          <div class="d-flex justify-center mt-12 mb-10">
            <mew-button title="Print" btn-size="xlarge" @click.native="print" />
          </div>
        </v-sheet>
      </template>
    </mew-overlay>
  </div>
</template>

<script>
import PaperWalletContent from './BalanceAddressPaperWalletContent';
import printJS from 'print-js';
import html2canvas from 'html2canvas';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

export default {
  name: 'BalanceAddressPaperWallet',
  components: {
    PaperWalletContent
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
            type: 'image',
            onError: () => {
              Toast(this.$t('errorsGlobal.print-support-error'), ERROR);
            }
          });
        } else {
          Toast(this.$t('errorsGlobal.print-support-error'), ERROR);
        }
      } catch (e) {
        Toast(e, ERROR);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.printable-wallet {
  position: fixed;
  bottom: 0px;
  right: 0px;
  z-index: -1;
}
</style>
