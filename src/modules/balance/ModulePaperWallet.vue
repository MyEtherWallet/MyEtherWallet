<template>
  <mew-overlay
    :footer="footer"
    color-type="white"
    :show-overlay="isOverlayOpen"
    title="My paper wallet"
    content-size="xlarge"
    :close="close"
    @closeOverlay="close"
  >
    <!-- =============================================== -->
    <!-- Printable paper wallet content -->
    <!-- =============================================== -->
    <div ref="printContainer" class="printable-wallet printable-wallet-content">
      <paper-wallet-to-print v-if="instance" />
    </div>

    <!-- =============================================== -->
    <!-- Paper wallet to show -->
    <!-- =============================================== -->
    <paper-wallet-to-display v-if="instance" class="printable-wallet-display" />

    <div class="d-flex justify-center mt-12">
      <mew-button
        class="printButton"
        title="Print"
        btn-size="xlarge"
        @click.native="print"
      />
    </div>
  </mew-overlay>
</template>

<script>
import printJS from 'print-js';
// import html2canvas from 'html2canvas';
import { mapState } from 'vuex';
import domtoimage from 'dom-to-image';

import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { isEmpty } from 'lodash';

export default {
  name: 'BalanceAddressPaperWallet',
  components: {
    PaperWalletToPrint: () => import('./components/PaperWalletToPrint'),
    PaperWalletToDisplay: () => import('./components/PaperWalletToDisplay')
  },
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    },
    isOfflineApp: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      footer: {
        text: 'Need help?',
        linkTitle: 'Contact support',
        link: 'mailto:support@myetherwallet.com'
      }
    };
  },
  computed: {
    ...mapState('wallet', ['instance']),
    isOverlayOpen() {
      return this.open;
    }
  },
  watch: {
    isOverlayOpen(val) {
      if (val === false) {
        this.$emit('close');
      }
    }
  },
  mounted() {
    if (this.isOfflineApp) {
      this.footer = {
        text: 'Need help? Email us at support@myetherwallet.com',
        linkTitle: '',
        link: ''
      };
    }
  },
  methods: {
    async print() {
      try {
        const element = this.$refs.printContainer;
        console.log('element', element);
        // const node = new DOMParser().parseFromString(
        //   element,
        //   'text/html'
        // ).firstElementChild;
        // console.log('node', node);
        // const screen1 = await html2canvas(element, {
        //   async: true,
        //   logging: false
        // }).then(canvas => {
        //   return canvas;
        // });
        // console.log('screen1', screen1);
        // console.log('screen1 dataURL', screen1.toDataURL('image/png'));
        const screen = await domtoimage
          .toPng(element)
          .then(dataUrl => {
            return dataUrl;
          })
          .catch(function (error) {
            console.error('Error when converting dom to image!', error);
          });
        if (!isEmpty(screen)) {
          console.log('screen', screen);
          printJS({
            printable: screen,
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
  top: -3000px;
  left: -3000px;
  z-index: -1;
}
</style>
