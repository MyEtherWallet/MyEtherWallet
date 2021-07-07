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
        class="
          notification-count
          pa-3
          cursor--pointer
          d-flex
          align-center
          justify-center
          white--text
          error
          lighten2
        "
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
import Notification, {
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS
} from './handlers/handlerNotification';
import handlerNotification from './handlers/handlerNotification.mixin';
import handlerSwap from '@/modules/swap/handlers/handlerSwap';

import formatNotification from './helpers/formatNotification';
import { EventBus } from '@/core/plugins/eventBus.js';

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
        { label: 'All', val: NOTIFICATION_TYPES.ALL },
        { label: 'In', val: NOTIFICATION_TYPES.IN },
        { label: 'Out', val: NOTIFICATION_TYPES.OUT },
        { label: 'Swap', val: NOTIFICATION_TYPES.SWAP }
      ],
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
        const type = notification.type;
        /**
         * Check swap status if it is a swap notification
         */
        if (type === NOTIFICATION_TYPES.SWAP) {
          notification.checkSwapStatus(this.swapper);
        }
        /**
         * Check status if it is an outgoing pending tx
         * and query getTransactionByHash
         */
        if (
          type === NOTIFICATION_TYPES.OUT &&
          notification.status.toLowerCase() === NOTIFICATION_STATUS.PENDING
        ) {
          this.txHash = notification.hash;
          if (this.getTransactionByHash && notification) {
            if (this.getTransactionByHash.status) {
              this.getTransactionByHash.status =
                this.getTransactionByHash.status === '0x1'
                  ? NOTIFICATION_STATUS.SUCCESS
                  : NOTIFICATION_STATUS.FAILED;
              notification.status = this.getTransactionByHash.status;
            }
            this.updateNotification(notification);
          }
        }
        return formatNotification(notification, this.network);
      });
    },
    /**
     * Formatted outgoing tx notifications
     */
    outgoingTxNotifications() {
      return this.txNotifications
        .map(notification => {
          return formatNotification(notification, this.network);
        })
        .sort(this.sortByDate);
    },
    /**
     * Formatted incoming tx notifications
     */
    incomingTxNotifications() {
      if (!this.loading) {
        return this.ethTransfersIncoming
          .filter(notification => {
            return (
              notification.to.toLowerCase() === this.address?.toLowerCase()
            );
          })
          .map(notification => {
            notification.type = NOTIFICATION_TYPES.IN;
            if (notification.status) notification.read = true;
            else notification.read = false;
            notification = new Notification(notification);
            return formatNotification(notification, this.network);
          })
          .sort(this.sortByDate);
      }
      return [];
    },
    /**
     * Returns all the notifications
     */
    allNotifications() {
      const sorted = this.formattedCurrentNotifications.concat(
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
  mounted() {
    EventBus.$on('openNotifications', () => {
      this.openNotifications = true;
    });
  },
  methods: {
    ...mapActions('notifications', ['updateNotification']),
    sortByDate(a, b) {
      return new Date(b.date) - new Date(a.date);
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
