<template lang="html">
  <div>
    <div class="notification-header" @click="expand();">
      <div class="notification-type-status">
        <p class="type">Transaction</p>
        <p :class="['status', txStatus.class]">({{ txStatus.text }})</p>
      </div>
      <div class="time-date">
        <p>{{ timeString(notice) }}</p>
        <p>{{ dateString(notice) }}</p>
      </div>
      <div class="expender-icon">
        <i aria-hidden="true" class="fa fa-angle-down"></i>
        <i aria-hidden="true" class="fa fa-angle-up"></i>
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
          <p>Amount:</p>
          <p>{{ details.amount }} ETH</p>
        </li>
        <li>
          <p>To Address:</p>
          <p>
            <a :href="addressLink(details.to)" target="_blank">
              {{ details.to }}
            </a>
          </p>
        </li>
        <li>
          <p>TX Fee:</p>
          <p>{{ details.gasLimit }} WEI ($0.09)</p>
        </li>
        <li><p>Transaction Hash:</p></li>
        <li>
          <a :href="hashLink(notice.hash)" target="_blank">
            {{ notice.hash }}
          </a>
        </li>
        <li @click="emitShowDetails">More</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

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
    },
    processStatus: {
      type: Function,
      default: function() {}
    },
    hashLink: {
      type: Function,
      default: function() {}
    },
    addressLink: {
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
    details() {
      return this.notice.body;
    },
    txStatus() {
      return this.processStatus(this.notice.status);
    }
  },
  methods: {
    emitShowDetails() {
      this.$emit('showDetails', ['transaction', this.notice]);
    }
  }
};
</script>

<style lang="scss" scoped>
@import './TransactionNotification.scss';
</style>
