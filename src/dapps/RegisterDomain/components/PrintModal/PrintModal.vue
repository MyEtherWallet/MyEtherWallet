<template>
  <b-modal
    ref="print"
    title="Print Preview"
    hide-footer
    centered
    class="nopadding print-mod"
    size="lg"
  >
    <div id="printContainer" class="print-modal"></div>
    <div class="button-container">
      <div class="print-button" @click="print">Print</div>
    </div>
  </b-modal>
</template>
<script>
import printJS from 'print-js';
import html2canvas from 'html2canvas';

export default {
  props: {
    actualBid: {
      type: String,
      default: '0.01'
    },
    bidMask: {
      type: String,
      default: '0.02'
    },
    revealDate: {
      type: Number,
      default: 1547489617293
    },
    auctionEnd: {
      type: Number,
      default: 1547489617293
    },
    secretPhrase: {
      type: String,
      default: 'example secret phrase'
    },
    jsonString: {
      type: String,
      default:
        '{"name":"mewtopia.eth","nameSHA3":"0xf7944c277d363b1bf85d10f3cd04bc00f0dbe5f7b8c8984664a17e0d471eb238","bidAmount":0.01,"bidMask":0.02,"value":"10000000000000000","secretPhrase":"sure beef match","secretPhraseSHA3":"0xeff0abbcd7596fc7cef758639a5ef3856fa2b8f07201d8fa7b52f7bdb9789d1a"}'
    }
  },
  data() {
    return {};
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
