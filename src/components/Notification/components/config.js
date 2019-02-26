const statusTypes = {
  new: { text: 'Swap Created', class: 'status-processing' },
  sent: { text: 'Processing', class: 'status-processing' },
  pending: { text: 'Processing', class: 'status-processing' },
  complete: { text: 'Succeed', class: 'status-succeed' },
  failed: { text: 'Failed', class: 'status-failed' },
  cancelled: { text: 'Cancelled', class: 'status-processing' },
  error: { text: 'Error', class: 'status-failed' },
  statusError: { text: 'Status Error', class: 'status-failed' }
};

const notificationHeaderLabels = {
  swap: 'header.swap',
  swapError: 'header.swap',
  transactionError: 'header.transaction',
  transaction: 'header.transaction',
  contractCreation: 'header.contractCreation'
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
