<template>
  <b-modal
    ref="print"
    title="Print Preview"
    hide-footer
    centered
    class="nopadding print-mod"
    size="lg"
  >
    <div id="printContainer" class="print-modal">
      <div class="print-modal-header">
        <div class="logo-container">
          <img src="@/assets/images/logo.png" height="35px" />
          <span class="divider"></span>
          <p>ENS Reveal Bid</p>
        </div>
        <div class="date-container">{{ todaysDate }}</div>
      </div>
      <div class="print-modal-body">
        <div
          v-for="data in Object.keys(displayedData)"
          :key="data"
          class="print-item"
        >
          <p class="print-item-title">{{ displayedData[data].title }}</p>
          <p>{{ displayedData[data].info }}</p>
        </div>
        <div class="json-string-container">
          <p>JSON String</p>
          <div>{{ jsonString }}</div>
        </div>
      </div>
      <div class="print-modal-footer">
        <div>
          <img src="@/assets/images/icons/support.svg" />
          <span>support@myetherwallet.com</span>
        </div>
        <div>
          <img src="@/assets/images/icons/web-solution.svg" />
          <span>https://www.myetherwallet.com</span>
        </div>
      </div>
    </div>
    <div class="button-container">
      <div class="print-button" @click="print">Print</div>
    </div>
  </b-modal>
</template>
<script>
import html2canvas from 'html2canvas';
import printJS from 'print-js';
import { mapGetters } from 'vuex';

export default {
  props: {
    jsonString: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      todaysDate: new Date()
        .toDateString()
        .split(' ')
        .splice(1, 3)
        .join(' ')
    };
  },
  computed: {
    ...mapGetters({
      network: 'network'
    }),
    displayedData() {
      const revealTime = new Date(this.jsonString['revealDate']);
      const auctionEnd = new Date(this.jsonString['auctionDateEnd']);
      const obj = {
        actualBid: {
          title: 'Actual Bid',
          info: `${this.jsonString['bidAmount']} ${this.network.type.name}`
        },
        bidMask: {
          title: 'Bid Mask',
          info: `${this.jsonString['bidMask']} ${this.network.type.name}`
        },
        revealDate: {
          title: 'Reveal Date',
          info: `${revealTime.toGMTString()} / ${revealTime.toLocaleTimeString()}`
        },
        auctionEnd: {
          title: 'Auction End',
          info: `${auctionEnd.toGMTString()} / ${auctionEnd.toLocaleTimeString()}`
        },
        secretPhrase: {
          title: 'Secret Phrase',
          info: this.jsonString['secretPhrase']
        }
      };

      return obj;
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
