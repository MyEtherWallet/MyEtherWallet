import unit from 'ethjs-unit';
import utils from 'web3-utils';
import EthCalls from '../web3Calls';
import { WEB3_WALLET } from '../../bip44/walletTypes';
import { toPayload } from './jsonrpc';
import EventNames from '../events';
import { formatters } from 'web3-core-helpers';
const getSanitizedTx = tx => {
  return new Promise((resolve, reject) => {
    if (!tx.gas && !tx.gasLimit && !tx.chainId)
      return reject(new Error('"gas" or "chainId" is missing'));
    if (tx.nonce < 0 || tx.gas < 0 || tx.gasPrice < 0 || tx.chainId < 0)
      return reject(
        new Error('Gas, gasPrice, nonce or chainId is lower than 0')
      );

    try {
      tx = formatters.inputCallFormatter(tx);
      const transaction = tx;
      transaction.to = tx.to || '0x';
      transaction.data = tx.data || '0x';
      transaction.value = tx.value || '0x';
      transaction.chainId = utils.numberToHex(tx.chainId);
      resolve(transaction);
    } catch (e) {
      reject(e);
    }
  });
};

export default async (
  { payload, store, requestManager, eventHub },
  res,
  next
) => {
  if (payload.method !== 'eth_signTransaction') return next();
  const tx = payload.params[0];
  const localTx = Object.assign({}, payload);
  delete localTx['gas'];
  delete localTx['nonce'];
  const ethCalls = new EthCalls(requestManager);
  tx.nonce = !tx.nonce
    ? await ethCalls.getTransactionCount(store.state.wallet.getAddressString())
    : tx.nonce;
  tx.gas = !tx.gas ? await ethCalls.estimateGas(localTx) : tx.gas;
  tx.chainId = !tx.chainId ? store.state.network.type.chainID : tx.chainId;
  tx.gasPrice = !tx.gasPrice
    ? unit.toWei(store.state.gasPrice, 'gwei').toString()
    : tx.gasPrice;
  getSanitizedTx(tx)
    .then(_tx => {
      if (store.state.wallet.identifier === WEB3_WALLET) {
        res(new Error('web3 wallets doesnt support eth_signTransaction'));
      } else {
        if (_tx.hasOwnProperty('generateOnly')) {
          eventHub.$emit(EventNames.SHOW_TX_CONFIRM_MODAL, _tx, _response => {
            res(null, toPayload(payload.id, _response));
          });
        } else {
          eventHub.$emit(EventNames.SHOW_TX_CONFIRM_MODAL, _tx, _response => {
            res(null, _response);
          });
        }
      }
    })
    .catch(e => {
      res(e);
    });
};
