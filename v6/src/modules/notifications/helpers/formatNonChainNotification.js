import timeAgo from '@/core/helpers/timeAgo';
import { toBN } from 'web3-utils';
/**
 * Formatted notification for mew-notification component
 */
const formatNotification = obj => {
  const newObj = {
    to: {
      value: obj.toTxData && obj.toTxData.to ? obj.toTxData.to : obj.to,
      string: 'To'
    },
    from: {
      value: obj.from,
      string: 'From'
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
