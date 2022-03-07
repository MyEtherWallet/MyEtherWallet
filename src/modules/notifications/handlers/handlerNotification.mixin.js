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
import { errorMsgs } from '@/apollo/configs/configErrorMsgs';

/**
 * Constants
 */
const MAX_ITEMS = 15;

export default {
  name: 'HandlerNotification',
  data() {
    return {
      getEthTransfersV2: '',
      getTransactionsByHashes: '',
      newPendingTransaction: '',
      getTransactionByHash: '',
      subscribeToTxHash: '',
      txHash: '',
      initialLoad: true,
      txHashes: [],
      ethTransfersIncoming: []
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
        return (
          !this.isEthNetwork || this.address === null || this.address === ''
        );
      },
      result({ data }) {
        if (data && data.getEthTransfersV2.transfers) {
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
      fetchPolicy: 'cache-and-networ`k`',
      skip() {
        return !this.isEthNetwork || this.txHashes.length === 0;
      },
      result({ data }) {
        if (data && data.getTransactionsByHashes) {
          this.ethTransfersIncoming = data.getTransactionsByHashes;
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
      skip() {
        return (
          !this.isEthNetwork ||
          !this.txHash ||
          this.txHash === '' ||
          this.txHash === null
        );
      },
      update: data => data.getTransactionByHash,
      result({ data }) {
        if (data) {
          const getTransactionByHash = data.getTransactionByHash;
          if (getTransactionByHash.to === this.address) {
            const copyArray = this.ethTransfersIncoming;
            const foundIdx = copyArray.findIndex(item => {
              if (getTransactionByHash.hash === item.hash) {
                return item;
              }
            });
            foundIdx >= 0
              ? copyArray.splice(foundIdx, 1, getTransactionByHash)
              : copyArray.unshift(getTransactionByHash);
            this.ethTransfersIncoming = copyArray;
          }
        }
      },
      error(error) {
        if (error.message.includes(errorMsgs.cannotReturnNull)) {
          return;
        }
        Toast(error.message, {}, ERROR);
      }
    },
    $subscribe: {
      /**
       * Apollo subscription for pending txs
       */
      newPendingTransaction: {
        query: pendingTransaction,
        variables() {
          return {
            owner: this.address
          };
        },
        skip() {
          return (
            !this.isEthNetwork ||
            this.address === '' ||
            this.address === null ||
            this.loading
          );
        },
        result({ data }) {
          if (data && data.pendingTransaction) {
            const pendingTx = data.pendingTransaction;
            if (pendingTx.to?.toLowerCase() === this.address) {
              this.txHash = pendingTx.transactionHash;
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
        skip() {
          return (
            !this.isEthNetwork ||
            !this.txHash ||
            this.txHash === '' ||
            this.txHash === null
          );
        },
        result() {
          this.$apollo.queries.getTransactionByHash?.refetch();
        },
        error(error) {
          Toast(error.message, {}, ERROR);
        }
      }
    }
  }
};
