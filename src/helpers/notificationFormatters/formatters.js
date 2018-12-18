import {
  type,
  notificationStatuses,
  notificationType,
  swapOnlyStatuses,
  swapIndexes,
  txIndexes
} from './config';
import BigNumber from 'bignumber.js';

const formatHash = (val, network) => {
  console.log(val); // todo remove dev item
  return {
    title: 'Transaction',
    read: false,
    timestamp: Date.now(),
    type: notificationType.TRANSACTION,
    status: val[txIndexes.response]
      ? notificationStatuses.PENDING
      : notificationStatuses.FAILED,
    hash: val[txIndexes.response],
    network: network,
    body: {
      error: false,
      errorMessage: '',
      hash: val[txIndexes.response],
      to: val[txIndexes.details].to,
      amount: new BigNumber(val[txIndexes.details].value).toString(),
      nonce: new BigNumber(val[txIndexes.details].nonce).toString(),
      gasPrice: new BigNumber(val[txIndexes.details].gasPrice).toString(),
      gasLimit: new BigNumber(val[txIndexes.details].gas).toString()
    },
    expanded: false
  };
};

const formatSwap = (val, network) => {
  const isEthereum = val[swapIndexes.label] !== type.SWAP_ORDER;
  const initialState = isEthereum
    ? swapOnlyStatuses.SENT
    : swapOnlyStatuses.NEW;

  return {
    title: 'Swap',
    read: false,
    timestamp: Date.now(),
    type: notificationType.SWAP,
    status:
      val[swapIndexes.response] && isEthereum
        ? notificationStatuses.PENDING
        : notificationStatuses.FAILED,
    swapStatus:
      val[swapIndexes.response] && isEthereum
        ? initialState
        : notificationStatuses.FAILED,
    hasTransaction: isEthereum && val[swapIndexes.response],
    hash: isEthereum ? val[swapIndexes.response] : undefined,
    network: network,
    body: {
      error: false,
      errorMessage: '',
      providerAddress: val[swapIndexes.details].providerAddress,
      to: val[swapIndexes.details].toAddress,
      from: val[swapIndexes.details].fromAddress,
      fromValue: val[swapIndexes.details].fromValue,
      toValue: val[swapIndexes.details].toValue,
      fromCurrency: val[swapIndexes.details].fromCurrency,
      toCurrency: val[swapIndexes.details].toCurrency,
      orderId: val[swapIndexes.details].parsed.orderId,
      statusId: val[swapIndexes.details].parsed.statusId,
      timeRemaining: val[swapIndexes.details].parsed.validFor,
      validFor: val[swapIndexes.details].parsed.validFor,
      createdAt: val[swapIndexes.details].parsed.timestamp,
      rate: val[swapIndexes.details].rate,
      provider: val[swapIndexes.details].provider,
      isDex: val[swapIndexes.details].isDex
    },
    expanded: false
  };
};

const formatSwapError = (val, network) => {
  return {
    title: 'Swap',
    read: false,
    timestamp: Date.now(),
    type: notificationType.SWAP,
    status: notificationStatuses.FAILED,
    swapStatus: swapOnlyStatuses.FAILED,
    hasTransaction: true,
    hash: undefined,
    network: network,
    body: {
      error: true,
      errorMessage: val[swapIndexes.response].hasOwnProperty('message')
        ? val[swapIndexes.response].message
        : val[swapIndexes.response],
      hash: undefined,
      to: val[swapIndexes.details].to,
      amount: new BigNumber(val[swapIndexes.details].value).toString(),
      nonce: new BigNumber(val[swapIndexes.details].nonce).toString(),
      gasPrice: new BigNumber(val[swapIndexes.details].gasPrice).toString(),
      gasLimit: new BigNumber(val[swapIndexes.details].gas).toString()
    },
    expanded: false
  };
};

const formatError = (val, network) => {
  return {
    title: 'Transaction',
    read: false,
    timestamp: Date.now(),
    type: notificationType.ERROR,
    status: notificationStatuses.FAILED,
    hash: val[txIndexes.details].hasOwnProperty('hash')
      ? val[txIndexes.details].hash
      : undefined,
    network: network,
    body: {
      error: true,
      errorMessage: val[txIndexes.response].hasOwnProperty('message')
        ? val[txIndexes.response].message
        : val[txIndexes.response],
      hash: val[txIndexes.details].hasOwnProperty('hash')
        ? val[txIndexes.details].hash
        : undefined,
      to: val[txIndexes.details].to,
      amount: new BigNumber(val[txIndexes.details].value).toString(),
      nonce: new BigNumber(val[txIndexes.details].nonce).toString(),
      gasPrice: new BigNumber(val[txIndexes.details].gasPrice).toString(),
      gasLimit: new BigNumber(val[txIndexes.details].gas).toString()
    },
    expanded: false
  };
};

export { formatHash, formatError, formatSwap, formatSwapError };
