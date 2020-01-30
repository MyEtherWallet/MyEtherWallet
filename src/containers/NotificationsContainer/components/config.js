const statusTypes = {
  new: {
    text: 'notifications.swap-created',
    class: 'status-processing'
  },
  sent: {
    text: 'notifications.processing',
    class: 'status-processing'
  },
  pending: {
    text: 'notifications.processing',
    class: 'status-processing'
  },
  complete: {
    text: 'notifications.success',
    class: 'status-succeed'
  },
  failed: {
    text: 'notifications.failed',
    class: 'status-failed'
  },
  cancelled: {
    text: 'notifications.cancelled',
    class: 'status-processing'
  },
  error: {
    text: 'notifications.error',
    class: 'status-failed'
  },
  statusError: {
    text: 'notifications.status-error',
    class: 'status-failed'
  }
};

const notificationHeaderLabels = {
  swap: 'common.swap',
  swapError: 'common.swap',
  transactionError: 'sendTx.tx',
  transaction: 'sendTx.tx',
  contractCreation: 'interface.contract-creation'
};

const listComponentMapping = {
  swap: 'swap-notification',
  swapError: 'swap-notification',
  transactionError: 'transaction-notification',
  transaction: 'transaction-notification',
  contractCreation: 'transaction-notification'
};

const detailComponentMapping = {
  swap: 'swap-details',
  swapError: 'swap-details',
  transactionError: 'transaction-details',
  transaction: 'transaction-details',
  contractCreation: 'transaction-details'
};

const noticeStatusFields = {
  swap: 'swapStatus',
  swapError: 'swapStatus',
  transactionError: 'status',
  transaction: 'status',
  contractCreation: 'status'
};

const notificationStatuses = {
  PENDING: 'pending',
  COMPLETE: 'complete',
  FAILED: 'failed'
};

const notificationType = {
  TRANSACTION: 'transaction',
  SWAP: 'swap',
  SWAP_ERROR: 'swapError',
  ERROR: 'transactionError',
  CONTRACT_CREATION: 'contractCreation'
};

export {
  statusTypes,
  notificationHeaderLabels,
  listComponentMapping,
  detailComponentMapping,
  noticeStatusFields,
  notificationStatuses,
  notificationType
};
