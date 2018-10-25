<template lang="html">
  <div class="notification-container">
    <div
      class="notification-logo"
      @click="dropdownOpen = !dropdownOpen">
      transactions
      <div
        v-show="activeSwapCount > 0"
        class="notification-dot"/>
    </div>
    <div
      v-if="dropdownOpen"
      class="dropdown-list-box">
      <ul>
        <li
          v-show="sortedTransactions.length === 0">
          <div class="no-active-transaction">
            <p >No Active Transactions</p>
          </div>
        </li>
        <li 
          v-for="tx in sortedTransactions"
          v-show="sortedTransactions.length > 0"
          :key="tx.key"
          class="transaction-entry">
          <transaction-entry
            :provider="getProvider(tx.provider)"
            :details="tx"/>
        </li>
        <li>
          <div class="check-history-entry">
            <div class="line"/>
            <div class="check-history-container">
              <h4
                class="check-history"
                @click="checkHistory">Check history</h4>
            </div>
          </div>
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

import TransactionEntry from './TransactionEntry/TransactionEntry';

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
      currentAddress: this.$store.state.wallet.getChecksumAddressString(),
      dropdownOpen: false,
      activeSwapCount: 0,
      activeSwaps: [],
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
      transactions: 'transactions',
      wallet: 'wallet'
    }),
    sortedTransactions() {
      this.countActive();
      if (
        !this.transactions[this.$store.state.wallet.getChecksumAddressString()]
      ) {
        return [];
      }
      const activeSwaps = this.transactions[
        this.$store.state.wallet.getChecksumAddressString()
      ].filter(entry => {
        if (entry.status !== -1 && entry.status !== 0) {
          const timeRemaining =
            800 -
            parseInt(
              (new Date().getTime() - new Date(entry.timestamp).getTime()) /
                1000
            );
          if (timeRemaining > 0) {
            return true;
          }
          return false;
        }
      });
      // eslint-disable-next-line
      return activeSwaps.sort((a, b) => {
        a = new Date(a.timestamp);
        b = new Date(b.timestamp);

        return a > b ? -1 : a < b ? 1 : 0;
      });
    }
  },
  watch: {
    transactions() {
      this.countActive();
    },
    dropdownOpen(newVal) {
      if (newVal) {
        console.log(newVal); // todo remove dev item
        this.countActive();
        this.updateTransactions();
      }
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
    this.countActive();
  },
  methods: {
    countActive() {
      this.activeSwapCount = 0;
      if (
        this.transactions[this.$store.state.wallet.getAddressString()] !==
          undefined &&
        this.transactions[this.$store.state.wallet.getAddressString()].length >
          0
      ) {
        this.activeSwaps = this.transactions[
          this.$store.state.wallet.getChecksumAddressString()
        ].filter(entry => {
          if (entry.status !== -1 && entry.status !== 0) {
            const timeRemaining =
              600 -
              parseInt(
                (new Date().getTime() - new Date(entry.timestamp).getTime()) /
                  1000
              );
            if (timeRemaining > 0) {
              this.activeSwapCount++;
              return true;
            }
            return false;
          }
          return false;
        });
      }
    },
    checkHistory() {},
    updateTransactions() {
      this.transactions[
        this.$store.state.wallet.getChecksumAddressString()
      ].forEach((entry, idx) => {
        if (entry.status !== -1 && entry.status !== 0) {
          const timeRemaining =
            650 -
            parseInt(
              (new Date().getTime() - new Date(entry.timestamp).getTime()) /
                1000
            );
          if (timeRemaining < 0) {
            entry.status = -1;
            this.$store.dispatch('updateTransaction', [
              this.$store.state.wallet.getChecksumAddressString(),
              idx,
              entry
            ]);
          }
        }
      });
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
