import BigNumber from 'bignumber.js';

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
  SWAP_ORDER: 'Swap'
};

const notificationType = {
  TRANSACTION: 'transaction',
  SWAP: 'swap',
  ERROR: 'transactionError'
};

const swapOnlyStatuses = {
  new: 'new',
  cancelled: 'cancelled',
  NEW: 'new',
  CANCELLED: 'cancelled'
};

const notificationStatuses = {
  PENDING: 'pending',
  COMPLETE: 'complete',
  FAILED: 'failed'
};

const identifySwapForHash = (notifArray, val) => {
  return notifArray.findIndex(entry => {
    console.log('entry.body.providerAddress', entry.body.providerAddress); // todo remove dev item
    console.log('val[1].to', val[1].to); // todo remove dev item
    if (entry.body.providerAddress) {
      return (
        entry.type === 'swap' &&
        entry.body.providerAddress.toLowerCase() === val[1].to.toLowerCase() &&
        !entry.body.hasTransaction
      );
    }
    return false;
  });

  // if (idx >= 0) {
  //   notifArray[idx].body.hasTransaction = true;
  //   notifArray[idx].hash = val[2]
  // }
};

const transactionHash = (notifArray, val, network) => {
  notifArray.push({
    title: 'Transaction',
    read: false,
    timestamp: Date.now(),
    type: notificationType.TRANSACTION,
    status: notificationStatuses.PENDING,
    hash: val[2],
    network: network,
    body: {
      error: false,
      errorMessage: '',
      hash: val[2],
      to: val[1].to,
      amount: new BigNumber(val[1].value).toString(),
      nonce: new BigNumber(val[1].nonce).toString(),
      gasPrice: new BigNumber(val[1].gasPrice).toString(),
      gasLimit: new BigNumber(val[1].gas).toString()
    },
    expanded: false
  });
  return notifArray;
};

const transactionReceipt = (notifArray, val) => {
  const idx = notifArray.findIndex(
    entry => entry.hash === val[2].transactionHash
  );

  notifArray[idx].status = notificationStatuses.COMPLETE;
  notifArray[idx].body.gasUsed = new BigNumber(val[2].gasUsed).toString();
  notifArray[idx].body.blockNumber = new BigNumber(
    val[2].blockNumber
  ).toString();

  return notifArray;
};

const transactionError = (notifArray, val, network) => {
  notifArray.push({
    title: 'Transaction',
    read: false,
    timestamp: Date.now(),
    type: notificationType.ERROR,
    status: notificationStatuses.FAILED,
    hash: val[2],
    network: network,
    body: {
      error: true,
      errorMessage: val[2].hasOwnProperty('message') ? val[2].message : val[2],
      hash: val[2],
      to: val[1].to,
      amount: new BigNumber(val[1].value).toString(),
      nonce: new BigNumber(val[1].nonce).toString(),
      gasPrice: new BigNumber(val[1].gasPrice).toString(),
      gasLimit: new BigNumber(val[1].gas).toString()
    },
    expanded: false
  });

  return notifArray;
};

const swapOrder = (notifArray, val, network) => {
  console.log('swapOrder'); // todo remove dev item
  console.log(val); // todo remove dev item
  notifArray.push({
    title: 'Swap',
    read: false,
    timestamp: Date.now(),
    type: notificationType.SWAP,
    status: notificationStatuses.PENDING,
    swapStatus: swapOnlyStatuses.NEW,
    hasTransaction: true,
    hash: val[3],
    network: network,
    body: {
      error: false,
      errorMessage: '',
      providerAddress: val[2].providerAddress,
      to: val[2].toAddress,
      from: val[2].fromAddress,
      fromValue: val[2].fromValue,
      toValue: val[2].toValue,
      fromCurrency: val[2].fromCurrency,
      toCurrency: val[2].toCurrency,
      orderId: val[2].parsed.orderId,
      statusId: val[2].parsed.statusId,
      timeRemaining: val[2].parsed.validFor,
      validFor: val[2].parsed.validFor,
      createdAt: val[2].parsed.timestamp,
      rate: val[2].rate,
      provider: val[2].provider
    },
    expanded: false
  });

  return notifArray;
};

const swapReceipt = (notifArray, val) => {
  const idx = notifArray.findIndex(
    entry => entry.hash === val[3].transactionHash && entry.type === 'swap'
  );

  notifArray[idx].status = notificationStatuses.COMPLETE;
  if (notifArray[idx].body.provider === 'kybernetwork') {
    notifArray[idx].swapStatus = notificationStatuses.COMPLETE;
  }
  notifArray[idx].body.gasUsed = new BigNumber(val[3].gasUsed).toString();
  notifArray[idx].body.blockNumber = new BigNumber(
    val[3].blockNumber
  ).toString();

  return notifArray;
};

const addUpdateNotification = function(newNotif, val, network) {
  console.log('addUpdateNotification', val, network); // todo remove dev item
  switch (val[0]) {
    case type.TRANSACTION_HASH:
      return transactionHash(newNotif, val, network);
    case type.TRANSACTION_RECEIPT:
      return transactionReceipt(newNotif, val, network);
    case type.TRANSACTION_ERROR:
      return transactionError(newNotif, val, network);
    default:
      break;
  }
};

const addUpdateSwapNotification = function(newNotif, val, network) {
  console.log('addUpdateSwapNotification', val); // todo remove dev item
  switch (val[0]) {
    case type.SWAP_HASH:
      return swapOrder(newNotif, val, network);
    case type.SWAP_RECEIPT:
      console.log(val); // todo remove dev item
      return swapReceipt(newNotif, val, network);
    case type.SWAP_ERROR:
      return transactionError(newNotif, val, network);
    // case type.SWAP_ORDER:
    //   return swapOrder(newNotif, val, network);
    default:
      break;
  }
};

export {
  swapOnlyStatuses,
  notificationStatuses,
  addUpdateNotification,
  addUpdateSwapNotification
};
