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
        <div v-if="printType === 'address'"></div>
        <div v-else-if="printType === 'mnemonic'">
          <div class="print-container">
            <div class="content">
              <div class="header">
                <img src="~@/assets/images/logo.png" height="30px" />
                <div></div>
                <span>Mnemonic Phrase</span>
              </div>
              <div v-show="isTwentyFour" class="full-mnemonic">
                <div>
                  <div
                    v-for="(item, idx) in mnemonic.slice(0, 12)"
                    :key="item"
                    class="item"
                  >
                    <span>{{ idx + 1 }}. </span>{{ item }}
                  </div>
                </div>
                <div>
                  <div
                    v-for="(item, idx) in mnemonic.slice(12, 24)"
                    :key="item"
                    class="item"
                  >
                    <span>{{ idx + 13 }}.</span> {{ item }}
                  </div>
                </div>
              </div>
              <div v-show="!isTwentyFour" class="half-mnemonic">
                <div
                  v-for="(item, idx) in mnemonic.slice(0, 12)"
                  :key="item"
                  class="item"
                >
                  <span>{{ idx + 1 }}. </span>{{ item }}
                </div>
              </div>
            </div>
            <div class="footer">
              <div>
                <img src="~@/assets/images/icons/support.svg" />
                support@myetherwallet.com
              </div>
              <div>
                <img src="~@/assets/images/icons/web-solution.svg" />
                https://www.myetherwallet.com
              </div>
            </div>
          </div>
        </div>
        <div v-else></div>
      </div>
      <div class="button-container">
        <div class="print-button" @click="print">Print</div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import Blockie from '@/components/Blockie';
import printJS from 'print-js';
import html2canvas from 'html2canvas';

export default {
  name: 'PrintModal',
  components: {
    blockie: Blockie
  },
  props: {
    printType: {
      type: String,
      default: ''
    },
    mnemonic: {
      type: Array,
      default: () => {
        return [];
      }
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
