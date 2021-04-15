<template>
  <!--
  =====================================================================================
    Module Notifications
  =====================================================================================
  -->
  <div>
    <div class="d-flex align-center">
      <v-btn icon @click="openNotifications = true">
        <img
          src="@/assets/images/icons/icon-notifications.svg"
          :class="[invertIcon ? 'make-white-svg' : '']"
        />
      </v-btn>
      <div
        v-if="notificationCount > 0"
        class="notification-count cursor--pointer d-flex align-center justify-center white--text error lighten2"
        @click="openNotifications = true"
      >
        {{ notificationCount }}
      </div>
    </div>
    <mew-overlay
      left-btn-text=""
      :show-overlay="openNotifications"
      right-btn-text="Close"
      @closeOverlay="openNotifications = false"
    >
      <template #mewOverlayBody>
        <v-sheet class="transparent" max-width="700px" width="100%">
          <v-sheet
            color="transparent"
            max-width="350px"
            class="d-flex align-center justify-space-between mx-auto mb-6"
          >
            <div>
              <v-icon color="primary" large> mdi-circle-medium </v-icon>
              Success
            </div>
            <div>
              <v-icon color="orange" large> mdi-circle-medium </v-icon>
              Pending
            </div>
            <div>
              <v-icon color="error" large> mdi-circle-medium </v-icon>
              Failed
            </div>
          </v-sheet>
          <h2 class="text-center mb-2">Notifications</h2>
          <div class="d-flex align-center justify-end">
            <!-- <div>
            <div>6 notifications</div>
            <v-btn depressed x-small color="textSecondary" dark>
              Delete all
            </v-btn>
          </div> -->
            <v-sheet color="transparent" max-width="150px">
              <v-select
                v-model="selected"
                flat
                solo
                :items="items"
                item-text="label"
                item-value="val"
              ></v-select>
            </v-sheet>
          </div>
          <mew6-white-sheet>
            <div class="pa-4">
              <div
                v-for="data in notificationsByType"
                v-show="!loading && notificationsByType.length > 0"
                :key="data.transactionHash"
                class="mt-2"
              >
                <mew-notification
                  :notification="data.notification"
                  @click.native="markNotificationAsRead(data.notification)"
                />
              </div>
              <div
                v-show="notificationsByType.length === 0"
                class="pa-5 text-center"
              >
                <h3 class="mb-5">No notifications to display for:</h3>
                <h3 class="break-hash">{{ address }}</h3>
              </div>
            </div>
          </mew6-white-sheet>
        </v-sheet>
        <!-- <div class="text-center py-6">
        <v-pagination v-model="page" :length="6"></v-pagination>
      </div> -->
      </template>
    </mew-overlay>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import Notification from './handlers/handlerNotification';
import handlerNotification from './handlers/handlerNotification.mixin';
import handlerSwap from '@/modules/swap/handlers/handlerSwap';
import BigNumber from 'bignumber.js';
import { isHex, hexToNumber, fromWei, toBN } from 'web3-utils';
import { txTypes, notificationTypes } from './configs/configTypes';
import timeAgo from '@/core/helpers/timeAgo';

export default {
  name: 'ModuleNotifications',
  mixins: [handlerNotification],
  props: {
    invertIcon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selected: 'all',
      items: [
        { label: 'All', val: 'all' },
        { label: 'In', val: 'in' },
        { label: 'Out', val: 'out' },
        { label: 'Swap', val: 'swap' }
      ],
      page: null,
      openNotifications: false
    };
  },
  computed: {
    ...mapGetters('notifications', [
      'currentNotifications',
      'txNotifications',
      'swapNotifications'
    ]),
    ...mapGetters('global', ['network', 'isEthNetwork']),
    ...mapState('wallet', ['address', 'web3']),
    ...mapState('notifications', ['lastFetched']),
    hasNotifications() {
      return this.allNotifications.length > 0;
    },
    loading() {
      return this.$apollo.loading;
    },
    /**
     * Swap Handler
     */
    swapper() {
      return new handlerSwap(this.web3);
    },
    /**
     * Formatted current notifications
     */
    formattedCurrentNotifications() {
      return this.currentNotifications.map(notification => {
        const newObj = this.formatNotifications(notification);
        if (newObj.type.toLowerCase() === notificationTypes.swap) {
          newObj.checkSwapStatus(this.swapper);
        }
        return newObj;
      });
    },
    /**
     * Formatteds outgoing tx notifications
     */
    outgoingTxNotifications() {
      return this.txNotifications
        .map(notification => {
          return this.formatNotifications(notification);
        })
        .sort(this.sortByDate);
    },
    /**
     * Formatted swap notifications
     */
    formattedSwapNotifications() {
      return this.swapNotifications
        .map(notification => {
          const newObj = this.formatNotifications(notification);
          newObj.checkSwapStatus(this.swapper);
          return newObj;
        })
        .sort(this.sortByDate);
    },
    /**
     * Formatted incoming tx notifications
     */
    incomingTxNotifications() {
      if (!this.loading) {
        // this.setFetchedTime();
        return this.incomingTxs
          .map(notification => {
            notification.read = notification.date < this.lastFetched;
            return this.formatNotifications(notification, true);
          })
          .sort(this.sortByDate);
      }
      return [];
    },
    /**
     * Returns all the notifications
     */
    allNotifications() {
      const sorted = this.formattedCurrentNotifications
        .concat(this.incomingTxNotifications)
        .sort(this.sortByDate);
      return sorted;
    },
    /**
     * Display notifications based on type
     */
    notificationsByType() {
      switch (this.selected) {
        case notificationTypes.in:
          return this.incomingTxNotifications;
        case notificationTypes.out:
          return this.outgoingTxNotifications;
        case notificationTypes.swap:
          return this.swapNotifications;
        default:
          return this.allNotifications;
      }
    },
    /**
     * Notification count
     */
    notificationCount() {
      const unread = this.allNotifications.filter(item => {
        if (!item.read) {
          return item;
        }
      });
      return unread.length;
    }
  },
  methods: {
    ...mapActions('notifications', ['updateNotification', 'setFetchedTime']),
    sortByDate(a, b) {
      return new Date(b.date) - new Date(a.date);
    },
    /**
     * Mark notification as red
     */
    markNotificationAsRead(notification) {
      if (!notification.read) {
        notification.markAsRead().then(res => {
          if (
            notification.type.value.toLowerCase() === notificationTypes.out ||
            notification.type.value.toLowerCase() === notificationTypes.swap
          ) {
            this.updateNotification(new Notification(res));
          }
        });
      }
    },
    /**
     * Get Transaction Fee
     */
    _getTotal(value, gasPrice, gasUsed) {
      const gasFee = toBN(gasPrice).mul(toBN(gasUsed));
      const total = toBN(value).add(gasFee);
      return fromWei(total);
    },
    /**
     * Get Transaction Status
     */
    _getTxStatus(status) {
      return hexToNumber(status) ? txTypes.success : txTypes.error;
    },
    /**
     * Format Tx obj to Notification obj
     */
    formatNotifications(obj, isIncomingTx) {
      /**
       * Get the correct values for tx fee, value, status and date
       */
      const txFee = obj.txFee
        ? obj.txFee
        : this._getTotal(obj.value, obj.gasPrice, obj.gasUsed);
      const value = isIncomingTx ? fromWei(obj.value) : obj.value;
      const date = obj.date
        ? obj.date
        : new BigNumber(obj.timestamp).times(1000);
      const status = isIncomingTx ? notificationTypes.in : obj.type;
      /**
       * Format into notification object for mew-notification
       */
      const notificationObj = {
        transactionHash: obj.hash,
        notification: {
          txHash: {
            value: obj.hash,
            string: 'Transaction Hash',
            link: `${this.network.type.blockExplorerTX.replace(
              '[[txHash]]',
              obj.hash
            )}`
          },
          gasPrice: {
            value: `${
              obj.gasPrice
                ? fromWei(BigNumber(obj.gasPrice).toString(), 'gwei')
                : 0
            } Gwei`,
            string: 'Gas Price'
          },
          gasLimit: {
            value: obj.gasLimit ? obj.gasLimit : obj.gas ? obj.gas : '0x',
            string: 'Gas Limit'
          },
          total: {
            value: `${txFee} ${this.network.type.currencyName}`,
            string: 'Total Transaction fee'
          },
          to: {
            value: obj.toTxData && obj.toTxData.to ? obj.toTxData.to : obj.to,
            string: 'To'
          },
          from: {
            value: obj.from,
            string: 'From'
          },
          amount: {
            value: `${value} ${this.network.type.currencyName}`,
            string: 'Amount'
          },
          timestamp: {
            value: timeAgo(BigNumber(date).toNumber()),
            string: 'Time'
          },
          status: {
            value: isHex(obj.status)
              ? this._getTxStatus(obj.status).toLowerCase()
              : obj.status,
            string: 'Status'
          },
          type: {
            value: status,
            string: status
          },
          read: obj && obj.read ? obj.read : false,
          toObj: obj.toTxData,
          fromObj: obj.fromTxData
        }
      };
      /**
       * Initiate new Notification class
       */
      notificationObj.notification = new Notification(
        notificationObj.notification
      );
      return notificationObj;
    }
  }
};
</script>

<style lang="scss" scoped>
.break-hash {
  word-break: break-all;
}
.edit {
  width: 37px;
  height: 37px;
  border-radius: 100%;
  background-color: var(--v-primary-base);
  cursor: pointer;
}

.notification-count {
  top: 0;
  border-radius: 100%;
  margin-bottom: 20px;
  margin-left: -10px;
  width: 18px;
  height: 18px;
  font-size: 12px;
}
</style>
