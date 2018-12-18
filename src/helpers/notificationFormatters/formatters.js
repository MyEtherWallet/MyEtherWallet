import {
  type,
  notificationStatuses,
  notificationType,
  swapOnlyStatuses
} from './config';
import BigNumber from 'bignumber.js';

const formatHash = (val, network) => {
  return {
    title: 'Transaction',
    read: false,
    timestamp: Date.now(),
    type: notificationType.TRANSACTION,
    status: val[2] ? notificationStatuses.PENDING : notificationStatuses.FAILED,
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
  };
};

const formatSwap = (val, network) => {
  const isEthereum = val[0] !== type.SWAP_ORDER;
  const initialState = isEthereum
    ? swapOnlyStatuses.SENT
    : swapOnlyStatuses.NEW;

  return {
    title: 'Swap',
    read: false,
    timestamp: Date.now(),
    type: notificationType.SWAP,
    status:
      val[3] && isEthereum
        ? notificationStatuses.PENDING
        : notificationStatuses.FAILED,
    swapStatus:
      val[3] && isEthereum ? initialState : notificationStatuses.FAILED,
    hasTransaction: isEthereum && val[3],
    hash: isEthereum ? undefined : val[3],
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
      provider: val[2].provider,
      isDex: val[2].isDex
    },
    expanded: false
  };
};

const formatError = (val, network) => {
  return {
    title: 'Transaction',
    read: false,
    timestamp: new Date(),
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
  };
};

export { formatHash, formatError, formatSwap };
