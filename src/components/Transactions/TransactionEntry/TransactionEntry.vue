<template lang="html">
  <div class="transaction-entry-container">
    <div class="transaction-entry">
      <div class="top-row">
        <div class="from-address">
          <div class="icon">
            <i :class="['cc', details.fromCurrency, 'cc-icon']"/>
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
            <i :class="['cc', details.toCurrency, 'cc-icon']"/>
            <span class="currency">{{ details.toCurrency }}</span>
          </div>
          <p class="value">{{ details.toValue }}</p>
        </div>
      </div>
      <div class="middle-row">
        <div class="status-indicator-container">
          <div class="status-indicator">
            <div class="status-timer">

              <p v-if="swapWindowOpen && currentStatus < 100 && currentStatus > 0">{{ parseTimeRemaining }}</p>
              <p v-if="currentStatus === -100 || !swapWindowOpen">Order Expired</p>
              <p v-if="currentStatus === 100">Order Complete</p>
              <p v-if="swapWindowOpen && currentStatus < 100 && currentStatus > 0">{{ currentDisplayStatus }}</p>
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
// import { mapGetters } from 'vuex';

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
    },
    historyIndex: {
      type: Number,
      default: -1
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
      status: '',
      timerInterval: null,
      statusInterval: null
    };
  },
  computed: {
    // ...mapGetters({
    //   ens: 'ens',
    //   gasPrice: 'gasPrice',
    //   web3: 'web3',
    //   wallet: 'wallet',
    //   network: 'network'
    // }),
    parseTimeRemaining() {
      const seconds = Math.floor(this.timeRemaining % 60);
      const minutes = Math.floor((this.timeRemaining / 60) % 60);
      return seconds >= 10 ? `${minutes}:${seconds}` : `${minutes}:0${seconds}`;
    },
    swapWindowOpen() {
      return this.timeRemaining > 0;
    },
    completed() {
      if (this.currentStatus === 100) {
        return true;
      }
      return false;
    },
    currentDisplayStatus() {
      if (this.currentStatus === -100) {
        return 'expired';
      } else if (this.currentStatus === 100) {
        return 'completed';
      } else if (this.currentStatus < 100 && this.currentStatus > 0) {
        return 'pending';
      } else if (this.currentStatus === 0) {
        return 'created';
      }
      return 'possible error';
    }
  },
  // watch: {
  //   details(newVal) {
  //     console.log(newVal); // todo remove dev item
  //   }
  // },
  beforeDestroy() {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
    }

    if (this.statusInterval !== null) {
      clearInterval(this.statusInterval);
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
      this.timerInterval = setInterval(() => {
        this.timeRemaining = this.calculateTimeRemaining(this.parsed);
        if (this.timeRemaining < 0) {
          clearInterval(this.timerInterval);
        }
      }, 1000);
    },
    statusUpdater() {
      // eslint-disable-next-line
      console.log('statusUpdater started'); // todo remove dev item
      let updating = false;
      const getStatus = async () => {
        if (!updating) {
          updating = true;
          this.currentStatus = await this.provider.getOrderStatus(
            this.details,
            this.network,
            this.currentStatus
          );
          this.updateTransactionEntry(this.details.orderId, this.currentStatus);
          updating = false;
        }
      };

      this.statusInterval = setInterval(() => {
        getStatus();
        if (this.timeRemaining < 0) {
          clearInterval(this.statusInterval);
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
    },
    updateTransactionEntry(orderId, status) {
      this.$store.dispatch('updateTransaction', [
        this.$store.state.wallet.getChecksumAddressString(),
        orderId,
        status
      ]);
    }
  }
};
</script>

<style lang="scss" scoped>
@import './TransactionEntry';
</style>
