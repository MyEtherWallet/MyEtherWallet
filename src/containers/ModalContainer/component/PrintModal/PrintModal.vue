<template>
  <div class="modal-container">
    <b-modal
      ref="print"
      title="Print Preview"
      hide-footer
      centered
      class="nopadding print-mod"
      size="lg"
    >
      <div id="printContainer" class="print-modal">
        <address-print-template v-if="printType === 'address'" />
        <mnemonic-print-template
          v-if="printType === 'mnemonic'"
          :mnemonic="printData"
        />
        <div v-if="printType === 'ens'"></div>
      </div>
      <div class="button-container">
        <div class="print-button" @click="print">Print</div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import AddressPrintTemplate from '../AddressPrintTemplate';
import MnemonicPrintTemplate from '../MnemonicPrintTemplate';
import printJS from 'print-js';
import html2canvas from 'html2canvas';

export default {
  name: 'PrintModal',
  components: {
    'address-print-template': AddressPrintTemplate,
    'mnemonic-print-template': MnemonicPrintTemplate
  },
  props: {
    printType: {
      type: String,
      default: ''
    },
    printData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    async print() {
      const element = document.getElementById('printContainer');
      const screen = await html2canvas(element, {
        async: true,
        logging: false
      }).then(canvas => {
        return canvas;
      });

      printJS({
        printable: screen.toDataURL('image/png'),
        type: 'image'
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'PrintModal.scss';
</style>
