<template>
  <div class="modal-container">
    <b-modal
      ref="print"
      title="Print Preview"
      hide-footer
      centered
      class="nopadding print-mod"
      size="lg"
      static="true"
      lazy="true"
    >
      <div class="modal-content-container">
        <div ref="printContainer" class="print-modal">
          <div class="to-print">
            <account-content-to-print :address="address" />
          </div>
        </div>
        <div class="to-display">
          <account-content-to-display :address="address" />
        </div>
        <div class="button-container">
          <div class="print-button" @click="print">Print</div>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import Blockie from '@/components/Blockie';
import printJS from 'print-js';
import html2canvas from 'html2canvas';
import AccountContentToDisplay from './components/AccountContentToDisplay';
import AccountContentToPrint from './components/AccountContentToPrint';

export default {
  components: {
    blockie: Blockie,
    'account-content-to-display': AccountContentToDisplay,
    'account-content-to-print': AccountContentToPrint
  },
  props: {
    address: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  methods: {
    async print() {
      const element = this.$refs.printContainer;
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
