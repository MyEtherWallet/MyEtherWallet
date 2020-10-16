import unit from 'ethjs-unit';
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

const setEvents = (promiObj, tx, dispatch) => {
  promiObj
    .once('transactionHash', hash => {
      dispatch('wallet/addNotification', ['Hash', tx.from, tx, hash]);
    })
    .once('receipt', res => {
      dispatch('wallet/addNotification', ['Receipt', tx.from, tx, res]);
    })
    .on('error', err => {
      dispatch('wallet/addNotification', ['Error', tx.from, tx, err]);
    });
};
export default async (
  { payload, store, requestManager, eventHub },
  res,
  next
) => {
  if (payload.method !== 'eth_sendTransaction') return next();
  console.log('got here?? 1');
  const tx = Object.assign({}, payload.params[0]);
  console.log('got here?? 2');
  tx.gasPrice = unit.toWei(store.state.gasPrice, 'gwei').toString();
  console.log('got here?? 3');
  const localTx = Object.assign({}, tx);
  console.log('got here?? 4');
  delete localTx['gas'];
  console.log('got here?? 5');
  delete localTx['nonce'];
  console.log('got here?? 6');
  const ethCalls = new EthCalls(requestManager);
  console.log('got here?? 7');
  try {
    console.log('got here?? 8');
    tx.nonce = !tx.nonce
      ? await store.state.web3.eth.getTransactionCount(
          store.state.instance.getAddressString()
        )
      : tx.nonce;
    console.log('got here?? 9');
    tx.gas = !tx.gas ? await ethCalls.estimateGas(localTx) : tx.gas;
    console.log('got here?? 10');
  } catch (e) {
    console.log('got here??', e);
    res(e);
    return;
  }
  console.log('got here??', 11);
  tx.chainId = !tx.chainId ? store.state.network.type.chainID : tx.chainId;
  getSanitizedTx(tx)
    .then(_tx => {
      if (
        store.state.identifier === WEB3_WALLET ||
        store.state.identifier === WALLET_CONNECT
      ) {
        eventHub.$emit(EventNames.SHOW_WEB3_CONFIRM_MODAL, _tx, _promiObj => {
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
        eventHub.$emit(EventNames.SHOW_TX_CONFIRM_MODAL, _tx, _response => {
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
                      new BigNumber(localStoredObj.nonce).plus(1).toString(16)
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
