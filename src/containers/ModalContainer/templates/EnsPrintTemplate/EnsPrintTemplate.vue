<template>
  <div class="ens-print-modal">
    <div class="ens-print-header">
      <div class="logo-container">
        <img src="@/assets/images/logo.png" height="35px" />
        <span class="divider"></span>
        <p>ENS Reveal Bid</p>
      </div>
      <div class="date-container">{{ todaysDate }}</div>
    </div>
    <div class="ens-print-body">
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
    <div class="ens-print-footer">
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
</template>
<script>
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
        .join(' '),
      loading: false
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
  }
};
</script>

<style lang="scss" scoped>
@import 'EnsPrintTemplate.scss';
</style>
