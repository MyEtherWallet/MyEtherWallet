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
        <address-print-template v-if="printType === printAddr" />
        <mnemonic-print-template
          v-if="printType === printMnem"
          :mnemonic="printData"
        />
        <ens-print-template
          v-if="printType === printEns"
          :json-string="printData"
        />
      </div>
      <div class="button-container">
        <div class="print-button" @click="print">Print</div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import AddressPrintTemplate from '../../templates/AddressPrintTemplate';
import MnemonicPrintTemplate from '../../templates/MnemonicPrintTemplate';
import EnsPrintTemplate from '../../templates/EnsPrintTemplate';
import printJS from 'print-js';
import html2canvas from 'html2canvas';
import {
  PRINT_ENS,
  PRINT_ADDRESS,
  PRINT_MNEMONIC
} from '../../modalTypes.js';

export default {
  name: 'PrintModal',
  components: {
    'address-print-template': AddressPrintTemplate,
    'ens-print-template': EnsPrintTemplate,
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
  data() {
    return {
      printEns: PRINT_ENS,
      printAddr: PRINT_ADDRESS,
      printMnem: PRINT_MNEMONIC
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
