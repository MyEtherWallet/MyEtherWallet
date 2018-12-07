<template lang="html">
  <div>
    <div class="notification-header">
      Transaction Detail
      <!--
        <div class="notification-type-status">
          <p class="type">Transaction Detail</p>
        </div>
      -->
    </div>
    <div class="notification-content">
      <ul>
        <li><p>Transaction Hash:</p></li>
        <li>
          <p>
            <a :href="hashLink" target="_blank"> {{ notice.hash }} </a>
          </p>
        </li>
        <li>
          <p>Time:</p>
          <div class="time-date">
            <p>{{ timeString(notice) }}</p>
            <p>{{ dateString(notice) }}</p>
          </div>
        </li>
        <li class="notification-type-status">
          <p>Status:</p>
          <p :class="['status', txStatus.class]">({{ txStatus.text }})</p>
        </li>
        <li>
          <p>Amount:</p>
          <p>{{ convertToEth(details.amount) }} ETH</p>
        </li>
        <li>
          <p>To Address:</p>
          <p>
            <a :href="addressLink" target="_blank"> {{ details.to }} </a>
          </p>
        </li>
        <li>
          <p>TX Fee:</p>
          <p>
            {{ convertToEth(details.gasPrice * details.gasLimit) }} ETH (${{
              getFiatValue(details.gasPrice * details.gasLimit)
            }})
          </p>
        </li>
        <li>
          <p>Gas Price:</p>
          <p>{{ convertToGwei(details.gasPrice) }} Gwei</p>
        </li>
        <li>
          <p>Gas Limit:</p>
          <p>{{ details.gasLimit }}</p>
        </li>
        <li v-if="txStatus.text === 'Succeed'">
          <p>Gas Used:</p>
          <p>
            {{ details.gasUsed }} (${{
              getFiatValue(details.gasPrice * details.gasUsed)
            }})
          </p>
        </li>
        <li>
          <p>Nonce:</p>
          <p>{{ details.nonce }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import store from 'store';
import unit from 'ethjs-unit';
import BigNumber from 'bignumber.js';

export default {
  props: {
    notice: {
      type: Object,
      default: function() {
        return {};
      }
    },
    convertToGwei: {
      type: Function,
      default: function() {}
    },
    convertToEth: {
      type: Function,
      default: function() {}
    },
    getFiatValue: {
      type: Function,
      default: function() {}
    },
    dateString: {
      type: Function,
      default: function() {}
    },
    timeString: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      unreadCount: 0
    };
  },
  computed: {
    ...mapGetters({
      web3: 'web3',
      network: 'network',
      notifications: 'notifications',
      wallet: 'wallet'
    }),
    hashLink() {
      if (this.network.type.blockExplorerTX) {
        return this.network.type.blockExplorerTX.replace(
          '[[txHash]]',
          this.notice.hash
        );
      }
    },
    addressLink() {
      if (this.network.type.blockExplorerAddr) {
        return this.network.type.blockExplorerAddr.replace(
          '[[address]]',
          this.notice.body.to
        );
      }
    },
    details() {
      return this.notice.body;
    },
    txStatus() {
      const status = {
        pending: { text: 'Processing', class: 'status-processing' },
        complete: { text: 'Succeed', class: 'status-succeed' },
        failed: { text: 'Failed', class: 'status-failed' },
        error: { text: 'Display Error', class: 'status-failed' }
      };

      if (status[this.notice.status]) {
        return status[this.notice.status];
      }
      return status.error;
    },
    // dateString() {
    //   if (this.notice !== {}) {
    //     return new Date(this.notice.timestamp).toLocaleDateString(
    //       this._i18n.locale.replace('_', '-')
    //     );
    //   }
    //   return '';
    // },
    // timeString() {
    //   if (this.notice !== {}) {
    //     return new Date(this.notice.timestamp).toLocaleTimeString(
    //       this._i18n.locale.replace('_', '-')
    //     );
    //   }
    //   return '';
    // }
  },
  methods: {
    emitShowDetails() {
      this.$emit('showDetails');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Notification';
</style>
