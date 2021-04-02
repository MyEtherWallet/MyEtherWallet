<template>
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
                v-for="data in showNotifications"
                v-show="showNotifications.length > 0"
                :key="data.transactionHash"
                class="mt-2"
              >
                <mew-notification
                  :notification="data.notification"
                  @click.native="markNotificationAsRead(data)"
                />
              </div>
              <div
                v-show="showNotifications.length === 0"
                class="pa-5 text-center"
              >
                <div class="mew-heading-2 mb-2">
                  No notifications to display for
                </div>
                <div class="word-break--break-all mew-heading-3">
                  {{ address }}
                </div>
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
import { fromWei, toBN } from 'web3-utils';
import { mapGetters, mapState, mapActions } from 'vuex';
import Notification from './handlers/handlerNotification';
import NotificationsCall from '@/apollo/queries/notifications';
import Swapper from '@/modules/swap/handlers/handlerSwap';
import timeAgo from '@/core/helpers/timeAgo';
export default {
  name: 'ModuleNotifications',
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
      inTx: [],
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
    swapper() {
      return new Swapper(this.web3);
    },
    caller() {
      if (this.isEthNetwork) {
        return new NotificationsCall(this.$apollo);
      }
      return null;
    },
    transformCurrentNoti() {
      const newArr = this.currentNotifications.map(notification => {
        const newObj = this.formatObj(notification);
        if (newObj.type === 'SWAP') {
          newObj.checkSwapStatus(this.swapper);
        }
        return newObj;
      });
      return newArr;
    },
    transformTxNoti() {
      const newArr = this.txNotifications
        .map(notification => {
          const newObj = this.formatObj(notification);
          return newObj;
        })
        .sort(this.sortByDate);
      return newArr;
    },
    transformSwapNoti() {
      const newArr = this.swapNotifications
        .map(notification => {
          const newObj = this.formatObj(notification);
          newObj.checkSwapStatus(this.swapper);
          return newObj;
        })
        .sort(this.sortByDate);
      return newArr;
    },
    transformInNoti() {
      const newArr = this.inTx
        .map(notification => {
          const newObj = this.formatObj(notification);
          return newObj;
        })
        .sort(this.sortByDate);
      return newArr;
    },
    allNotifications() {
      const sorted = this.transformCurrentNoti
        .concat(this.transformInNoti)
        .sort(this.sortByDate);
      return sorted;
    },
    showNotifications() {
      switch (this.selected) {
        case 'in':
          return this.inTx;
        case 'out':
          return this.transformTxNoti;
        case 'swap':
          return this.transformSwapNoti;
        default:
          return this.allNotifications;
      }
    },
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
    network() {
      this.setupInTx();
    }
  },
  mounted() {
    this.setupInTx();
  },
  methods: {
    ...mapActions('notifications', ['updateNotification', 'setFetchedTime']),
    sortByDate(a, b) {
      return new Date(b.date) - new Date(a.date);
    },
    // next key for pendingTx subscription
    parsePendingTx(result) {
      const data = result.data.pendingTransaction;
      if (data.to.toLowerCase() === this.address.toLowerCase()) {
        const copyArray = this.inTx;
        data['transactionFee'] = data.txFee;
        data['date'] = data.timestamp * 1000;
        delete data.txFee;
        delete data.__typename;
        delete data.timestamp;
        const newNotification = new Notification(data);
        this.inTx.push(newNotification);
        this.caller.subscribeToTxHash(data, () => {
          this.caller.getTxDetailFromPending(data).then(res => {
            const notification = new Notification(res);
            const foundIdx = copyArray.findIndex(item => {
              if (res.transactionHash === item.transactionHash) {
                return item;
              }
            });

            if (foundIdx) {
              copyArray.splice(foundIdx, 0, notification);
              this.inTx = copyArray;
            } else {
              copyArray.push(notification);
            }
            this.inTx = copyArray;
          });
        });
      }
    },
    setupInTx() {
      if (this.isEthNetwork) {
        const lastFetched = this.lastFetched;
        const newArr = [];
        this.caller.getAllTransfer(this.address).then(res => {
          res.forEach(item => {
            if (item.date < lastFetched) {
              item.read = true;
            }
            newArr.push(new Notification(item));
          });
          this.inTx = newArr;
          this.setFetchedTime();
        });
        this.caller.subscribeToPending(this.address, this.parsePendingTx);
      }
    },
    markNotificationAsRead(notification) {
      if (!notification.read) {
        notification.markAsRead().then(res => {
          delete res.notification;
          if (notification.type === 'OUT' || notification.type === 'SWAP') {
            this.updateNotification(new Notification(res));
          } else {
            this.inTx = this.inTx.map(item => {
              if (item.transactionHash === res.transactionHash) {
                return new Notification(res);
              }
              return item;
            });
          }
        });
      }
    },
    formatObj(obj) {
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
            obj.gasPrice ? fromWei(toBN(obj.gasPrice), 'gwei') : 0
          } Gwei`,
          string: 'Gas Price'
        },
        gasLimit: {
          value: obj.gasLimit,
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
          value: obj.status.toLowerCase(),
          string: 'Status'
        },
        type: {
          value: obj.type.toLowerCase(),
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
