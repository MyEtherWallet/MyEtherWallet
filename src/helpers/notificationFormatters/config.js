const type = {
  TRANSACTION: 'Transaction',
  TRANSACTION_HASH: 'Hash',
  TRANSACTION_RECEIPT: 'Receipt',
  TRANSACTION_ERROR: 'Error',
  BATCH_TRANSACTION_HASH: 'Batch_Hash',
  BATCH_TRANSACTION_RECEIPT: 'Batch_Receipt',
  BATCH_TRANSACTION_ERROR: 'Batch_Error',
  CONTRACT_CALL: '',
  SWAP: 'swap',
  SWAP_HASH: 'Swap_Hash',
  SWAP_RECEIPT: 'Swap_Receipt',
  SWAP_ERROR: 'Swap_Error',
  SWAP_ORDER: 'Swap_Order',
  DEX_SWAP: 'Dex_Swap'
};

const notificationType = {
  TRANSACTION: 'transaction',
  SWAP: 'swap',
  DEX_SWAP: 'dex_swap',
  ERROR: 'transactionError'
};

const swapOnlyStatuses = {
  new: 'new',
  sent: 'sent',
  cancelled: 'cancelled',
  NEW: 'new',
  SENT: 'sent',
  CANCELLED: 'cancelled'
};

const notificationStatuses = {
  PENDING: 'pending',
  COMPLETE: 'complete',
  FAILED: 'failed'
};

const swapIndexes = {
  label: 0,
  address: 1,
  details: 2,
  response: 3
};

const txIndexes = {
  label: 0,
  address: 1,
  details: 2,
  response: 3
};

export {
  type,
  notificationType,
  notificationStatuses,
  swapOnlyStatuses,
  swapIndexes,
  txIndexes
};
