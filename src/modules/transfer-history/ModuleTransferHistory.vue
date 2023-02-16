<template>
  <mew6-white-sheet class="px-7 justify-space-between pt-6">
    <v-row dense>
      <v-col cols="11">
        <div class="mew-heading-2 mb-3 ml-7">{{ actualTitle }}</div>
      </v-col>
      <v-col cols="1" align="right" @click="toggleDropdown">
        <v-icon color="black">{{ chevronIcon }}</v-icon>
      </v-col>
      <v-col v-if="dropdown" cols="12" class="px-0">
        <div v-for="(data, key) in actualNotifications" :key="key" class="mb-2">
          <mew-notification
            :show-indicator="false"
            :notification="data.notification"
            class="px-0"
            @click.native="markNotificationAsRead(data)"
          />
        </div>
      </v-col>
    </v-row>
  </mew6-white-sheet>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import formatNotification from '@/modules/notifications/helpers/formatNotification';
import formatNonChainNotification from '@/modules/notifications/helpers/formatNonChainNotification';
import { NOTIFICATION_TYPES } from '@/modules/notifications/handlers/handlerNotification.js';

export default {
  name: 'ModuleTransferHistory',
  props: {
    isSwap: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { dropdown: true };
  },
  computed: {
    ...mapState('wallet', ['web3', 'address']),
    ...mapGetters('global', ['network']),
    ...mapGetters('notifications', ['txNotifications', 'swapNotifications']),
    parsedTxNotifications() {
      return this.txNotifications
        .map(item => {
          if (item.hasOwnProperty('hash')) {
            return formatNotification(item, this.network);
          }
          return formatNonChainNotification(item);
        })
        .sort(this.sortByDate);
    },
    parsedSwapNotifications() {
      return this.swapNotifications
        .map(item => {
          if (item.hasOwnProperty('hash')) {
            return formatNotification(item, this.network);
          }
          return formatNonChainNotification(item);
        })
        .sort(this.sortByDate);
    },
    actualNotifications() {
      return !this.isSwap
        ? this.parsedTxNotifications
        : this.parsedSwapNotifications;
    },
    actualTitle() {
      return this.isSwap ? `Swap History` : `Tx History`;
    },
    chevronIcon() {
      return this.dropdown ? 'mdi-chevron-up' : 'mdi-chevron-down';
    }
  },
  mounted() {},
  methods: {
    ...mapActions('notifications', ['updateNotification']),
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
    sortByDate(a, b) {
      return new Date(b.date) - new Date(a.date);
    },
    toggleDropdown() {
      this.dropdown = !this.dropdown;
    }
  }
};
</script>

<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}

.history-container {
  max-height: 300px;
  overflow-y: scroll;
  /**
  * adding this style here until mew-notification is updated with a new prop
  */
  .notification-container {
    background-color: var(--v-white-base) !important;
    border: none !important;
  }
}
</style>
