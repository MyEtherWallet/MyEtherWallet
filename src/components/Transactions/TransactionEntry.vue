<template lang="html">
  <div>
    <div class="top-row">
      <div class="from-address">
        <div class="icon">
          <img
            :src="currencyIcons[details.fromCurrency]"
            height="16"
            width="16">
          <span class="currency">{{ details.fromCurrency }}</span>
        </div>
        <p class="value">{{ details.fromValue }}</p>
      </div>

      <div class="right-arrow">
        <img
          :src="arrowImage"
          height="12"
          width="16">
      </div>

      <div class="to-address">
        <div class="icon">
          <img
            :src="currencyIcons[details.toCurrency]"
            height="16"
            width="16">
          <span class="currency">{{ details.toCurrency }}</span>
        </div>
        <p class="value">{{ details.toValue }}</p>
      </div>
    </div>

    <div class="middle-row">
      <div class="status-indicator-container">
        <div class="status-indicator">
          <div class="status-timer">
            <p >{{ calculateTimeRemaining(details.parsed) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-row">
      <div class="line"/>
      <div class="check-history-container">
        <h4
          class="check-history"
          @click="checkHistory">Check history</h4>
      </div>
    </div>
  </div>
</template>

<script>
import iconBtc from '@/assets/images/currency/btc.svg';
import iconEth from '@/assets/images/currency/eth.svg';
import Arrow from '@/assets/images/etc/single-arrow.svg';

export default {
  props: {
    provider: {
      type: Object,
      default: function() {
        return {};
      }
    },
    details: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      network: this.$store.state.network.types.name,
      currencyIcons: {
        BTC: iconBtc,
        ETH: iconEth
      },
      arrowImage: Arrow
    };
  },
  computed: {
    // sortedTransactions() {}
  },
  watch: {},
  mounted() {
    this.statusUpdater();
  },
  methods: {
    countUnread() {},
    checkHistory() {},
    expand(idx, notif) {
      const updatedNotif = notif;
      if (notif.expanded !== true) {
        updatedNotif.read = true;
        updatedNotif.expanded = true;
      } else {
        updatedNotif.expanded = false;
      }
      this.$store.dispatch('updateTransactions', [
        this.$store.state.wallet.getAddressString(),
        idx,
        updatedNotif
      ]);
    },
    statusUpdater() {
      // return () => {
      // let currentStatus;
      // const parsed = this.provider.parseOrder(this.details);
      // const timeRemaining = this.calculateTimeRemaining(parsed);
      const checkStatus = setInterval(async () => {
        // currentStatus = await this.provider.getOrderStatus(this.details);
        clearInterval(checkStatus);
      }, 1000);
      // };
    },
    calculateTimeRemaining({ validFor, timestamp }) {
      return (
        validFor -
        parseInt((new Date().getTime() - new Date(timestamp).getTime()) / 1000)
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import './Transactions.scss';
</style>
