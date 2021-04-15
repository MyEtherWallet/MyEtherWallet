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

/**
 * Max notification items
 */
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
        return !this.isEthNetwork || !this.address || this.address === null;
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
          this.setFetchedTime();
          this.incomingTxs = incomingTxs;
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
        const foundIdx = copyArray.findIndex(item => {
          if (getTransactionByHash.transactionHash === item.transactionHash) {
            return item;
          }
        });
        foundIdx
          ? copyArray.splice(foundIdx, 0, getTransactionByHash)
          : copyArray.push(getTransactionByHash);
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
        skip() {
          return !this.address || this.address === null;
        },
        result(data) {
          if (data.data.pendingTransaction) {
            const pendingTx = data.data.pendingTransaction;
            if (pendingTx.to?.toLowerCase() === this.address?.toLowerCase()) {
              pendingTx['date'] = pendingTx.timestamp * 1000;
              delete pendingTx.__typename;
              delete pendingTx.timestamp;
              this.incomingTxs.push(pendingTx);
              this.txHash = pendingTx.transactionHash;
              console.error('txHash', pendingTx, this.txHash);
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
  }
};
