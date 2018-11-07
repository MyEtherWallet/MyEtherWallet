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
            <p v-if="swapWindowOpen && !completed">{{ parseTimeRemaining }}</p>
            <p v-if="!swapWindowOpen && !completed">Order Expired</p>
            <p v-if="completed">Order Complete</p>
          </div>
        </div>
      </div>
    </div>
{{currentStatus}}
  </div>
</template>

<script>
import iconBtc from '@/assets/images/currency/btc.svg';
import iconEth from '@/assets/images/currency/eth.svg';
import Arrow from '@/assets/images/etc/single-arrow.svg';

export default {
  props: {
    provider: {
      type: Function,
      default: function() {}
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
      network: this.$store.state.network.type.name,
      currencyIcons: {
        BTC: iconBtc,
        ETH: iconEth
      },
      arrowImage: Arrow,
      parsed: {},
      timeRemaining: '',
      currentStatus: ''
    };
  },
  computed: {
    parseTimeRemaining() {
      const seconds = Math.floor(this.timeRemaining % 60);
      const minutes = Math.floor((this.timeRemaining / 60) % 60);
      // const hours = Math.floor((this.timeRemaining / (60 * 60)) % 24);
      // const days = Math.floor(this.timeRemaining / (60 * 60 * 24));
      return seconds >= 10 ? `${minutes}:${seconds}` : `${minutes}:0${seconds}`;
    },
    swapWindowOpen() {
      return this.timeRemaining > 0;
    },
    completed() {
      if (this.currentStatus === 0) {
        return true;
      }
      return false;
    }
  },
  watch: {
    details(newVal) {
      console.log(newVal); // todo remove dev item
    }
  },
  mounted() {
    this.parsed = this.provider.parseOrder(this.details.dataForInitialization);
    this.timeUpdater();
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
    timeUpdater() {
      this.timeRemaining = this.calculateTimeRemaining(this.parsed);
      const timerInterval = setInterval(() => {
        this.timeRemaining = this.calculateTimeRemaining(this.parsed);
        if (this.timeRemaining < 0) {
          clearInterval(timerInterval);
        }
      }, 1000);
    },
    statusUpdater() {
      let updating = false;
      const getStatus = async () => {
        // let currentStatus;
        // const parsed = this.provider.parseOrder(this.details);
        if (!updating) {
          updating = true;
          this.currentStatus = await this.provider.getOrderStatus(this.details);
          updating = false;
        }
      };

      const statusInterval = setInterval(() => {
        getStatus();
        if (this.timeRemaining < 0) {
          clearInterval(statusInterval);
        }
      }, 1000);
    },
    calculateTimeRemaining(parsed) {
      return (
        parsed.validFor -
        parseInt(
          (new Date().getTime() - new Date(parsed.timestamp).getTime()) / 1000
        )
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../Transactions';
</style>
