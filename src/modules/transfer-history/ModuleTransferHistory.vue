<template>
  <white-sheet class="px-5 px-lg-7 py-5 justify-space-between">
    <v-row dense>
      <v-col cols="11">
        <div :class="[draggable ? 'ml-7' : '', 'mew-heading-2 mb-3']">
          {{ actualTitle }}
        </div>
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
  </white-sheet>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';
import { useGlobalStore } from '@/core/store/global';

import formatNotification from '@/modules/notifications/helpers/formatNotification';
import formatNonChainNotification from '@/modules/notifications/helpers/formatNonChainNotification';
import { NOTIFICATION_TYPES } from '@/modules/notifications/handlers/handlerNotification.js';
import { useNotificationsStore } from '@/core/store/notifications';

// injections/use
const { network } = useGlobalStore();
const { txNotifications, swapNotifications, updateNotification } =
  useNotificationsStore();

// props
const props = defineProps({
  isSwap: {
    type: Boolean,
    default: false
  },
  draggable: {
    type: Boolean,
    default: false
  }
});

// data
const dropdown = ref(true);

// computed
const parsedTxNotifications = computed(() => {
  return txNotifications.value
    .map(item => {
      if (item.hasOwnProperty('hash')) {
        return formatNotification(item, network.value);
      }
      return formatNonChainNotification(item);
    })
    .sort(sortByDate);
});

const parsedSwapNotifications = computed(() => {
  return swapNotifications.value
    .map(item => {
      if (item.hasOwnProperty('hash')) {
        return formatNotification(item, network.value);
      }
      return formatNonChainNotification(item);
    })
    .sort(sortByDate);
});

const actualNotifications = computed(() => {
  return props.isSwap ? parsedSwapNotifications : parsedTxNotifications;
});

const actualTitle = computed(() => {
  return props.isSwap ? 'Swap History' : 'Send History';
});

const chevronIcon = computed(() => {
  return dropdown.value ? 'mdi-chevron-up' : 'mdi-chevron-down';
});

// methods
const markNotificationAsRead = notification => {
  if (!notification.read) {
    notification.markAsRead().then(() => {
      const type = notification.type.toLowerCase();
      if (type === NOTIFICATION_TYPES.OUT || type === NOTIFICATION_TYPES.SWAP) {
        updateNotification(notification);
      } else {
        notification.read = true;
      }
    });
  }
};

const sortByDate = (a, b) => {
  return new Date(b.date) - new Date(a.date);
};

const toggleDropdown = () => {
  dropdown.value = !dropdown.value;
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
