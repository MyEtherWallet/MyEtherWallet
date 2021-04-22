<template>
  <!--
  =====================================================================================
    Module Notifications
  =====================================================================================
  -->
  <div>
    <v-skeleton-loader
      v-if="loading"
      class="mx-auto"
      max-width="300"
      type="avatar"
    ></v-skeleton-loader>
    <div v-if="!loading" class="d-flex align-center">
      <v-btn icon @click="openNotifications = true">
        <img
          src="@/assets/images/icons/icon-notifications.svg"
          :class="[invertIcon ? 'make-white-svg' : '']"
        />
      </v-btn>
      <div
        v-if="notificationCount > 0"
        class="notification-count pa-3 cursor--pointer d-flex align-center justify-center white--text error lighten2"
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
                  @click.native="markNotificationAsRead(data)"
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
import { toBN } from 'web3-utils';
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
      onInit: true,
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
        const type = notification.type.toLowerCase();
        /**
         * Check status if it is a swap tx
         */
        if (type === notificationTypes.swap) {
          notification.checkSwapStatus(this.swapper);
        }
        /**
         * Check status if it is an outgoing pending tx
         * by querying getTransactionByHash
         */
        if (
          type === notificationTypes.out &&
          notification.status.toLowerCase() === txTypes.pending
        ) {
          this.txHash = notification.transactionHash;
          if (this.getTransactionByHash) {
            const notification = new Notification(
              this.getTransactionByHash,
              true
            );
            this.updateNotification(notification);
          }
        }
        return this.formatNotification(notification);
      });
    },
    /**
     * Formatted outgoing tx notifications
     */
    outgoingTxNotifications() {
      return this.txNotifications
        .map(notification => {
          return this.formatNotification(notification);
        })
        .sort(this.sortByDate);
    },
    /**
     * Formatted swap notifications
     */
    formattedSwapNotifications() {
      return this.swapNotifications
        .map(notification => {
          const newObj = this.formatNotification(notification);
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
        return this.ethTransfers
          .filter(notification => {
            return notification.to === this.address;
          })
          .map(notification => {
            notification.lastFetched = this.lastFetched;
            notification = new Notification(notification, true);
            return this.formatNotification(notification);
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
      return sorted.slice(0, 20);
    },
    /**
     * Display notifications based on type
     */
    notificationsByType() {
      switch (this.selected) {
        case notificationTypes.in:
          return this.incomingTxNotifications.slice(0, 20);
        case notificationTypes.out:
          return this.outgoingTxNotifications.slice(0, 20);
        case notificationTypes.swap:
          return this.swapNotifications.slice(0, 20);
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
    callPending() {},
    /**
     * Mark notification as read
     */
    markNotificationAsRead(notification) {
      if (!notification.read) {
        notification.markAsRead().then(res => {
          delete res.notification;
          const type = notification.type.toLowerCase();
          if (
            type === notificationTypes.out ||
            type === notificationTypes.swap
          ) {
            this.updateNotification(new Notification(res));
          } else {
            this.ethTransfers = this.ethTransfers.map(transfer => {
              if (transfer.transactionHash === res.transactionHash) {
                return new Notification(res, true);
              }
              return transfer;
            });
          }
        });
      }
    },
    /**
     * Format Notification obj for mew-notification
     */
    formatNotification(obj) {
      const notificationObj = {
        txHash: {
          value: obj.transactionHash,
          string: 'Transaction Hash',
          link: `${this.network.type.blockExplorerTX.replace(
            '[[txHash]]',
            obj.transactionHash
          )}`
        },
        gasPrice: {
          value: `${obj.gasPrice ? obj.gasPrice : 0} Gwei`,
          string: 'Gas Price'
        },
        gasLimit: {
          value: obj.gasLimit ? obj.gasLimit : '',
          string: 'Gas Limit'
        },
        total: {
          value: `${obj.transactionFee} ${this.network.type.currencyName}`,
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
          value: `${obj.value} ${this.network.type.currencyName}`,
          string: 'Amount'
        },
        timestamp: {
          value: timeAgo(toBN(obj.date).toNumber()),
          string: 'Time'
        },
        status: {
          value: obj.status?.toLowerCase(),
          string: 'Status'
        },
        type: {
          value: obj.type?.toLowerCase(),
          string: obj.type
        },
        read: obj.read,
        toObj: obj.toTxData,
        fromObj: obj.fromTxData
      };
      obj.notification = notificationObj;
      return obj;
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
