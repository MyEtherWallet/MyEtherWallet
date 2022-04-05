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
      <v-btn icon @click="openNotifications">
        <img
          src="@/assets/images/icons/icon-notifications.svg"
          :class="[invertIcon ? 'make-white-svg' : '']"
        />
      </v-btn>
      <div
        v-if="newNotificationCount > 0"
        class="notification-count pa-3 cursor--pointer d-flex align-center justify-center white--text error lighten2"
        @click="openNotifications"
      >
        {{ newNotificationCount }}
      </div>
    </div>
    <mew-overlay
      :footer="{
        text: 'Need help?',
        linkTitle: 'Contact support',
        link: 'mailto:support@myetherwallet.com'
      }"
      title="Notifications"
      content-size="large"
      :show-overlay="isOpenNotifications"
      :close="closeNotifications"
    >
      <v-sheet class="transparent" max-width="735px" width="100%">
        <v-sheet
          color="transparent"
          max-width="350px"
          class="d-flex align-center justify-space-between mx-auto mb-6"
        >
          <div>
            <v-icon color="greenPrimary" large> mdi-circle-medium </v-icon>
            Success
          </div>
          <div>
            <v-icon color="orangePrimary" large> mdi-circle-medium </v-icon>
            Pending
          </div>
          <div>
            <v-icon color="redPrimary" large> mdi-circle-medium </v-icon>
            Failed
          </div>
        </v-sheet>
        <div v-if="hasNotification" class="d-flex align-center justify-end">
          <!-- <div>
            <div>6 notifications</div>
            <v-btn depressed x-small color="textLight" dark>
              Delete all
            </v-btn>
          </div> -->
          <v-sheet color="transparent" max-width="150px">
            <mew-select :items="items" @input="setSelected" />
          </v-sheet>
        </div>
        <div
          v-for="(data, key) in notificationsByType"
          v-show="!loading && notificationsByType.length > 0"
          :key="key"
          class="mt-2"
        >
          <mew-notification
            :notification="data.notification"
            @click.native="markNotificationAsRead(data)"
          />
        </div>
        <div v-show="notificationsByType.length === 0" class="pa-5 text-center">
          <h3 class="mb-5">No notifications to display for:</h3>
          <h3 class="break-hash">{{ address }}</h3>
        </div>
      </v-sheet>
      <!-- <div class="text-center py-6">
        <v-pagination v-model="page" :length="6"></v-pagination>
      </div> -->
    </mew-overlay>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import Notification, {
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS
} from './handlers/handlerNotification';
import handlerNotification from './handlers/handlerNotification.mixin';
import handlerSwap from '@/modules/swap/handlers/handlerSwap';

import formatNotification from './helpers/formatNotification';
import formatNonChainNotification from './helpers/formatNonChainNotification';
import { EventBus } from '@/core/plugins/eventBus.js';
import NonChainNotification from './handlers/nonChainNotification';
// import { ROUTES_WALLET } from '@/core/configs/configRoutes';

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
      selected: NOTIFICATION_TYPES.ALL,
      items: [
        { name: 'All', value: NOTIFICATION_TYPES.ALL },
        { name: 'In', value: NOTIFICATION_TYPES.IN },
        { name: 'Out', value: NOTIFICATION_TYPES.OUT },
        { name: 'Swap', value: NOTIFICATION_TYPES.SWAP }
      ],
      isOpenNotifications: false
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
    loading() {
      return this.$apollo.loading;
    },
    /**
     * Swap Handler
     */
    swapper() {
      return new handlerSwap(this.web3, this.network.type.name);
    },
    /**
     * Formatted outgoing tx notifications
     */
    outgoingTxNotifications() {
      return this.txNotifications
        .map(notification => {
          if (notification.hasOwnProperty('hash')) {
            return formatNotification(notification, this.network);
          }
          return formatNonChainNotification(notification);
        })
        .sort(this.sortByDate);
    },
    /**
     * Formatted incoming tx notifications
     */
    incomingTxNotifications() {
      const address = this.address ? this.address.toLowerCase() : '';
      if (!this.loading) {
        return this.ethTransfersIncoming
          .filter(notification => {
            return notification.to.toLowerCase() === address;
          })
          .map(notification => {
            notification.type = NOTIFICATION_TYPES.IN;
            if (notification.status) notification.read = true;
            else notification.read = false;
            if (notification.hasOwnProperty('hash')) {
              notification = new Notification(notification);
              return formatNotification(notification, this.network);
            }
            notification = new NonChainNotification(notification);
            return formatNonChainNotification(notification);
          })
          .sort(this.sortByDate);
      }
      return [];
    },
    /**
     * Returns all the notifications
     */
    allNotifications() {
      const sorted = this.formattedCurrentNotifications().concat(
        this.incomingTxNotifications
      );
      sorted.sort(this.sortByDate);
      return sorted.slice(0, 20);
    },
    /**
     * Display notifications based on type
     */
    notificationsByType() {
      switch (this.selected) {
        case NOTIFICATION_TYPES.IN:
          return this.incomingTxNotifications
            .slice(0, 20)
            .sort(this.sortByDate);
        case NOTIFICATION_TYPES.OUT:
          return this.outgoingTxNotifications
            .slice(0, 20)
            .sort(this.sortByDate);
        case NOTIFICATION_TYPES.SWAP:
          return this.swapNotifications.slice(0, 20).sort(this.sortByDate);
        default:
          return this.allNotifications;
      }
    },
    /**
     * new notification count
     */
    newNotificationCount() {
      const unread = this.allNotifications.filter(item => {
        if (!item.read) {
          return item;
        }
      });
      return unread.length;
    },
    /**
     * checks whether user has notifications
     */
    hasNotification() {
      return this.allNotifications.length > 0;
    }
  },
  mounted() {
    const _this = this;
    EventBus.$on('openNotifications', () => {
      _this.openNotifications();
    });
    _this.currentNotifications.forEach(notification => {
      _this.checkAndSetNotificationStatus(notification);
    });
  },
  methods: {
    ...mapActions('notifications', ['updateNotification']),
    /**
     * Set the filter value
     */
    setSelected(input) {
      this.selected = input.value;
    },
    sortByDate(a, b) {
      return new Date(b.date) - new Date(a.date);
    },
    /**
     * Formatted current notifications
     */
    formattedCurrentNotifications() {
      return this.currentNotifications.map(notification => {
        if (notification.hasOwnProperty('hash')) {
          return formatNotification(notification, this.network);
        }
        return formatNonChainNotification(notification);
      });
    },
    /**
     * Check status if it is an outgoing pending tx
     */
    checkAndSetNotificationStatus(notification) {
      const type = notification.type;
      if (notification.status) {
        if (
          type === NOTIFICATION_TYPES.SWAP &&
          notification.status.toLowerCase() ===
            NOTIFICATION_STATUS.PENDING.toLowerCase()
        ) {
          notification.checkSwapStatus(this.swapper);
        }
        if (
          type === NOTIFICATION_TYPES.OUT &&
          notification.status.toLowerCase() ===
            NOTIFICATION_STATUS.PENDING.toLowerCase()
        ) {
          this.web3.eth
            .getTransactionReceipt(notification.hash)
            .then(receipt => {
              if (receipt) {
                notification.status = receipt.status
                  ? NOTIFICATION_STATUS.SUCCESS
                  : NOTIFICATION_STATUS.FAILED;
                this.updateNotification(notification);
              }
            });
        }
      }
    },
    /**
     * Mark notification as read
     */
    markNotificationAsRead(notification) {
      if (!notification.read) {
        notification.markAsRead().then(() => {
          const type = notification.type.toLowerCase();
          if (
            type === NOTIFICATION_TYPES.OUT ||
            type === NOTIFICATION_TYPES.SWAP
          ) {
            this.updateNotification(notification);
          } else {
            notification.read = true;
          }
        });
      }
    },
    openNotifications() {
      // this.$router.push({ name: ROUTES_WALLET.NOTIFICATIONS.NAME });
      this.isOpenNotifications = true;
    },
    closeNotifications() {
      // this.$router.go(-1);
      this.isOpenNotifications = false;
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
  background-color: var(--v-greenPrimary-base);
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
