import utils from 'web3-utils';
import EthCalls from '../web3Calls';
import { WALLET_TYPES } from '@/modules/access-wallet/hardware/handlers/configs/configWalletTypes';
import EventNames from '../events';
import { toPayload } from '../jsonrpc';
import * as locStore from 'store';
import { getSanitizedTx, setEvents } from './utils';
import BigNumber from 'bignumber.js';
import sanitizeHex from '@/core/helpers/sanitizeHex';

import { EventBus } from '@/core/plugins/eventBus';

export default async ({ payload, store, requestManager }, res, next) => {
  if (payload.method !== 'eth_sendTransaction') return next();
  const tx = Object.assign({}, payload.params[0]);
  let confirmInfo;
  if (tx.hasOwnProperty('confirmInfo')) {
    confirmInfo = tx['confirmInfo'];
    delete tx['confirmInfo'];
  }
  tx.gasPrice = tx.gasPrice
    ? tx.gasPrice
    : BigNumber(store.getters['global/gasPrice']).toFixed();
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
        store.state.wallet.identifier === WALLET_TYPES.WEB3_WALLET ||
        store.state.wallet.identifier === WALLET_TYPES.WALLET_CONNECT
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
        /**
         * confirmInfo is @Boolean
         * Checks whether confirmInfo is true
         * if true, assume transaction is a swap
         */
        if (confirmInfo) {
          EventBus.$emit(
            EventNames.SHOW_SWAP_TX_MODAL,
            [_tx, confirmInfo],
            _response => {
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
            }
          );
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
      }
    })
    .catch(e => {
      res(e);
    });
};
