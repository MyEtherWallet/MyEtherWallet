import { notificationType, swapIndexes, txIndexes } from './config';

const extractHashToCompare = (index, val) => {
  if (val[index].details) {
    return val[index].details.transactionHash;
  }
  return val[index].transactionHash;
};

const getSwapEntryIndex = (entry, val) => {
  try {
    if (entry.body.providerAddress) {
      const hashToCompare = extractHashToCompare(swapIndexes.response, val);
      return (
        entry.hash === hashToCompare &&
        entry.type === notificationType.SWAP &&
        entry.body.providerAddress.toLowerCase() ===
          val[swapIndexes.txDetails].to.toLowerCase()
      );
    }
    return false;
  } catch (e) {
    return false;
  }
};

const getSwapEntryIndexForTxReceipt = (entry, val) => {
  try {
    if (entry.body.providerAddress) {
      const hashToCompare = extractHashToCompare(txIndexes.response, val);
      return (
        entry.hash === hashToCompare &&
        entry.type === notificationType.SWAP &&
        entry.body.providerAddress.toLowerCase() ===
          val[txIndexes.txDetails].to.toLowerCase()
      );
    }
    return false;
  } catch (e) {
    return false;
  }
};

const getNotificationIndex = (entry, val) => {
  const hashToCompare = extractHashToCompare(txIndexes.response, val);
  return entry.hash === hashToCompare && entry.type !== notificationType.SWAP;
};

const mapToObject = map => {
  const obj = {};
  for (const prop of map) {
    obj[prop[0]] = prop[1];
  }
  return obj;
};

const extractEvmErrorData = errObj => {
  try {
    if (errObj.hasOwnProperty('message')) {
      if (/Transaction has been reverted by the EVM:/.test(errObj.message)) {
        let stripText = errObj.message.replace(
          'Transaction has been reverted by the EVM:',
          ''
        );
        stripText = stripText.replace('{', '').replace('}', '');
        const entryPairs = stripText.split(',');
        const betterEntries = entryPairs.map(entry => {
          const cleanEntry = entry
            .replace(/\s+/g, '')
            .replace(/"/g, '')
            .replace(/"/g, '')
            .replace(/^\s+/, '')
            .replace(/\s+$/, '');
          const entries = cleanEntry.split(':');
          entries[0] = entries[0].replace(/\s+/, '');
          return entries;
        });
        const mappedErrorDetails = mapToObject(new Map(betterEntries));
        return {
          message: 'Transaction has been reverted by the EVM',
          details: mappedErrorDetails,
          stack: errObj.stack
        };
      }
      return errObj;
    }
    return errObj;
  } catch (e) {
    return errObj;
  }
};

export {
  getSwapEntryIndex,
  getSwapEntryIndexForTxReceipt,
  getNotificationIndex,
  extractEvmErrorData
};
