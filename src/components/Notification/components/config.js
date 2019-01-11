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
  transaction: 'header.transaction'
};

const listComponentMapping = {
  swap: 'swap-notification',
  swapError: 'swap-notification',
  transactionError: 'transaction-notification',
  transaction: 'transaction-notification'
};

const detailComponentMapping = {
  swap: 'swap-details',
  swapError: 'swap-details',
  transactionError: 'transaction-details',
  transaction: 'transaction-details'
};

const noticeStatusFields = {
  swap: 'swapStatus',
  swapError: 'swapStatus',
  transactionError: 'status',
  transaction: 'status'
};

export {
  statusTypes,
  notificationHeaderLabels,
  listComponentMapping,
  detailComponentMapping,
  noticeStatusFields
};
