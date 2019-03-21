import unit from 'ethjs-unit';
import utils from 'web3-utils';
import EthCalls from '../web3Calls';
import { WEB3_WALLET } from '../../bip44/walletTypes';
import EventNames from '../events';
import { toPayload } from './jsonrpc';
import * as locStore from 'store';
import { getSanitizedTx } from './utils';
import BigNumber from 'bignumber.js';
import { Misc } from '@/helpers';

const setEvents = (promiObj, tx, dispatch) => {
  promiObj
    .once('transactionHash', hash => {
      dispatch('addNotification', ['Hash', tx.from, tx, hash]);
    })
    .once('receipt', res => {
      dispatch('addNotification', ['Receipt', tx.from, tx, res]);
    })
    .on('error', err => {
      dispatch('addNotification', ['Error', tx.from, tx, err]);
    });
};
export default async (
  { payload, store, requestManager, eventHub },
  res,
  next
) => {
  if (payload.method !== 'eth_sendTransaction') return next();
  const tx = Object.assign({}, payload.params[0]);
  const localTx = Object.assign({}, tx);
  delete localTx['gas'];
  delete localTx['nonce'];
  const ethCalls = new EthCalls(requestManager);
  try {
    tx.nonce = !tx.nonce
      ? await store.state.web3.eth.getTransactionCount(
          store.state.wallet.getAddressString()
        )
      : tx.nonce;
    tx.gas = !tx.gas ? await ethCalls.estimateGas(localTx) : tx.gas;
  } catch (e) {
    res(e);
    return;
  }
  tx.chainId = !tx.chainId ? store.state.network.type.chainID : tx.chainId;
  tx.gasPrice = !tx.gasPrice
    ? unit.toWei(store.state.gasPrice, 'gwei').toString()
    : tx.gasPrice;
  getSanitizedTx(tx)
    .then(_tx => {
      if (store.state.wallet.identifier === WEB3_WALLET) {
        eventHub.$emit(EventNames.SHOW_WEB3_CONFIRM_MODAL, _tx);
      } else {
        eventHub.$emit(EventNames.SHOW_TX_CONFIRM_MODAL, _tx, _response => {
          const _promiObj = store.state.web3.eth.sendSignedTransaction(
            _response.rawTransaction
          );

          _promiObj
            .once('transactionHash', hash => {
              if (store.state.wallet !== null) {
                const localStoredObj = locStore.get(
                  utils.sha3(store.state.wallet.getChecksumAddressString())
                );
                locStore.set(
                  utils.sha3(store.state.wallet.getChecksumAddressString()),
                  {
                    nonce: Misc.sanitizeHex(
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
