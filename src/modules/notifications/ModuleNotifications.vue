<template>
  <div>
    <div class="d-flex align-center">
      <v-btn icon @click="openNotifications = true">
        <img src="@/assets/images/icons/icon-notifications.svg" />
      </v-btn>
      <div
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
                v-show="hasNotifications"
                :key="data.transactionHash"
                class="mt-2"
              >
                <mew-notification
                  :notification="data.notification"
                  @click.native="markNotificationAsRead(data)"
                />
              </div>
              <div v-show="!hasNotifications" class="pa-5 text-center">
                <h3>No notifications to display for {{ address }}</h3>
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
import Notification from './handler/handlerNotification';
export default {
  name: 'ModuleNotifications',
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
    ...mapGetters('global', ['network']),
    ...mapState('wallet', ['address']),
    hasNotifications() {
      return this.allNotifications.length > 0;
    },
    transformCurrentNoti() {
      const newArr = this.currentNotifications.map(notification => {
        const newObj = this.formatObj(notification);
        return newObj;
      });
      return newArr;
    },
    transformTxNoti() {
      const newArr = this.txNotifications.map(notification => {
        const newObj = this.formatObj(notification);
        return newObj;
      });
      return newArr;
    },
    transformSwapNoti() {
      const newArr = this.swapNotifications.map(notification => {
        const newObj = this.formatObj(notification);
        return newObj;
      });
      return newArr;
    },
    allNotifications() {
      return this.transformCurrentNoti.concat(this.inTx);
    },
    showNotifications() {
      switch (this.selected) {
        case 'all':
          return this.allNotifications;
        case 'in':
          return this.inTx;
        case 'out':
          return this.transformTxNoti;
        case 'swapNotifications':
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
  methods: {
    ...mapActions('notifications', ['updateNotification']),
    markNotificationAsRead(notification) {
      if (!notification.read) {
        notification.markAsRead().then(res => {
          const newObj = Object.assign(res);
          delete newObj.notification;
          this.updateNotification(new Notification(res));
        });
      }
    },
    formatObj(obj) {
      const newObj = {
        txHash: {
          value: obj.transactionHash,
          string: 'Transaction Hash'
        },
        gasPrice: {
          value: `${fromWei(toBN(obj.gasPrice), 'gwei')} Gwei`,
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
        from: {
          value: obj.from,
          string: 'From'
        },
        amount: {
          value: `${obj.value} ${this.network.type.currencyName}`,
          string: 'Amount'
        },
        timestamp: {
          value: '1 min ago',
          string: 'Time'
        },
        status: {
          value: obj.status.toLowerCase(),
          string: 'Status'
        },
        type: {
          value: obj.type.toLowerCase(),
          string: 'in'
        }
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
