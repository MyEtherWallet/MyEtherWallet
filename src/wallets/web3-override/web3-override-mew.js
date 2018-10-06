import * as unit from 'ethjs-unit';
export default function web3OverrideMew(
  web3,
  wallet,
  eventHub,
  { state, dispatch }
) {
  if (!wallet) return web3;

  const methodOverrides = {
    signTransaction(tx) {
      return new Promise(resolve => {
        if (tx.generateOnly) {
          delete tx['generateOnly'];
          eventHub.$emit(
            'showTxConfirmModal',
            tx,
            wallet.isHardware,
            wallet.signTransaction.bind(this),
            res => {
              resolve(res);
            }
          );
        } else if (tx.web3WalletOnly) {
          delete tx['web3WalletOnly'];
          eventHub.$emit(
            'showWeb3Wallet',
            tx,
            wallet.isHardware,
            // This just sends the tx. Metamask doesn't support signing https://github.com/MetaMask/metamask-extension/issues/3475
            wallet.signTransaction.bind(this),
            res => {
              resolve(res);
            }
          );
        } else {
          eventHub.$emit(
            'showTxConfirmModal',
            tx,
            wallet.isHardware,
            wallet.signTransaction.bind(this),
            res => {
              resolve(res);
            }
          );
        }
      });
    },
    signMessage(message) {
      return new Promise(resolve => {
        eventHub.$emit(
          'showMessageConfirmModal',
          message,
          wallet.isHardware,
          wallet.signMessage,
          res => {
            resolve(res);
          }
        );
      });
    },
    async sendTransaction(tx) {
      const localTx = Object.assign({}, tx);
      delete localTx['gas'];
      delete localTx['nonce'];

      tx.nonce = !tx.nonce
        ? await web3.eth.getTransactionCount(wallet.getAddressString())
        : tx.nonce;
      tx.gas = !tx.gas ? await web3.eth.estimateGas(localTx) : tx.gas;
      tx.chainId = !tx.chainId ? state.network.type.chainID : tx.chainId;
      tx.gasPrice = !tx.gasPrice
        ? unit.toWei(state.gasPrice, 'gwei').toString()
        : tx.gasPrice;
      if (state.wallet.identifier === 'Web3') tx.web3WalletOnly = true;
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
  web3.eth.sendTransaction.method.accounts = {
    wallet: {
      length: 1,
      [wallet.getAddressString().toLowerCase()]: {
        privateKey: true
      }
    },
    ...methodOverrides
  };

  web3.eth.signTransaction = methodOverrides.signTransaction;
  web3.eth.sign = methodOverrides.signMessage;
  web3.eth.sendTransaction_ = web3.eth.sendTransaction;
  web3.eth.sendTransaction = methodOverrides.sendTransaction;
  return web3; // needs to return web3 for use in vuex
}
