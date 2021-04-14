/**
 * Module Notification Apollo Mixin
 */
import {
  getEthTransfersV2,
  getTransactionsByHashes,
  getTransactionByHash,
  pendingTransaction,
  transactionEvent
} from '@/apollo/queries/notifications/notification.graphql';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import BigNumber from 'bignumber.js';
import { hexToNumber, fromWei } from 'web3-utils';

const MAX_ITEMS = 20;

export default {
  name: 'HandlerNotification',
  data() {
    return {
      getEthTransfersV2: '',
      getTransactionsByHashes: '',
      pendingTransaction: '',
      txHash: '',
      initialLoad: true,
      txHashes: [],
      incomingTxs: []
    };
  },
  apollo: {
    /**
     * Apollo query to get the last 20 eth transfers by owner
     */
    getEthTransfersV2: {
      query: getEthTransfersV2,
      variables() {
        return {
          owner: this.address,
          limit: MAX_ITEMS
        };
      },
      skip() {
        return !this.isEthNetwork;
      },
      result({ data }) {
        if (data.getEthTransfersV2.transfers) {
          data.getEthTransfersV2.transfers.forEach(transfer => {
            const hash = transfer.transfer.transactionHash;
            !this.txHashes.includes(hash) ? this.txHashes.push(hash) : null;
          });
        }
      },
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    },
    /**
     * Apollo query to fetch transaction details by hashes
     * Only returns 10 at a time
     */
    getTransactionsByHashes: {
      query: getTransactionsByHashes,
      variables() {
        return {
          hashes: this.txHashes
        };
      },
      fetchPolicy: 'cache-and-network',
      skip() {
        return this.txHashes.length === 0;
      },
      result({ data }) {
        if (data && data.getTransactionsByHashes) {
          let incomingTxs = [];
          if (this.initialLoad) {
            incomingTxs = data.getTransactionsByHashes;
            this.txHashes =
              this.txHashes.length > 10 ? this.txHashes.slice(10, 20) : [];
            this.initialLoad = false;
          } else {
            incomingTxs = this.incomingTxs.concat(data.getTransactionsByHashes);
            this.txHashes = [];
          }
          this.incomingTxs = this._parseTxs(incomingTxs);
          console.error('incomingTxs', this.incomingTxs);
        }
      },
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    },
    /**
     * Apollo query to fetch transaction details by hash
     * Only fetches one at a time
     */
    getTransactionByHash: {
      query: getTransactionByHash,
      variables() {
        return {
          hash: this.txHash
        };
      },
      fetchPolicy: 'cache-and-network',
      skip() {
        return !this.txHash || this.txHash === '';
      },
      result({ data }) {
        const copyArray = this.incomingTxs;
        const getTransactionByHash = data.data.getTransactionByHash;
        const notification = new Notification(getTransactionByHash);
        const foundIdx = copyArray.findIndex(item => {
          if (getTransactionByHash.transactionHash === item.transactionHash) {
            return item;
          }
        });

        if (foundIdx) {
          copyArray.splice(foundIdx, 0, notification);
        } else {
          copyArray.push(notification);
        }
        this.incomingTxs = copyArray;
      },
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    },
    $subscribe: {
      /**
       * Apollo subscription for pending txs
       */
      pendingTransaction: {
        query: pendingTransaction,
        variables() {
          return {
            owner: this.address
          };
        },
        result(data) {
          if (data.data.pendingTransaction) {
            const pendingTx = data.data.pendingTransaction;
            if (pendingTx.to?.toLowerCase() === this.address?.toLowerCase()) {
              pendingTx['date'] = pendingTx.timestamp * 1000;
              delete pendingTx.__typename;
              delete pendingTx.timestamp;
              const newNotification = new Notification(pendingTx);
              this.incomingTxs.push(newNotification);
              this.txHash = pendingTx.transactionHash;
              console.error('new notification', newNotification);
              console.error('txHash', this.txHash);
            }
          }
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
     * Get Transaction Fee
     */
    _getTxFee(value, gasPrice, gasUsed) {
      const gasFee = BigNumber(gasPrice).times(gasUsed).toString();
      const total = BigNumber(value).plus(gasFee).toString();
      return fromWei(total);
    },
    /**
     * Parse tx object from apollo
     */
    _parseTxs(obj) {
      return obj.map(tx => {
        const newObj = Object.assign({}, tx);
        newObj['gasLimit'] = newObj.gas;

        newObj['data'] = newObj.input;
        newObj['transactionFee'] = this._getTxFee(
          newObj.value,
          newObj.gasPrice,
          newObj.gasUsed
        );
        newObj['status'] = hexToNumber(newObj.status) ? 'SUCCESS' : 'ERROR';
        newObj['type'] = 'IN';
        newObj['value'] = fromWei(newObj.value);
        newObj['date'] = new BigNumber(newObj.timestamp).times(1000);
        delete newObj.input;
        delete newObj.__typename;
        delete newObj.gasUsed;
        delete newObj.timestamp;
        return newObj;
      });
    }
  }
};
