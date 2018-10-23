import * as unit from 'ethjs-unit';
import { WEB3_WALLET } from '../bip44/walletTypes';
import { formatters } from 'web3-core-helpers';

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
    signBatchTransaction(arrTxs) {
      eventHub.$emit('showTxCollectionConfirmModal', arrTxs, wallet.isHardware);
    },
    async sendBatchTransactions(arr) {
      for (let i = 0; i < arr.length; i++) {
        const localTx = {
          to: arr[i].to,
          data: arr[i].data,
          from: arr[i].from,
          value: arr[i].value
        };
        arr[i].nonce = await (arr[i].nonce === undefined
          ? web3.eth.getTransactionCount(wallet.getChecksumAddressString())
          : arr[i].nonce);
        arr[i].nonce += i;
        arr[i].gas = await (arr[i].gas === undefined
          ? web3.eth.estimateGas(localTx)
          : arr.gas);
        arr[i].chainId = !arr[i].chainId
          ? state.network.type.chainID
          : arr[i].chainId;
        arr[i].gasPrice =
          arr[i].gasPrice === undefined
            ? unit.toWei(state.gasPrice, 'gwei')
            : arr[i].gasPrice;
        arr[i] = formatters.inputCallFormatter(arr[i]);
      }
      methodOverrides.signBatchTransaction(arr);
    },
    async sendTransaction(tx) {
      const localTx = {
        to: tx.to,
        data: tx.data,
        from: tx.from,
        value: tx.value
      };
      tx['nonce'] = await (tx['nonce'] === undefined
        ? web3.eth.getTransactionCount(wallet.getChecksumAddressString())
        : tx.nonce);
      tx['gas'] = await (tx['gas'] === undefined
        ? web3.eth.estimateGas(localTx)
        : tx.gas);
      tx.chainId = !tx.chainId ? state.network.type.chainID : tx.chainId;
      tx.gasPrice = !tx.gasPrice
        ? unit.toWei(state.gasPrice, 'gwei').toString()
        : tx.gasPrice;
      tx = formatters.inputCallFormatter(tx);
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
  web3.defaultAccount = wallet.getChecksumAddressString();
  web3.eth.defaultAccount = wallet.getChecksumAddressString();
  const sTxMethod = web3.eth.sendTransaction_
    ? 'sendTransaction_'
    : 'sendTransaction';
  web3.eth[sTxMethod].method.accounts = {
    wallet: {
      length: 1,
      [wallet.getChecksumAddressString()]: { privateKey: true }
    },
    ...methodOverrides
  };
  web3.eth.getAccounts = wallet.getChecksumAddressString;
  if (!web3.eth.sendTransaction_)
    web3.eth.sendTransaction_ = web3.eth.sendTransaction;
  web3.eth.signTransaction = methodOverrides.signTransaction;
  web3.eth.sign = methodOverrides.signMessage;
  web3.eth.sendTransaction = methodOverrides.sendTransaction;
  web3.eth.sendBatchTransactions = methodOverrides.sendBatchTransactions;
  return web3; // needs to return web3 for use in vuex
};
