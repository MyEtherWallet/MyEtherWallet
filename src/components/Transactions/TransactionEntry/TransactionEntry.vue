<template lang="html">
  <div class ="transaction-entry-container">
    <div class="transaction-entry">
      <div class="top-row">
        <div class="from-address">
          <div class="icon">
            <i :class="['cc', details.fromCurrency, 'cc-icon']"></i>
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
            <i :class="['cc', details.toCurrency, 'cc-icon']"></i>
            <span class="currency">{{ details.toCurrency }}</span>
          </div>
          <p class="value">{{ details.toValue }}</p>
        </div>
      </div>
      <div class="middle-row">
        <div class="status-indicator-container">
          <div class="status-indicator">
            <div :class="status-timer">

              <p v-if="swapWindowOpen && !completed">{{ parseTimeRemaining }}{{currentStatus}}</p>
              <p v-if="!swapWindowOpen && !completed">Order Expired</p>
              <p v-if="completed">Order Complete</p>
              <p v-if="swapWindowOpen && !completed">{{currentDisplayStatus}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import '@/assets/images/currency/coins/asFont/cryptocoins.css';
import '@/assets/images/currency/coins/asFont/cryptocoins-colors.css';
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
      currentStatus: '',
      status: ''
    };
  },
  computed: {
    parseTimeRemaining() {
      const seconds = Math.floor(this.timeRemaining % 60);
      const minutes = Math.floor((this.timeRemaining / 60) % 60);
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
    },
    currentDisplayStatus() {
      switch (this.currentStatus) {
        case -1:
          return 'expired';
        case 0:
          return 'completed';
        case 1:
          return 'pending';
        case 2:
          return 'in-progress';
        case 3:
          return 'in-progress';
      }
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
        if (!updating) {
          updating = true;
          this.currentStatus = await this.provider.getOrderStatus(
            this.details,
            this.currentStatus
          );
          console.log(this.currentStatus); // todo remove dev item
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
@import './TransactionEntry';
</style>
