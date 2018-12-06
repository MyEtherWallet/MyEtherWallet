<template lang="html">
  <div class="notification-container">
    <div class="notification-logo" @click="showNotifications">
      <img class="logo-large" src="~@/assets/images/icons/notification.svg" />
      <div v-show="unreadCount > 0" class="notification-dot" />
    </div>
    <b-modal
      ref="notification"
      hide-footer
      centered
      no-padding
      class="bootstrap-modal-wide nopadding"
      @show="countUnread"
    >
      <template slot="modal-title">
        <div>
          <div v-if="!detailsShown" class="modal-title">
            {{ unreadCount > 1 ? 'Notifications' : 'Notification' }}
            <div v-show="unreadCount >= 0" class="notification-count">
              <span>{{ unreadCount }}</span>
            </div>
          </div>
          <div v-else class="modal-title" @click="hideDetails">
            <i class="fa fa-long-arrow-left" aria-hidden="true" /> Back
          </div>
        </div>
      </template>
      <div v-if="!detailsShown" class="notification-item-container">
        <ul
          v-if="
            sortedNotifications !== undefined && sortedNotifications.length > 0
          "
        >
          <li
            v-for="(notification, idx) in sortedNotifications"
            :key="notification.title + notification.timestamp + idx"
            class="notification-item"
          >
            <component
              :is="useComponent(notification.type)"
              :expand="expand(idx, notification)"
              :notice="notification"
              @showDetails="showDetails"
            >
            </component>
          </li>
        </ul>
        <div v-else class="notification-no-item">No notifications found :(</div>
      </div>
      <div v-if="detailsShown" class="notification-item-container">
        <transaction-details
          :notice="notificationDetails"
          :eth-price="ethPrice"
        ></transaction-details>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import store from 'store';
import SwapNotification from './NotificationTypes/SwapNotification';
import TransactionNotification from './NotificationTypes/TransactionNotification';
import TransactionError from './NotificationTypes/TransactionError';
import TransactionDetails from './NotificationDetails';
import BigNumber from 'bignumber.js';

export default {
  components: {
    'swap-notification': SwapNotification,
    'transaction-notification': TransactionNotification,
    'transaction-error': TransactionError,
    'transaction-details': TransactionDetails
  },
  data() {
    return {
      unreadCount: 0,
      ethPrice: new BigNumber(0),
      detailsShown: false,
      notificationDetails: {}
    };
  },
  computed: {
    ...mapGetters({
      notifications: 'notifications',
      wallet: 'wallet'
    }),
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
    this.fetchBalanceData();
    this.$refs.notification.$on('hide', () => {
      this.hideDetails();
    });
  },
  methods: {
    showDetails(details) {
      this.detailsShown = true;
      this.notificationDetails = details;
    },
    hideDetails() {
      this.detailsShown = false;
      this.notificationDetails = {};
    },
    useComponent(type) {
      if (type === 'swap') {
        return 'swap-notification';
      } else if (type === 'transactionError') {
        return 'transaction-error';
      }
      return 'transaction-notification';
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
      return () => {
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
      };
    },
    async fetchBalanceData() {
      const url = 'https://cryptorates.mewapi.io/convert/ETH';
      const fetchValues = await fetch(url);
      const values = await fetchValues.json();
      this.ethPrice = new BigNumber(values['USD']);
    }
  }
};
</script>

<style lang="scss" scoped>
@import './Notification.scss';
</style>
