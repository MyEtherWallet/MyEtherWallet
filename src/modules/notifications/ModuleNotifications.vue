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
          <v-sheet color="transparent" max-width="150px">
            <mew-select
              :items="items"
              :has-filter="false"
              normal-dropdown
              @input="setSelected"
            />
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
    </mew-overlay>
  </div>
</template>

<script>
const MAX_ITEMS = 15;
</script>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useQuery, useSubscription } from '@vue/apollo-composable';
import Notification, {
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS
} from './handlers/handlerNotification';

import formatNotification from './helpers/formatNotification';
import formatNonChainNotification from './helpers/formatNonChainNotification';
import { EventBus } from '@/core/plugins/eventBus.js';

import { useNotificationsStore } from '@/core/store/notifications';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import {
  getEthTransfersV2,
  getTransactionsByHashes,
  getTransactionByHash,
  pendingTransaction,
  transactionEvent
} from '@/apollo/queries/notifications/notification.graphql';
import handlerSwap from '@/modules/swap/handlers/handlerSwap';
import NonChainNotification from './handlers/nonChainNotification';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { errorMsgs } from '@/apollo/configs/configErrorMsgs';

// injections/use
const {
  currentNotifications,
  txNotifications,
  swapNotifications,
  updateNotification
} = useNotificationsStore();
const { network, isEthNetwork } = useGlobalStore();
const { address, web3 } = useWalletStore();

// props
defineProps({
  invertIcon: {
    type: Boolean,
    default: false
  }
});

// apollo calls
/**
 * Apollo query to get the last 20 eth transfers by owner
 */
const {
  onResult: getEthTransfersV2Result,
  onError: getEthTransfersV2Error,
  loading: getEthTransfersV2Loading
} = useQuery(
  getEthTransfersV2,
  () => ({ owner: address.value, limit: MAX_ITEMS }),
  () => ({
    enabled: isEthNetwork || address.value === null || address.value === ''
  })
);

getEthTransfersV2Result(({ data }) => {
  if (data && data.getEthTransfersV2.transfers) {
    data.getEthTransfersV2.transfers.forEach(transfer => {
      const hash = transfer.transfer.transactionHash;
      !txHashes.value.includes(hash) ? txHashes.value.push(hash) : null;
    });
  }
});

getEthTransfersV2Error(({ error }) => {
  Toast(error.message, {}, ERROR);
});

/**
 * Apollo query to fetch transaction details by hashes
 * Only returns 10 at a time
 */
const {
  onResult: getTransactionsByHashesResult,
  onError: getTrasnactionsByHashesError,
  loading: getTrasnactionsByHashesLoading
} = useQuery(
  getTransactionsByHashes,
  () => ({ hashes: txHashes.value }),
  () => ({
    fetchPolicy: 'cache-and-network',
    enabled: !isEthNetwork || txHashes.value.length === 0
  })
);

getTransactionsByHashesResult(({ data }) => {
  if (data && data.getTransactionsByHashes) {
    ethTransfersIncoming.value = data.getTransactionsByHashes;
  }
});
getTrasnactionsByHashesError(({ error }) => {
  Toast(error.message, {}, ERROR);
});

/**
 * Apollo query to fetch transaction details by hash
 * Only fetches one at a time
 */
const {
  onResult: getTransactionByHashResult,
  onError: getTransactionByHashError,
  loading: getTransactionByHashLoading,
  subscribeToMore: getTransactionByHashUpdate,
  refetch: getTransactionByHashRefetch
} = useQuery(
  getTransactionByHash,
  () => ({
    hash: txHash.value
  }),
  () => ({
    enabled:
      isEthNetwork ||
      txHash.value ||
      txHash.value !== '' ||
      txHash.value !== null
  })
);

getTransactionByHashUpdate(({ data }) => {
  return data.transactionByHash;
});

getTransactionByHashResult(({ data }) => {
  if (data) {
    const getTransactionByHash = data.getTransactionByHash;
    if (getTransactionByHash.to === address.value) {
      const copyArray = ethTransfersIncoming.value;
      const foundIdx = copyArray.findIndex(item => {
        if (getTransactionByHash.hash === item.hash) {
          return item;
        }
      });
      foundIdx >= 0
        ? copyArray.splice(foundIdx, 1, getTransactionByHash)
        : copyArray.unshift(getTransactionByHash);
      ethTransfersIncoming.value = copyArray;
    }
  }
});
getTransactionByHashError(({ error }) => {
  if (error.message.includes(errorMsgs.cannotReturnNull)) {
    return;
  }
  Toast(error.message, {}, ERROR);
});

/**
 * Apollo subscription for pending txs
 */
const { onResult: pendingTransactionResult, onError: pendingTransactionError } =
  useSubscription(
    pendingTransaction,
    () => ({ owner: address.value }),
    () => ({
      enabled:
        isEthNetwork ||
        address.value !== '' ||
        address.value !== null ||
        !loading.value
    })
  );

pendingTransactionResult(({ data }) => {
  if (data && data.pendingTransaction) {
    const pendingTx = data.pendingTransaction;
    if (pendingTx.to?.toLowerCase() === address.value) {
      txHash.value = pendingTx.transactionHash;
    }
  }
});
pendingTransactionError(({ error }) => {
  Toast(error.message, {}, ERROR);
});

/**
 * Apollo subscription for transactions
 */
const { onResult: transactionEventResult, onError: transactionEventError } =
  useSubscription(
    transactionEvent,
    () => ({ hash: txHash.value }),
    () => ({
      enabled:
        isEthNetwork ||
        txHash.value ||
        txHash.value !== '' ||
        txHash.value !== null
    })
  );

transactionEventResult(() => {
  getTransactionByHashRefetch();
});
transactionEventError(({ error }) => {
  Toast(error.message, {}, ERROR);
});

// data
const selected = NOTIFICATION_TYPES.ALL;
const items = [
  { name: 'All', value: NOTIFICATION_TYPES.ALL },
  { name: 'In', value: NOTIFICATION_TYPES.IN },
  { name: 'Out', value: NOTIFICATION_TYPES.OUT },
  { name: 'Swap', value: NOTIFICATION_TYPES.SWAP }
];
const isOpenNotifications = ref(false);
const txHash = ref('');
const txHashes = ref([]);
const ethTransfersIncoming = ref([]);

// computed
const loading = computed(() => {
  return (
    getEthTransfersV2Loading.value &&
    getTrasnactionsByHashesLoading.value &&
    getTransactionByHashLoading.value
  );
});

/**
 * Swap Handler
 */
const swapper = computed(() => {
  return new handlerSwap(web3.value, network.value.type.name);
});
/**
 * Formatted outgoing tx notifications
 */
const outgoingTxNotifications = computed(() => {
  return txNotifications.value
    .map(notification => {
      if (notification.hasOwnProperty('hash')) {
        return formatNotification(notification, network.value);
      }
      return formatNonChainNotification(notification);
    })
    .sort(sortByDate);
});
/**
 * Formatted incoming tx notifications
 */
const incomingTxNotifications = computed(() => {
  const locAddress = address.value ? address.value.toLowerCase() : '';
  if (!loading.value) {
    return ethTransfersIncoming.value
      .reduce((arr, notification) => {
        if (notification.to?.toLowerCase() === locAddress) {
          notification.type = NOTIFICATION_TYPES.IN;
          if (notification.status) notification.read = true;
          else notification.read = false;
          if (notification.hasOwnProperty('hash')) {
            notification = new Notification(notification);
            arr.push(formatNotification(notification, network.value));
          } else {
            notification = new NonChainNotification(notification);
            arr.push(formatNonChainNotification(notification));
          }
        }
        return arr;
      }, [])
      .sort(sortByDate);
  }
  return [];
});
/**
 * Returns all the notifications
 */
const allNotifications = computed(() => {
  const sorted = formattedCurrentNotifications().concat(
    incomingTxNotifications
  );
  sorted.sort(sortByDate);
  return sorted.slice(0, 20);
});
/**
 * Display notifications based on type
 */
const notificationsByType = computed(() => {
  switch (selected) {
    case NOTIFICATION_TYPES.IN:
      return incomingTxNotifications.value.slice(0, 20).sort(sortByDate);
    case NOTIFICATION_TYPES.OUT:
      return outgoingTxNotifications.value.slice(0, 20).sort(sortByDate);
    case NOTIFICATION_TYPES.SWAP:
      return swapNotifications.value.slice(0, 20).sort(sortByDate);
    default:
      return allNotifications.value;
  }
});
/**
 * new notification count
 */
const newNotificationCount = computed(() => {
  const unread = allNotifications.value.filter(item => {
    if (!item.read) {
      return item;
    }
  });
  return unread.length;
});
/**
 * checks whether user has notifications
 */
const hasNotification = computed(() => {
  return allNotifications.value.length > 0;
});

// watch
watch(
  currentNotifications.value,
  newVal => {
    newVal.forEach(notification => {
      checkAndSetNotificationStatus(notification);
    });
  },
  { deep: true }
);

// mounted
onMounted(() => {
  EventBus.$on('openNotifications', () => {
    openNotifications();
  });
  currentNotifications.value.forEach(notification => {
    checkAndSetNotificationStatus(notification);
  });
});

// before Destroy
onBeforeUnmount(() => {
  EventBus.$off('openNotifications');
});

// methods
/**
 * Set the filter value
 */
const setSelected = input => {
  selected.value = input.value;
};
const sortByDate = (a, b) => {
  return new Date(b.date) - new Date(a.date);
};
/**
 * Formatted current notifications
 */
const formattedCurrentNotifications = () => {
  return currentNotifications.map(notification => {
    if (notification.hasOwnProperty('hash')) {
      return formatNotification(notification, network.value);
    }
    return formatNonChainNotification(notification);
  });
};
/**
 * Check status if it is an outgoing pending tx
 */
const checkAndSetNotificationStatus = notification => {
  const type = notification.type;
  if (notification.status) {
    if (
      type === NOTIFICATION_TYPES.SWAP &&
      notification.status.toLowerCase() === NOTIFICATION_STATUS.PENDING
    ) {
      notification.checkSwapStatus(swapper);
    }
    if (
      type === NOTIFICATION_TYPES.OUT &&
      notification.status.toLowerCase() === NOTIFICATION_STATUS.PENDING
    ) {
      web3.value.eth.getTransactionReceipt(notification.hash).then(receipt => {
        if (receipt) {
          notification.status = receipt.status
            ? NOTIFICATION_STATUS.SUCCESS
            : NOTIFICATION_STATUS.FAILED;
          updateNotification(notification);
        }
      });
    }
  }
};
/**
 * Mark notification as read
 */
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
const openNotifications = () => {
  isOpenNotifications.value = true;
};
const closeNotifications = () => {
  isOpenNotifications.value = false;
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
