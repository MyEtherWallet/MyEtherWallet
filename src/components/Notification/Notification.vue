<template lang="html">
  <div class="notification-container">
    <div class="notification-logo" @click="showNotifications">
      <img class="logo-large" src="~@/assets/images/icons/notification.svg" />
      <div v-show="unreadCount > 0" class="notification-dot">
        <div class="parent">
          <div class="heart"></div>
        </div>
      </div>
    </div>
    <b-modal
      ref="notification"
      hide-footer
      centered
      no-padding
      class="bootstrap-modal-wide nopadding"
      @show="countUnread"
      @hide="hiddenModal"
    >
      <template slot="modal-title">
        <div>
          <div v-if="!detailsShown" class="modal-title">
            {{ unreadCount > 1 ? 'Notifications' : 'Notification' }}
            <div v-show="unreadCount >= 0" class="notification-count">
              <span>{{ unreadCount }}</span>
            </div>
          </div>
          <div v-else class="modal-title show-pointer" @click="hideDetails">
            <i class="fa fa-long-arrow-left" aria-hidden="true" />
            {{ $t('common.back') }}
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
            :key="notification.id + idx"
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

import {
  INVESTIGATE_FAILURE_KEY,
  notificationStatuses,
  notificationType
} from '@/helpers/notificationFormatters';

import { SwapProviders } from '@/partners';

export default {
  components: {
    'swap-notification': SwapNotification,
    'transaction-notification': TransactionNotification,
    'transaction-details': TransactionDetails,
    'swap-details': SwapDetails
  },
  data() {
    return {
      cancelHide: false,
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
      account: 'account'
    }),
    sortedNotifications() {
      if (!this.notifications[this.account.address]) return [];
      const notifications = this.notifications[this.account.address];
      return notifications
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
    if (this.notifications[this.account.address] === undefined) {
      this.notifications[this.account.address] = [];
      store.set('notifications', this.notifications);
    }
    this.countUnread();
    this.fetchBalanceData();
    this.checkForUnResolvedTxNotifications();
  },
  methods: {
    hiddenModal() {
      this.shown = false;
      this.hideDetails();
    },
    checkForUnResolvedTxNotifications() {
      if (!this.notifications[this.account.address]) return [];
      const check = this.notifications[this.account.address]
        .filter(entry => entry.network === this.network.type.name)
        .filter(entry => {
          const isOlder =
            (new Date().getTime() - new Date(entry.timestamp).getTime()) /
              1000 >
            6000;
          const isUnResolved = entry.status === notificationStatuses.PENDING;
          const notExternalSwap =
            entry.type === notificationType.TRANSACTION ||
            (entry.type === notificationType.SWAP && entry.body.isDex === true);
          const hasHash = entry.hash !== '' && entry.hash !== undefined;
          return isOlder && isUnResolved && hasHash && notExternalSwap;
        });
      check.forEach(entry => {
        this.web3.eth.getTransactionReceipt(entry.hash).then(result => {
          if (result === null) return;
          const noticeIdx = this.notifications[this.account.address].findIndex(
            noticeEntry => entry.id === noticeEntry.id
          );
          if (noticeIdx >= 0) {
            entry.status = result.status
              ? notificationStatuses.COMPLETE
              : notificationStatuses.FAILED;
            entry.body.error = !result.status;
            entry.body.errorMessage = result.status
              ? ''
              : INVESTIGATE_FAILURE_KEY;
            entry.body.gasUsed = new BigNumber(result.gasUsed).toString();
            entry.body.blockNumber = new BigNumber(
              result.blockNumber
            ).toString();
            if (entry.body.isDex) {
              entry.swapStatus = result.status
                ? notificationStatuses.COMPLETE
                : notificationStatuses.FAILED;
              entry.body.timeRemaining = -1;
            }
            this.$store.dispatch('updateNotification', [
              this.account.address,
              noticeIdx,
              entry
            ]);
          }
        });
      });
    },
    showNotifications() {
      this.shown = true;
      this.$refs.notification.show();
    },
    showDetails(details) {
      this.cancelHide = true;
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
      this.unreadCount = 0;
      if (this.sortedNotifications.length) {
        this.sortedNotifications.forEach(notif => {
          if (notif.read === false) this.unreadCount++;
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
          this.account.address,
          idx,
          updatedNotif
        ]);
      };
    },
    expandAll() {
      this.notifications[this.account.address].forEach((notice, idx) => {
        const updatedNotif = notice;
        if (notice.expanded !== true) {
          updatedNotif.read = true;
          updatedNotif.expanded = true;
        }
        this.$store.dispatch('updateNotification', [
          this.account.address,
          idx,
          updatedNotif
        ]);
      });
    },
    CallapseAll() {
      this.notifications[this.account.address].forEach((notice, idx) => {
        const updatedNotif = notice;
        updatedNotif.expanded = false;
        this.$store.dispatch('updateNotification', [
          this.account.address,
          idx,
          updatedNotif
        ]);
      });
    },
    childUpdateNotification(idx) {
      if (typeof idx === 'undefined') return () => {};
      return updatedNotif => {
        this.$store.dispatch('updateNotification', [
          this.account.address,
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
    hashLink(hash, currency) {
      if (currency && SwapProviders.isNotToken(currency)) {
        return SwapProviders.getBlockChainExplorerUrl(currency, hash);
      }
      if (this.network.type.blockExplorerTX) {
        return this.network.type.blockExplorerTX.replace('[[txHash]]', hash);
      }
    },
    addressLink(addr, currency) {
      if (currency && SwapProviders.isNotToken(currency)) {
        return SwapProviders.getAddressLookupUrl(currency, addr);
      }
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
      const url = 'https://cryptorates.mewapi.io/ticker';
      const fetchValues = await fetch(url);
      const values = await fetchValues.json();
      if (!values) return 0;
      if (!values.data['ETH']) return 0;
      this.ethPrice = new BigNumber(values.data['ETH'].quotes.USD.price);
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
