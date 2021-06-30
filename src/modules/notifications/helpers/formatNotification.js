import timeAgo from '@/core/helpers/timeAgo';
import { fromWei, toBN } from 'web3-utils';
import {
  formatFloatingPointValue,
  formatIntegerToString
} from '@/core/helpers/numberFormatHelper';
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
      value: `${formatIntegerToString(fromWei(obj.gasPrice, 'gwei'))} Gwei`,
      string: 'Gas Price'
    },
    gasLimit: {
      value: formatIntegerToString(toBN(obj.gas).toString()),
      string: 'Gas Limit'
    },
    total: {
      value: `${
        formatFloatingPointValue(fromWei(obj.transactionFee, 'ether')).value
      } ${network.type.currencyName}`,
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
      value: `${formatFloatingPointValue(fromWei(obj.value, 'ether')).value} ${
        network.type.currencyName
      }`,
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
  if (newObj.toObj && newObj.toObj.amount) {
    newObj.toObj.amount = formatFloatingPointValue(newObj.toObj.amount).value;
  }
  if (newObj.fromObj && newObj.fromObj.amount) {
    newObj.fromObj.amount = formatFloatingPointValue(
      newObj.fromObj.amount
    ).value;
  }
  obj.notification = newObj;
  return obj;
};
export default formatNotification;
