<template lang="html">
  <div>
    <div class="notification-header" @click="expand(index, notice, $event);">
      <div class="notification-type-status">
        <p class="type">Transaction</p>
        <p :class="['status', txStatus.class]">({{ txStatus.text }})</p>
      </div>
      <div class="time-date">
        <p>13:20:23</p>
        <p>04/05/2018</p>
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
import Bignumber from 'bignumber.js';

export default {
  props: {
    index: {
      type: Number,
      default: 0
    },
    notice: {
      type: Object,
      default: function() {
        return {};
      }
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
    sortedNotifications() {
      this.countUnread();
      if (!this.notifications[this.wallet.getChecksumAddressString()])
        return [];
      // eslint-disable-next-line
      return this.notifications[this.wallet.getChecksumAddressString()].sort(
        (a, b) => {
          a = new Date(a.timestamp);
          b = new Date(b.timestamp);

          return a > b ? -1 : a < b ? 1 : 0;
        }
      );
    }
  },
  watch: {
    notifications() {
      this.countUnread();
    }
  },
  mounted() {
    if (
      this.notifications[this.wallet.getChecksumAddressString()] === undefined
    ) {
      this.notifications[this.wallet.getChecksumAddressString()] = [];
      store.set('notifications', this.notifications);
    }
    this.countUnread();
  },
  methods: {
    emitShowDetails() {
      this.$emit('showDetails', this.notice);
    },
    countUnread() {
      const self = this;
      self.unreadCount = 0;
      if (
        self.notifications[this.wallet.getChecksumAddressString()] !==
          undefined &&
        self.notifications[this.wallet.getChecksumAddressString()].length > 0
      ) {
        self.notifications[this.wallet.getChecksumAddressString()].map(item => {
          if (item.read === false) {
            self.unreadCount++;
          }
        });
      }
    },
    showNotifications() {
      this.$refs.notification.show();
    },
    expand(idx, notif) {
      const updatedNotif = notif;
      if (notif.expanded !== true) {
        updatedNotif.read = true;
        updatedNotif.expanded = true;
      } else {
        updatedNotif.expanded = false;
      }
      this.$store.dispatch('updateNotification', [
        this.wallet.getChecksumAddressString(),
        idx,
        updatedNotif
      ]);
    }
  }
};
</script>

<style lang="scss" scoped>
@import './Notification.scss';
</style>
