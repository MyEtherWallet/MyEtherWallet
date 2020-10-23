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
import sanitizeHex from '@/helpers/sanitizeHex';

import { EventBus } from '@/plugins/eventBus';

const setEvents = (promiObj, tx, dispatch) => {
  promiObj
    .once('transactionHash', hash => {
      dispatch('wallet/addNotification', ['Hash', tx.from, tx, hash], {
        root: true
      });
    })
    .once('receipt', res => {
      dispatch('wallet/addNotification', ['Receipt', tx.from, tx, res], {
        root: true
      });
    })
    .on('error', err => {
      dispatch('wallet/addNotification', ['Error', tx.from, tx, err], {
        root: true
      });
    });
};
export default async ({ payload, store, requestManager }, res, next) => {
  if (payload.method !== 'eth_sendTransaction') return next();
  const tx = Object.assign({}, payload.params[0]);
  tx.gasPrice = BigNumber(store.state.gasPrice).toFixed();
  const localTx = Object.assign({}, tx);
  delete localTx['gas'];
  delete localTx['nonce'];
  const ethCalls = new EthCalls(requestManager);
  try {
    tx.nonce = !tx.nonce
      ? await store.state.web3.eth.getTransactionCount(
          store.state.instance.getAddressString()
        )
      : tx.nonce;
    tx.gas = !tx.gas ? await ethCalls.estimateGas(localTx) : tx.gas;
  } catch (e) {
    res(e);
    return;
  }
  tx.chainId = !tx.chainId ? store.state.network.type.chainID : tx.chainId;
  getSanitizedTx(tx)
    .then(_tx => {
      if (
        store.state.identifier === WEB3_WALLET ||
        store.state.identifier === WALLET_CONNECT
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
          const _promiObj = store.state.web3.eth.sendSignedTransaction(
            _response.rawTransaction
          );

          _promiObj
            .once('transactionHash', hash => {
              if (store.state.instance !== null) {
                const localStoredObj = locStore.get(
                  utils.sha3(store.state.instance.getChecksumAddressString())
                );
                locStore.set(
                  utils.sha3(store.state.instance.getChecksumAddressString()),
                  {
                    nonce: sanitizeHex(
                      BigNumber(localStoredObj.nonce).plus(1).toString(16)
                    ),
                    timestamp: localStoredObj.timestamp
                  }
                );
              }
              console.log('gets here???');
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
