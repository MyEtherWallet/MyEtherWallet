import EthCalls from '../web3Calls';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { toPayload } from '../jsonrpc';
import EventNames from '../events';
import { getSanitizedTx } from './utils';
import { toWei } from 'web3-utils';
import { EventBus } from '@/core/plugins/eventBus';

export default async ({ payload, store, requestManager }, res, next) => {
  if (payload.method !== 'eth_signTransaction') return next();
  const tx = payload.params[0];
  const localTx = Object.assign({}, payload);
  delete localTx['gas'];
  delete localTx['nonce'];
  const ethCalls = new EthCalls(requestManager);
  tx.nonce = !tx.nonce
    ? await store.state.wallet.web3.eth.getTransactionCount(
        store.state.wallet.instance.getAddressString()
      )
    : tx.nonce;
  tx.gas = !tx.gas ? await ethCalls.estimateGas(localTx) : tx.gas;
  tx.chainId = !tx.chainId
    ? store.getters['global/network'].type.chainID
    : tx.chainId;
  tx.gasPrice = !tx.gasPrice
    ? toWei(store.getters['global/gasPrice'], 'gwei').toString()
    : tx.gasPrice;
  getSanitizedTx(tx)
    .then(_tx => {
      if (
        store.state.wallet.identifier === WALLET_TYPES.WEB3_WALLET ||
        store.state.wallet.identifier === WALLET_TYPES.WALLET_CONNECT
      ) {
        res(new Error('web3 wallets doesnt support eth_signTransaction'));
      } else {
        if (_tx.hasOwnProperty('generateOnly')) {
          EventBus.$emit(EventNames.SHOW_TX_CONFIRM_MODAL, _tx, _response => {
            res(null, toPayload(payload.id, _response));
          });
        } else {
          EventBus.$emit(EventNames.SHOW_TX_CONFIRM_MODAL, _tx, _response => {
            res(null, _response);
          });
        }
      }
    })
    .catch(e => {
      res(e);
    });
};
