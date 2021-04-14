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
                v-show="notificationsByType.length > 0"
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
import { fromWei } from 'web3-utils';
import { mapGetters, mapState, mapActions } from 'vuex';
import Notification from './handlers/handlerNotification';
import handlerNotification from './handlers/handlerNotification.mixin';
import handlerSwap from '@/modules/swap/handlers/handlerSwap';
import timeAgo from '@/core/helpers/timeAgo';
import BigNumber from 'bignumber.js';

const types = {
  swap: 'swap',
  in: 'in',
  out: 'out'
};

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
        const newObj = this.formatNotification(notification);
        if (newObj.type.toLowerCase() === types.swap) {
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
      return this.incomingTxs
        .map(notification => {
          notification.read = notification.date < this.lastFetched;
          notification = new Notification(notification);
          this.setFetchedTime();
          return this.formatNotification(notification);
        })
        .sort(this.sortByDate);
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
        case types.in:
          return this.incomingTxNotifications;
        case types.out:
          return this.outgoingTxNotifications;
        case types.swap:
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
  watch: {
    notificationsByType(newVal, oldVal) {
      console.error('hello', newVal, oldVal);
    }
  },
  methods: {
    ...mapActions('notifications', ['updateNotification', 'setFetchedTime']),
    sortByDate(a, b) {
      return new Date(b.date) - new Date(a.date);
    },
    markNotificationAsRead(notification) {
      if (!notification.read) {
        notification.markAsRead().then(res => {
          delete res.notification;
          if (
            notification.type.toLowerCase() === types.out ||
            notification.type.toLowerCase() === types.swap
          ) {
            this.updateNotification(new Notification(res));
          } else {
            this.incomingTxs = this.incomingTxs.map(item => {
              if (item.transactionHash === res.transactionHash) {
                return new Notification(res);
              }
              return item;
            });
          }
        });
      }
    },
    formatNotification(obj) {
      const newObj = {
        txHash: {
          value: obj.transactionHash,
          string: 'Transaction Hash',
          link: `${this.network.type.blockExplorerTX.replace(
            '[[txHash]]',
            obj.transactionHash
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
          value: `${obj.txFee} ${this.network.type.currencyName}`,
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
          value: timeAgo(BigNumber(obj.date).toNumber()),
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

      obj.notification = newObj;
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
