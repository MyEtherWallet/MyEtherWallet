import BigNumber from 'bignumber.js';
import { hexToNumber, fromWei } from 'web3-utils';

import {
  getEthTransfersV2,
  getTransactionDetails,
  pendingTransaction,
  transactionEvent
} from './notification.graphql';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
export default class NotificationCalls {
  constructor(apollo) {
    this.apollo = apollo;
  }
  getAllTransfer(owner) {
    return new Promise(resolve => {
      this.apollo
        .query({
          query: getEthTransfersV2,
          variables: {
            owner: owner
          }
        })
        .then(response => {
          this.getTxDetails(response.data.getEthTransfersV2.transfers).then(
            res => {
              resolve(
                this._allTransferFormatter(
                  response.data.getEthTransfersV2.transfers,
                  res
                )
              );
            }
          );
        })
        .catch(err => {
          Toast(err.message, {}, ERROR);
        });
    });
  }

  getTxDetails(arr) {
    const promises = [];
    arr.forEach(item => {
      promises.push(
        this.apollo.query({
          query: getTransactionDetails,
          variables: {
            hash: item.transfer.transactionHash
          }
        })
      );
    });
    return Promise.all(promises);
  }

  getTxDetailFromPending(obj) {
    return new Promise(response => {
      this.apollo
        .query({
          query: getTransactionDetails,
          variables: {
            hash: obj.transactionHash
          }
        })
        .then(res => {
          const parsedRes = this._parser(obj, res.data.getTransactionByHash);
          response(parsedRes);
        });
    });
  }

  subscribeToPending(owner, nextHandler) {
    const connector = this.apollo.subscribe({
      query: pendingTransaction,
      variables: {
        owner: owner
      }
    });
    connector.subscribe({
      next: nextHandler,
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    });
  }

  subscribeToTxHash(obj, nextHandler) {
    const connector = this.apollo.subscribe({
      query: transactionEvent,
      variables: {
        hash: obj.transactionHash
      }
    });
    connector.subscribe({
      next: nextHandler,
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    });
  }

  _allTransferFormatter(hashArrObj, txArrObj) {
    const newArr = [];
    for (let i = 0; i < hashArrObj.length; i++) {
      newArr.push(
        this._parser(
          hashArrObj[i].transfer,
          txArrObj[i].data.getTransactionByHash
        )
      );
    }
    return newArr;
  }

  _parser(hashObj, txArrObj) {
    const newObj = Object.assign({}, hashObj, txArrObj);
    const val = BigNumber(newObj.value);
    const gasFee = BigNumber(newObj.gasPrice).times(newObj.gasUsed);
    newObj['gasLimit'] = newObj.gas;
    newObj['data'] = newObj.input;
    newObj['transactionFee'] = fromWei(val.plus(gasFee).toFixed());
    newObj['status'] = hexToNumber(newObj.status) ? 'SUCCESS' : 'ERROR';
    newObj['type'] = 'IN';
    newObj['value'] = fromWei(newObj.value);
    newObj['date'] = BigNumber(newObj.timestamp).times(1000).toFixed();

    delete newObj.input;
    delete newObj.__typename;
    delete newObj.blockHash;
    delete newObj.contractAddress;
    delete newObj.gasUsed;
    delete newObj.timestamp;

    return newObj;
  }
}
