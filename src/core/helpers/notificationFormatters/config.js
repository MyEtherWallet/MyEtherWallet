const type = {
  TRANSACTION: 'Transaction',
  TRANSACTION_HASH: 'Hash',
  TRANSACTION_RECEIPT: 'Receipt',
  TRANSACTION_ERROR: 'Error',
  CONTRACT_CALL: '',
  SWAP: 'swap',
  SWAP_HASH: 'Swap_Hash',
  SWAP_RECEIPT: 'Swap_Receipt',
  SWAP_ERROR: 'Swap_Error',
  SWAP_ORDER: 'Swap_Order',
  CONTRACT_CREATION: 'Contract_Creation'
};

const notificationType = {
  TRANSACTION: 'transaction',
  SWAP: 'swap',
  SWAP_ERROR: 'swapError',
  ERROR: 'transactionError',
  CONTRACT_CREATION: 'contractCreation'
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
  txDetails: 3,
  response: 4
};

const txIndexes = {
  label: 0,
  address: 1,
  txDetails: 2,
  response: 3,
  txHash: 4
};

const fiatCurrencies = ['CHF', 'USD', 'EUR'];

const INVESTIGATE_FAILURE_KEY = 'Investigate';

export {
  fiatCurrencies,
  INVESTIGATE_FAILURE_KEY,
  type,
  notificationType,
  notificationStatuses,
  swapOnlyStatuses,
  swapIndexes,
  txIndexes
};
