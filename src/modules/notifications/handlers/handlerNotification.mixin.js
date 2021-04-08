import BigNumber from 'bignumber.js';
import { hexToNumber, fromWei } from 'web3-utils';
import {
  getEthTransfersV2,
  getTransactionDetails,
  pendingTransaction,
  transactionEvent
} from '@/apollo/queries/notifications/notification.graphql';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

export default {
  name: 'HandlerNotification',
  data() {
    return {
      getEthTransfersV2: '',
      getTransactionByHash: '',
      subscribeToPending: '',
      txHash: ''
    };
  },
  apollo: {
    /**
     * Apollo query to get all eth transfers by owner
     */
    getEthTransfersV2: {
      query: getEthTransfersV2,
      variables() {
        return {
          owner: this.address
        };
      },
      result({ data }) {
        if (data.getEthTransfersV2.transfers) {
          const transfers = data.getEthTransfersV2.transfers;
          transfers.forEach(transfer => {
            console.error('transfer', transfer);
            this.txHash = transfer.transfer.transactionHash;
          });
        }
      },
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    },
    /**
     * Apollo query to fetch transaction details by hash
     */
    getTransactionByHash: {
      query: getTransactionDetails,
      variables() {
        return {
          hash: this.txHash
        };
      },
      skip() {
        return !this.txHash || this.txHash === '';
      },
      result({ data }) {
        data.transactionHash = this.txHash;
        this._parser(data);
        console.error('getTransactionDetails', data);
      },
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    },
    $subscribe: {
      /**
       * Apollo subscription for pending txs
       */
      subscribeToPending: {
        query: pendingTransaction,
        variables() {
          return {
            owner: this.address
          };
        },
        result(data) {
          console.error('subscribe pending', data);
        },
        error(error) {
          Toast(error.message, {}, ERROR);
        }
      },
      /**
       * Apollo subscription for transactions
       */
      subscribeToTxHash: {
        query: transactionEvent,
        variables() {
          return {
            hash: this.txHash
          };
        },
        result(data) {
          console.error('subscribe tx', data);
        },
        error(error) {
          Toast(error.message, {}, ERROR);
        }
      }
    }
  },
  methods: {
    /**
     * Parses tx details
     */
    _parser(hashObj, txArrObj) {
      const newObj = Object.assign({}, txArrObj);
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
};
