<template lang="html">
  <div class="notification-container">
    <div
      class="notification-logo"
      @click="dropdownOpen = !dropdownOpen">
      transactions
      <div
        v-show="unreadCount > 0"
        class="notification-dot"/>
    </div>
    <div
      v-if="dropdownOpen"
      class="dropdown-list-box">
      <ul>
        <li
          v-show="sortedTransactions.length === 0">
          <div class="transaction-entry">
            <p>No Transaction History</p>
          </div>
        </li>
        <li
          v-for="tx in sortedTransactions"
          v-show="sortedTransactions.length > 0"
          :key="tx.key">
          {{ tx }}
          <transaction-entry
            :provider="getProvider(tx.provider)"
            :details="tx"/>
            <!--          <div class="top-row">
            <div class="from-address">
              <div class="icon">
                <img
                  :src="currencyIcons[tx.fromCurrency]"
                  height="16"
                  width="16">
                <span class="currency">{{ tx.fromCurrency }}</span>
              </div>
              <p class="value">{{ tx.fromValue }}</p>
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
                  :src="currencyIcons[tx.toCurrency]"
                  height="16"
                  width="16">
                <span class="currency">{{ tx.toCurrency }}</span>
              </div>
              <p class="value">{{ tx.toValue }}</p>
            </div>
          </div>

          <div class="middle-row">
            <div class="status-indicator-container">
              <div class="status-indicator">
                <div class="status-timer">
                  <p >{{ calculateTimeRemaining(tx.parsed) }}</p>
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
          </div>-->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import store from 'store';
import iconBtc from '@/assets/images/currency/btc.svg';
import iconEth from '@/assets/images/currency/eth.svg';
import Arrow from '@/assets/images/etc/single-arrow.svg';

import TransactionEntry from './TransactionEntry';

import {
  BitySwap,
  // KyberSwap,
  // Simplex,
  ChangellySwap
} from '@/partners';

export default {
  components: {
    'transaction-entry': TransactionEntry
  },
  data() {
    return {
      network: this.$store.state.network.type.name,
      dropdownOpen: false,
      unreadCount: 0,
      currencyIcons: {
        BTC: iconBtc,
        ETH: iconEth
      },
      arrowImage: Arrow,
      providers: {
        [BitySwap.getName()]: BitySwap,
        [ChangellySwap.getName()]: ChangellySwap
      }
    };
  },
  computed: {
    ...mapGetters({
      transactions: 'transactions'
    }),
    sortedTransactions() {
      this.countUnread();

      if (
        !this.transactions[this.$store.state.wallet.getChecksumAddressString()]
      )
        return [];
      // eslint-disable-next-line
      return this.transactions[
        this.$store.state.wallet.getChecksumAddressString()
      ].sort((a, b) => {
        a = new Date(a.timestamp);
        b = new Date(b.timestamp);

        return a > b ? -1 : a < b ? 1 : 0;
      });
    }
  },
  watch: {
    notifications() {
      this.countUnread();
    }
  },
  mounted() {
    if (
      this.transactions[this.$store.state.wallet.getChecksumAddressString()] ===
      undefined
    ) {
      this.transactions[
        this.$store.state.wallet.getChecksumAddressString()
      ] = [];
      store.set('transactions', this.transactions);
    }
    this.countUnread();
  },
  methods: {
    countUnread() {
      this.unreadCount = 0;
      // if (
      //   self.transactions[self.$store.state.wallet.getAddressString()] !==
      //     undefined &&
      //   self.transactions[self.$store.state.wallet.getAddressString()].length >
      //     0
      // ) {
      //   self.transactions[self.$store.state.wallet.getAddressString()].map(
      //     item => {
      //       if (item.read === false) {
      //         self.unreadCount++;
      //       }
      //     }
      //   );
      // }
    },
    checkHistory() {},
    expand(idx, notif) {
      const updatedNotif = notif;
      if (notif.expanded !== true) {
        updatedNotif.read = true;
        updatedNotif.expanded = true;
      } else {
        updatedNotif.expanded = false;
      }
      // this.$store.dispatch('updateTransactions', [
      //   this.$store.state.wallet.getAddressString(),
      //   idx,
      //   updatedNotif
      // ]);
    },
    getProvider(provider) {
      if (this.providers[provider]) {
        return this.providers[provider];
      }
    },
    parseOrder(swapDetails) {
      if (this.providers[swapDetails.provider]) {
        return this.providers[swapDetails.provider].parseOrder(
          swapDetails.dataForInitialization
        );
      }
    },
    getStatus(swapDetails) {
      if (this.providers[swapDetails.provider]) {
        return this.providers[swapDetails.provider].getOrderStatus(
          swapDetails.dataForInitialization
        );
      }
    },
    statusUpdater(/*swapDetails*/) {
      return () => {
        // let currentStatus;
        // const parsed = this.parseOrder(swapDetails);
        // const timeRemaining = this.calculateTimeRemaining(parsed);
        const checkStatus = setInterval(async () => {
          // currentStatus = await this.getStatus({
          //   orderid: parsed.orderId
          // });
          clearInterval(checkStatus);
        }, 1000);
      };
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
