import utils from 'web3-utils';
import EthCalls from '../web3Calls';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import EventNames from '../events';
import { toPayload } from '../jsonrpc';
import * as locStore from 'store';
import { getSanitizedTx, setEvents } from './utils';
import BigNumber from 'bignumber.js';
import sanitizeHex from '@/core/helpers/sanitizeHex';

import { EventBus } from '@/core/plugins/eventBus';

export default async ({ payload, store, requestManager }, res, next) => {
  if (payload.method !== 'eth_sendTransaction') return next();
  console.log('eth_sendTransaction', payload);
  const tx = Object.assign({}, payload.params[0]);
  let confirmInfo;
  let currency;
  let toDetails;
  console.log('eth_sendTransaction', 1);
  if (tx.hasOwnProperty('confirmInfo')) {
    confirmInfo = tx['confirmInfo'];
    delete tx['confirmInfo'];
  }
  console.log('eth_sendTransaction', 2);
  if (tx.hasOwnProperty('currency')) {
    currency = tx['currency'];
    delete tx['currency'];
  }
  console.log('eth_sendTransaction', 3);
  if (tx.hasOwnProperty('toDetails')) {
    toDetails = tx['toDetails'];
    delete tx['toDetails'];
  }
  tx.gasPrice = tx.gasPrice
    ? tx.gasPrice
    : BigNumber(store.getters['global/gasPrice']).toFixed();
  console.log('eth_sendTransaction', 4);
  const localTx = Object.assign({}, tx);
  delete localTx['gas'];
  delete localTx['nonce'];
  const ethCalls = new EthCalls(requestManager);
  console.log('eth_sendTransaction', 5);
  try {
    console.log(nonce, store.state.wallet.instance.getAddressString());
    console.log(store.state.wallet.web3.eth.getTransactionCount);
    const nonce = await store.state.wallet.web3.eth.getTransactionCount(
      store.state.wallet.instance.getAddressString()
    );
    tx.nonce = !tx.nonce
      ? await store.state.wallet.web3.eth.getTransactionCount(
          store.state.wallet.instance.getAddressString()
        )
      : tx.nonce;
    console.log('eth_sendTransaction', 6);
    tx.gas = !tx.gas ? await ethCalls.estimateGas(localTx) : tx.gas;
    console.log('eth_sendTransaction', 7);
  } catch (e) {
    console.log(e, 'eeeeeeeeeeeeeeeeeeeeeee');
    res(e);
    return;
  }
  tx.chainId = !tx.chainId
    ? store.getters['global/network'].type.chainID
    : tx.chainId;
  console.log('eth_sendTransaction', 8);
  getSanitizedTx(tx)
    .then(_tx => {
      console.log('eth_sendTransaction', 9);
      const event = confirmInfo
        ? EventNames.SHOW_SWAP_TX_MODAL
        : EventNames.SHOW_TX_CONFIRM_MODAL;
      const params = confirmInfo
        ? [_tx, confirmInfo]
        : [_tx, toDetails, currency];
      if (
        store.state.wallet.identifier === WALLET_TYPES.WEB3_WALLET ||
        store.state.wallet.identifier === WALLET_TYPES.WALLET_CONNECT
      ) {
        console.log('eth_sendTransaction', 10);
        EventBus.$emit(event, params, _promiObj => {
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
        /**
         * confirmInfo is @Boolean
         * Checks whether confirmInfo is true
         * if true, assume transaction is a swap
         */
        console.log('eth_sendTransaction', 11);
        console.log(event, params, 'event popup');
        EventBus.$emit(event, params, _response => {
          const _promiObj = store.state.wallet.web3.eth.sendSignedTransaction(
            _response.rawTransaction
          );
          setEvents(_promiObj, _tx, store.dispatch);
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
        });
      }
    })
    .catch(e => {
      res(e);
    });
};
