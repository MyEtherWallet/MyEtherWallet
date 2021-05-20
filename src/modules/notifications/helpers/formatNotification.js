import timeAgo from '@/core/helpers/timeAgo';
import { toBN } from 'web3-utils';
const formatNotification = (obj, network) => {
  const newObj = {
    txHash: {
      value: obj.hash,
      string: 'Transaction Hash',
      link: `${network.type.blockExplorerTX.replace('[[txHash]]', obj.hash)}`
    },
    gasPrice: {
      value: `${obj.gasPrice ? obj.gasPrice : 0} Gwei`,
      string: 'Gas Price'
    },
    gasLimit: {
      value: obj.gasLimit ? obj.gasLimit : obj.gas ? obj.gas : '0x',
      string: 'Gas Limit'
    },
    total: {
      value: `${obj.transactionFee} ${network.type.currencyName}`,
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
      value: `${obj.value} ${network.type.currencyName}`,
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
