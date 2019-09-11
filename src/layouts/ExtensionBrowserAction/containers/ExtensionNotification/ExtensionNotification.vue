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
      static
      lazy
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
            sortedNotifications !== undefined &&
              Object.keys(sortedNotifications).length > 0
          "
        >
          <li
            v-for="(notification, address) in sortedNotifications"
            v-show="notification.length > 0"
            :key="address"
          >
            <div class="address-header">
              {{ address }}
              <div>
                <i
                  :class="['fa fa-2x', 'fa-angle-down']"
                  aria-hidden="true"
                  @click="expandAll(address)"
                />
                <i
                  :class="['fa fa-2x', 'fa-angle-up']"
                  aria-hidden="true"
                  @click="collapseAll(address)"
                />
              </div>
            </div>
            <ul>
              <li
                v-for="(noti, idx) in notification"
                :key="noti.id + idx"
                class="notification-item"
              >
                <keep-alive
                  :max="10"
                  :exclude="['transaction-notification', 'transaction-error']"
                >
                  <component
                    :is="useComponent(noti.type)"
                    :expand="expand(idx, noti, address)"
                    :shown="shown"
                    :notice="noti"
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
          :child-update-notification="childUpdateNotification(notificationDetails.index)"
        >
        </component>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import unit from 'ethjs-unit';
import BigNumber from 'bignumber.js';
import { isAddress } from '@/helpers/addressUtils';
import { ExtensionHelpers } from '@/helpers';

import SwapNotification from './components/NotificationTypes/SwapNotification/SwapNotification';
import TransactionNotification from './components/NotificationTypes/TransactionNotification/TransactionNotification';
import TransactionDetails from './components/NotificationTypes/NotificationDetails';
import SwapDetails from './components/NotificationTypes/SwapDetails';
import store from 'store';
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
import { clearTimeout } from 'timers';

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
      notificationDetails: {},
      checkLoop: () => {}
    };
  },
  computed: {
    ...mapState(['web3', 'network', 'notifications', 'online']),
    sortedNotifications() {
      const notificationCopy = {};

      Object.keys(this.notifications).forEach(addr => {
        if (!this.notifications[addr]) {
          notificationCopy[addr] = [];
        } else {
          notificationCopy[addr] = this.notifications[addr];
          notificationCopy[addr]
            .sort((a, b) => {
              a = a.timestamp;
              b = b.timestamp;
              return a > b ? -1 : a < b ? 1 : 0;
            })
            .filter(entry => entry.network === this.network.type.name);
        }
      });
      return notificationCopy;
    }
  },
  watch: {
    notifications() {
      this.countUnread();
    }
  },
  mounted() {
    ExtensionHelpers.getAccounts(items => {
      Object.keys(items).forEach(item => {
        if (isAddress(item)) {
          if (this.notifications[item] === undefined) {
            this.notifications[item] = [];
            store.set('notifications', this.notifications);
          }
        }
      });
    });

    this.countUnread();
    if (this.online) {
      this.fetchBalanceData();
      this.checkLoop = setInterval(this.checkForUnResolvedTxNotifications, 14000);
    }
  },
  destroyed() {
    clearInterval(this.checkLoop);
  },
  methods: {
    hiddenModal() {
      this.shown = false;
      this.hideDetails();
    },
    checkForUnResolvedTxNotifications() {
      ExtensionHelpers.getAccounts(accs => {
        Object.keys(accs).forEach(item => {
          if (isAddress(item)) {
            console.log(this.notifications[item]);
            if (!this.notifications[item]) return [];
            const check = this.notifications[item]
              .filter(entry => entry.network === this.network.type.name)
              .filter(entry => {
                const isUnResolved =
                  entry.status === notificationStatuses.PENDING;
                const notExternalSwap =
                  entry.type === notificationType.TRANSACTION ||
                  (entry.type === notificationType.SWAP &&
                    entry.body.hasOwnProperty('isDex') && entry.body.isDex === true);
                const hasHash = entry.hash !== '' && entry.hash !== undefined;
                return isUnResolved && hasHash && notExternalSwap;
              });
            check.forEach(entry => {
              this.web3.eth.getTransactionReceipt(entry.hash).then(result => {
                if (result === null) return;
                const noticeIdx = this.notifications[item].findIndex(
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
                    item,
                    noticeIdx,
                    entry
                  ]);
                }
              });
            });
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
      const notifications = Object.keys(this.sortedNotifications);
      if (notifications.length) {
        notifications.forEach(item => {
          if (this.sortedNotifications[item].length > 0) {
            this.sortedNotifications[item].forEach(notif => {
              if (notif.read === false) this.unreadCount++;
            });
          }
        });
      }
    },
    expand(idx, notif, address) {
      return () => {
        const updatedNotif = notif;
        if (notif.expanded !== true) {
          updatedNotif.read = true;
          updatedNotif.expanded = true;
        } else {
          updatedNotif.expanded = false;
        }

        this.$store.dispatch('updateNotification', [
          address,
          idx,
          updatedNotif
        ]);
      };
    },
    hasExpanded(address) {
      const hasExpanded = this.notifications[address].find(notice => {
        return notice.expanded === true;
      });

      // eslint-disable-next-line
      return !!hasExpanded;
    },
    expandAll(address) {
      this.notifications[address].forEach((notice, idx) => {
        const updatedNotif = notice;
        if (notice.expanded !== true) {
          updatedNotif.read = true;
          updatedNotif.expanded = true;
        }
        this.$store.dispatch('updateNotification', [
          address,
          idx,
          updatedNotif
        ]);
      });
    },
    collapseAll(address) {
      this.notifications[address].forEach((notice, idx) => {
        const updatedNotif = notice;
        updatedNotif.expanded = false;
        this.$store.dispatch('updateNotification', [
          address,
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
      if (!values && !values.data && !values.data['ETH']) return 0;
      this.ethPrice = new BigNumber(values.data['ETH'].quotes.USD.price);
    },
    convertToGwei(value) {
      if (this.notValidNumber(value)) return '';
      return unit.fromWei(new BigNumber(value).toFixed(), 'Gwei');
    },
    convertToEth(value) {
      if (this.notValidNumber(value)) return '';
      return unit.fromWei(new BigNumber(value).toFixed(), 'ether');
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
@import './ExtensionNotification.scss';
</style>
