import * as unit from 'ethjs-unit';
import { WEB3_WALLET } from '../bip44/walletTypes';
export default (web3, wallet, eventHub, { state, dispatch }) => {
  if (!wallet) return web3;

  const methodOverrides = {
    signTransaction(tx) {
      return new Promise(resolve => {
        if (wallet.identifier === WEB3_WALLET) {
          eventHub.$emit('showWeb3Wallet', tx, res => {
            resolve(res);
          });
        } else {
          eventHub.$emit('showTxConfirmModal', tx, res => {
            resolve(res);
          });
        }
      });
    },
    signMessage(message) {
      return new Promise(resolve => {
        eventHub.$emit('showMessageConfirmModal', message, res => {
          resolve(res);
        });
      });
    },
    async sendTransaction(tx) {
      const localTx = {
        to: tx.to,
        data: tx.data,
        from: tx.from
      };
      tx['nonce'] = await (tx['nonce'] === undefined
        ? web3.eth.getTransactionCount(wallet.getAddressString())
        : tx.nonce);
      tx['gas'] = await (tx['gas'] === undefined
        ? web3.eth.estimateGas(localTx)
        : tx.gas);
      tx.chainId = !tx.chainId ? state.network.type.chainID : tx.chainId;
      tx.gasPrice = !tx.gasPrice
        ? unit.toWei(state.gasPrice, 'gwei').toString()
        : tx.gasPrice;
      web3.eth
        .sendTransaction_(tx)
        .once('transactionHash', hash => {
          dispatch('addNotification', [tx.from, hash, 'Transaction Hash']);
        })
        .on('receipt', res => {
          dispatch('addNotification', [tx.from, res, 'Transaction Receipt']);
        })
        .on('error', err => {
          dispatch('addNotification', [tx.from, err, 'Transaction Error']);
        });
    }
  };
  web3.defaultAccount = wallet.getAddressString().toLowerCase();
  web3.eth.defaultAccount = wallet.getAddressString().toLowerCase();
  const sTxMethod = web3.eth.sendTransaction_
    ? 'sendTransaction_'
    : 'sendTransaction';
  web3.eth[sTxMethod].method.accounts = {
    wallet: {
      length: 1,
      [wallet.getAddressString().toLowerCase()]: { privateKey: true }
    },
    ...methodOverrides
  };
  if (!web3.eth.sendTransaction_)
    web3.eth.sendTransaction_ = web3.eth.sendTransaction;
  web3.eth.signTransaction = methodOverrides.signTransaction;
  web3.eth.sign = methodOverrides.signMessage;
  web3.eth.sendTransaction = methodOverrides.sendTransaction;
  return web3; // needs to return web3 for use in vuex
};
