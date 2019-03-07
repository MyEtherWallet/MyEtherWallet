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
import { mapGetters } from 'vuex';
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
    return {
      header: 'MY ADDRESS ICON',
      subheader: 'Always look for this icon when sending to this wallet',
      mew: 'MyEtherWallet',
      paper: 'Paper Wallet',
      link1: 'support@myetherwallet.com',
      link2: 'https://www.myetherwallet.com',
      myAddress: 'MY ADDRESS',
      myPriv: 'MY PRIVATE KEY',
      content: {
        text1: 'Please Keep Your Paper Wallet at a',
        text2: 'Place! Please',
        text3: 'Share Your Private Key With Anyone!',
        red1: 'SAFE',
        red2: 'DO NOT'
      }
    };
  },
  computed: {
    ...mapGetters({
      wallet: 'wallet'
    })
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
