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
          <li>
            <p @click="expandAll">
              <i aria-hidden="true" class="fa fa-2x fa-angle-down"></i>
            </p>
            <p @click="CallapseAll">
              <i aria-hidden="true" class="fa fa-2x fa-angle-up"></i>
            </p>
          </li>
          <li
            v-for="(notification, idx) in sortedNotifications"
            :key="notification.title + notification.timestamp + idx"
            class="notification-item"
          >
            <keep-alive
              :max="10"
              :exclude="['transaction-notification', 'transaction-error']"
            >
              <component
                :is="useComponent(notification.type)"
                :expand="expand(idx, notification)"
                :shown="shown"
                :notice="notification"
                :convert-to-gwei="convertToGwei"
                :convert-to-eth="convertToEth"
                :get-fiat-value="getFiatValue"
                :date-string="dateString"
                :time-string="timeString"
                :hash-link="hashLink"
                :address-link="addressLink"
                :process-status="processStatus"
                :error-message-string="errorMessageString"
                :index="idx"
                :child-update-notification="childUpdateNotification(idx)"
                @showDetails="showDetails"
              >
              </component>
            </keep-alive>
          </li>
        </ul>
        <div v-else class="notification-no-item">No notifications found :(</div>
      </div>
      <div v-if="detailsShown" class="notification-item-container">
        <component
          :is="useDetailComponent(detailType)"
          :shown="shown"
          :notice="notificationDetails"
          :convert-to-gwei="convertToGwei"
          :convert-to-eth="convertToEth"
          :get-fiat-value="getFiatValue"
          :date-string="dateString"
          :time-string="timeString"
          :hash-link="hashLink"
          :address-link="addressLink"
          :process-status="processStatus"
          :error-message-string="errorMessageString"
          :child-update-notification="
            childUpdateNotification(notificationDetails.index)
          "
        >
        </component>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import store from 'store';
import unit from 'ethjs-unit';
import BigNumber from 'bignumber.js';

import SwapNotification from './components/NotificationTypes/SwapNotification/SwapNotification';
import TransactionNotification from './components/NotificationTypes/TransactionNotification/TransactionNotification';
import TransactionDetails from './components/NotificationTypes/NotificationDetails';
import SwapDetails from './components/NotificationTypes/SwapDetails';

import {
  statusTypes,
  listComponentMapping,
  detailComponentMapping
} from './components/config';

import { INVESTIGATE_FAILURE_KEY } from '@/helpers/notificationFormatters';

export default {
  components: {
    'swap-notification': SwapNotification,
    'transaction-notification': TransactionNotification,
    'transaction-details': TransactionDetails,
    'swap-details': SwapDetails
  },
  data() {
    return {
      shown: false,
      unreadCount: 0,
      ethPrice: new BigNumber(0),
      detailsShown: false,
      detailType: '',
      notificationDetails: {}
    };
  },
  computed: {
    ...mapGetters({
      web3: 'web3',
      network: 'network',
      notifications: 'notifications',
      wallet: 'wallet'
    }),
    sortedNotifications() {
      this.countUnread();
      if (!this.notifications[this.wallet.getChecksumAddressString()])
        return [];
      // eslint-disable-next-line
      return this.notifications[this.wallet.getChecksumAddressString()]
        .sort((a, b) => {
          a = a.timestamp;
          b = b.timestamp;

          return a > b ? -1 : a < b ? 1 : 0;
        })
        .filter(entry => entry.network === this.network.type.name);
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
      this.shown = false;
      this.hideDetails();
    });
  },
  methods: {
    showNotifications() {
      this.shown = true;
      this.$refs.notification.show();
    },
    showDetails(details) {
      this.detailsShown = true;
      this.detailType = details[0];
      this.notificationDetails = details[1];
      if (details.length === 3) {
        this.notificationDetails.index = details[2];
      }
    },
    hideDetails() {
      this.detailsShown = false;
      this.notificationDetails = {};
      this.detailType = '';
    },
    useComponent(type) {
      if (listComponentMapping[type]) {
        return listComponentMapping[type];
      }
      return 'transaction-notification';
    },
    useDetailComponent(type) {
      if (detailComponentMapping[type]) {
        return detailComponentMapping[type];
      }
      return 'transaction-details';
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
    expandAll() {
      this.notifications[this.wallet.getChecksumAddressString()].forEach(
        (notice, idx) => {
          const updatedNotif = notice;
          if (notice.expanded !== true) {
            updatedNotif.read = true;
            updatedNotif.expanded = true;
          }
          this.$store.dispatch('updateNotification', [
            this.wallet.getChecksumAddressString(),
            idx,
            updatedNotif
          ]);
        }
      );
    },
    CallapseAll() {
      this.notifications[this.wallet.getChecksumAddressString()].forEach(
        (notice, idx) => {
          const updatedNotif = notice;
          updatedNotif.expanded = false;
          this.$store.dispatch('updateNotification', [
            this.wallet.getChecksumAddressString(),
            idx,
            updatedNotif
          ]);
        }
      );
    },
    childUpdateNotification(idx) {
      if (typeof idx === 'undefined') return () => {};
      return updatedNotif => {
        this.$store.dispatch('updateNotification', [
          this.wallet.getChecksumAddressString(),
          idx,
          updatedNotif
        ]);
      };
    },
    processStatus(rawStatus) {
      if (statusTypes[rawStatus]) {
        return statusTypes[rawStatus];
      }
      return statusTypes.statusError;
    },
    errorMessageString(notice) {
      if (notice.body.errorMessage === INVESTIGATE_FAILURE_KEY) {
        return this.$t('header.investigate');
      }
      return notice.body.errorMessage;
    },
    hashLink(hash) {
      if (this.network.type.blockExplorerTX) {
        return this.network.type.blockExplorerTX.replace('[[txHash]]', hash);
      }
    },
    addressLink(addr) {
      if (this.network.type.blockExplorerAddr) {
        return this.network.type.blockExplorerAddr.replace('[[address]]', addr);
      }
    },
    dateString(notice) {
      if (notice !== {}) {
        return new Date(notice.timestamp).toLocaleDateString(
          this._i18n.locale.replace('_', '-')
        );
      }
      return '';
    },
    timeString(notice) {
      if (notice !== {}) {
        return new Date(notice.timestamp).toLocaleTimeString(
          this._i18n.locale.replace('_', '-')
        );
      }
      return '';
    },
    async fetchBalanceData() {
      const url = 'https://cryptorates.mewapi.io/convert/ETH';
      const fetchValues = await fetch(url);
      const values = await fetchValues.json();
      if (!values['DAI']) return 0;
      this.ethPrice = new BigNumber(values['DAI']);
    },
    convertToGwei(value) {
      if (this.notValidNumber(value)) return '';
      return unit.fromWei(value, 'Gwei');
    },
    convertToEth(value) {
      if (this.notValidNumber(value)) return '';
      return unit.fromWei(value, 'ether');
    },
    getFiatValue(value) {
      if (this.notValidNumber(value)) return '';
      if (this.ethPrice === 0) return '';
      return new BigNumber(this.convertToEth(value))
        .multipliedBy(new BigNumber(this.ethPrice))
        .decimalPlaces(2)
        .toFixed();
    },
    notValidNumber(value) {
      return (
        typeof value === 'undefined' || Number.isNaN(value) || value === 'NaN'
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import './Notification.scss';
</style>
