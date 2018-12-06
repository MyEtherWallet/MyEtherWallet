<template lang="html">
  <div>
    <div class="notification-header" @click="expand();">
      <div class="notification-type-status">
        <p class="type">Swap</p>
        <p :class="['status', txStatus.class]">({{ txStatus.text }})</p>
      </div>
      <div class="time-date">
        <p>{{ timeString(notice) }}</p>
        <p>{{ dateString(notice) }}</p>
        <div class="expender-icon">
          <i aria-hidden="true" class="fa fa-angle-down"></i>
          <i aria-hidden="true" class="fa fa-angle-up"></i>
        </div>
      </div>
    </div>
    <div
      :class="[
        notice.expanded ? '' : 'unexpanded',
        'notification-body',
        'notification-content'
      ]"
    >
      <ul>
        <li>
          <p class="icon">
            <i :class="['cc', details.fromCurrency, 'cc-icon']"></i>
          </p>
          <p>Amount:</p>
          <p>{{ details.amount }} ETH</p>
        </li>
        <li>
          <p>To Address:</p>
          <p>
            <a :href="addressLink" target="_blank"> {{ details.to }} </a>
          </p>
        </li>
        <li>
          <p>TX Fee:</p>
          <p>{{ details.gasLimit }} WEI ($0.09)</p>
        </li>
        <li><p>Transaction Hash:</p></li>
        <li>
          <a :href="hashLink" target="_blank"> {{ notice.hash }} </a>
        </li>
        <li @click="emitShowDetails">More</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import store from 'store';
import unit from 'ethjs-unit';
import BigNumber from 'bignumber.js';

import '@/assets/images/currency/coins/asFont/cryptocoins.css';
import '@/assets/images/currency/coins/asFont/cryptocoins-colors.css';

export default {
  props: {
    expand: {
      type: Function,
      default: function() {}
    },
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
    // }
  },
  methods: {
    emitShowDetails() {
      this.$emit('showDetails', this.notice);
    }
    // convertToGwei(value) {
    //   return unit.fromWei(value, 'Gwei');
    // },
    // convertToEth(value) {
    //   return unit.fromWei(value, 'ether');
    // },
    // getFiatValue(value) {
    //   return new BigNumber(this.convertToEth(value))
    //     .multipliedBy(new BigNumber(this.ethPrice))
    //     .decimalPlaces(2)
    //     .toFixed();
    // }
  }
};
</script>

<style lang="scss" scoped>
@import './Notification.scss';
</style>
