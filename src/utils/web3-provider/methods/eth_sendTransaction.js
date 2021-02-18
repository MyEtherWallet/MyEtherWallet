// import unit from 'ethjs-unit';
import utils from 'web3-utils';
import EthCalls from '../web3Calls';
import {
  WEB3_WALLET,
  WALLET_CONNECT
} from '@/modules/wallets/utils/bip44/walletTypes';
import EventNames from '../events';
import { toPayload } from '../jsonrpc';
import * as locStore from 'store';
import { getSanitizedTx } from './utils';
import BigNumber from 'bignumber.js';
import sanitizeHex from '@/core/helpers/sanitizeHex';

import { EventBus } from '@/core/plugins/eventBus';
import Notification from '@/modules/notifications/handler/NotificationInterface';

const setEvents = (promiObj, tx, dispatch) => {
  // create a no reference copy specifically for notification
  const newTxObj = utils._.clone(tx);
  newTxObj.date = new Date().getTime();
  newTxObj.read = false;
  const isExcempt = newTxObj.handleNotification;
  delete newTxObj['r'];
  delete newTxObj['v'];
  delete newTxObj['s'];
  delete newTxObj['chainId'];

  promiObj
    .once('transactionHash', hash => {
      newTxObj.status = 'PENDING';
      newTxObj.transactionHash = hash;
      if (!isExcempt) {
        const notification = new Notification(newTxObj);
        dispatch('notifications/addNotification', notification, {
          root: true
        });
      }
    })
    .on('receipt', res => {
      newTxObj.transactionHash = res.transactionHash;
      newTxObj.status = 'SUCCESS';
      if (!isExcempt) {
        const notification = new Notification(newTxObj);
        dispatch('notifications/updateNotification', notification, {
          root: true
        });
      }
    })
    .on('error', err => {
      newTxObj.status = 'FAILED';
      newTxObj.errMessage = err.message;
      if (!isExcempt) {
        const notification = new Notification(newTxObj);
        dispatch('notifications/addNotification', notification, {
          root: true
        });
      }
    });
};
export default async ({ payload, store, requestManager }, res, next) => {
  if (payload.method !== 'eth_sendTransaction') return next();
  const tx = Object.assign({}, payload.params[0]);
  tx.gasPrice = BigNumber(store.state.global.gasPrice).toFixed();
  const localTx = Object.assign({}, tx);
  delete localTx['gas'];
  delete localTx['nonce'];
  const ethCalls = new EthCalls(requestManager);
  try {
    tx.nonce = !tx.nonce
      ? await store.state.wallet.web3.eth.getTransactionCount(
          store.state.wallet.instance.getAddressString()
        )
      : tx.nonce;
    tx.gas = !tx.gas ? await ethCalls.estimateGas(localTx) : tx.gas;
  } catch (e) {
    res(e);
    return;
  }
  tx.chainId = !tx.chainId
    ? store.getters['global/network'].type.chainID
    : tx.chainId;

  getSanitizedTx(tx)
    .then(_tx => {
      if (
        store.state.wallet.identifier === WEB3_WALLET ||
        store.state.wallet.identifier === WALLET_CONNECT
      ) {
        EventBus.$emit(EventNames.SHOW_WEB3_CONFIRM_MODAL, _tx, _promiObj => {
          setEvents(_promiObj, _tx, store.dispatch);
          _promiObj
            .once('transactionHash', hash => {
              res(null, toPayload(payload.id, hash));
            })
            .on('error', err => {
              res(err);
            });
        });
      } else {
        EventBus.$emit(EventNames.SHOW_TX_CONFIRM_MODAL, _tx, _response => {
          const _promiObj = store.state.wallet.web3.eth.sendSignedTransaction(
            _response.rawTransaction
          );

          _promiObj
            .once('transactionHash', hash => {
              if (store.state.wallet.instance !== null) {
                const localStoredObj = locStore.get(
                  utils.sha3(
                    store.state.wallet.instance.getChecksumAddressString()
                  )
                );
                locStore.set(
                  utils.sha3(
                    store.state.wallet.instance.getChecksumAddressString()
                  ),
                  {
                    nonce: sanitizeHex(
                      BigNumber(localStoredObj.nonce).plus(1).toString(16)
                    ),
                    timestamp: localStoredObj.timestamp
                  }
                );
              }
              res(null, toPayload(payload.id, hash));
            })
            .on('error', err => {
              res(err);
            });
          setEvents(_promiObj, _tx, store.dispatch);
        });
      }
    })
    .catch(e => {
      res(e);
    });
};
