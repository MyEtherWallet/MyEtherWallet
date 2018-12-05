const type = {
  TRANSACTION: 'Transaction',
  TRANSACTION_HASH: 'Hash',
  TRANSACTION_RECEIPT: 'Receipt',
  TRANSACTION_ERROR: 'Error',
  CONTRACT_CALL: '',
  SWAP: 'swap',
  SWAP_ORDER: 'Swap'
};

const notificationType = {
  TRANSACTION: 'Transaction',
  SWAP: 'swap',
  ERROR: 'transactionError'
};

const transactionHash = (notifArray, val) => {
  if (notifArray.length > 1) {
    if (
      notifArray[notifArray.length - 1].type === notificationType.SWAP &&
      val[1].to === notifArray[notifArray.length - 1].to
    ) {
      notifArray[notifArray.length - 1].hash = val[2];
    }
  }
  notifArray.push({
    title: 'Transaction',
    read: false,
    timestamp: new Date(),
    type: notificationType.TRANSACTION,
    status: 'processing',
    hash: val[2],
    body: {
      error: false,
      hash: val[2],
      to: val[1].to,
      amount: val[1].value,
      nonce: val[1].nonce,
      gasPrice: val[1].gasPrice,
      gasLimit: val[1].gas
    },
    expanded: false
  });

  return notifArray;
};

const transactionReceipt = (notifArray, val) => {
  const idx = notifArray.findIndex(
    entry => entry.hash === val[2].transactionHash
  );
  if (idx > 0) {
    if (
      notifArray[idx - 1].type === notificationType.SWAP &&
      val[1].to === notifArray[idx - 1].to
    ) {
      notifArray[idx].status = 'complete';
    }
  }
  notifArray[idx].status = 'complete';
  notifArray[idx].body.gasUsed = val[2].gasUsed;
  notifArray[idx].body.blockNumber = val[2].blockNumber;
  return notifArray;
};

const transactionError = (notifArray, val) => {
  notifArray.push({
    title: 'transaction',
    read: false,
    timestamp: new Date(),
    type: notificationType.ERROR,
    status: 'failed',
    hash: val[2],
    body: {
      error: true,
      errorMessage: val[2].hasOwnProperty('message') ? val[2].message : val[2]
    },
    expanded: false
  });

  return notifArray;
};

const swapOrder = (notifArray, val) => {
  notifArray.push({
    title: 'swap',
    read: false,
    timestamp: new Date(),
    type: notificationType.SWAP,
    status: 'processing',
    hasTransaction: false,
    body: {
      to: val[2].toAddress,
      fromValue: val[2].fromValue,
      toValue: val[2].toValue,
      fromCurrency: val[2].providerDetails.fromCurrency,
      toCurrency: val[2].providerDetails.toCurrency,
      // nonce: val[2].nonce,
      // gasPrice: val[2].gasPrice,
      // gasLimit: val[2].gas,
      rate: val[2].rate,
      provider: val[2].providerDetails.provider
    },
    // body: val[2].hasOwnProperty('message') ? val[2].message : val[2],
    expanded: false
  });

  return notifArray;
};

const addUpdateNotification = function(newNotif, val) {
  switch (val[0]) {
    case type.TRANSACTION_HASH:
      return transactionHash(newNotif, val);
    case type.TRANSACTION_RECEIPT:
      return transactionReceipt(newNotif, val);
    case type.TRANSACTION_ERROR:
      return transactionError(newNotif, val);
    case type.SWAP_ORDER:
      return swapOrder(newNotif, val);
    default:
      break;
  }
};

export { addUpdateNotification };
