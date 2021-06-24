import timeAgo from '@/core/helpers/timeAgo';
import { fromWei, toBN } from 'web3-utils';
/**
 * Formatted notification for mew-notification component
 */
const formatNotification = (obj, network) => {
  const newObj = {
    txHash: {
      value: obj.hash,
      string: 'Transaction Hash',
      link: `${network.type.blockExplorerTX.replace('[[txHash]]', obj.hash)}`
    },
    gasPrice: {
      value: `${fromWei(obj.gasPrice, 'gwei')} Gwei`,
      string: 'Gas Price'
    },
    gasLimit: {
      value: toBN(obj.gas).toString(),
      string: 'Gas Limit'
    },
    total: {
      value: `${fromWei(obj.transactionFee, 'ether')} ${
        network.type.currencyName
      }`,
      string: 'Total Transaction fee'
    },
    to: {
      value: obj.toTxData && obj.toTxData.to ? obj.toTxData.to : obj.to,
      string: 'To'
    },
    from: {
      value: obj.from,
      string: 'From'
    },
    amount: {
      value: `${fromWei(obj.value, 'ether')} ${network.type.currencyName}`,
      string: 'Amount'
    },
    timestamp: {
      value: timeAgo(toBN(obj.date).toNumber()),
      string: 'Time'
    },
    status: {
      value: obj.status?.toLowerCase(),
      string: 'Status'
    },
    type: {
      value: obj.type?.toLowerCase(),
      string: obj.type
    },
    read: obj.read,
    toObj: obj.toTxData,
    fromObj: obj.fromTxData
  };
  obj.notification = newObj;
  return obj;
};
export default formatNotification;
