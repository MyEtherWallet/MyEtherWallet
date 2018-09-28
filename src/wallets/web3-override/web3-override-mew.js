// const Web3 = require('web3');
// const url = require('url');
// export default function web3OverrideMew(web3, wallet, eventHub, dispatch) {
export default function web3OverrideMew(web3, wallet, eventHub) {
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
    }
    // async sendTransaction(tx) {
    //   // const hostUrl = web3.currentProvider.hasOwnProperty('host') ? url.parse(web3.currentProvider.host) : null
    //   // const locWeb3 = hostUrl !== null ? new Web3(`${hostUrl.protocol}//${hostUrl.hostname}:${network.port}${hostUrl.pathname}`) :
    //   const localTx = Object.assign({}, tx);
    //   delete localTx['gas'];
    //   delete localTx['nonce'];

    //   tx.nonce = !tx.hasOwnProperty('nonce')
    //     ? await web3.eth.getTransactionCount(wallet.getAddressString())
    //     : tx.nonce;
    //   tx.gas = !tx.hasOwnProperty('gas')
    //     ? await web3.eth.estimateGas(localTx)
    //     : tx.gas;

    //   if (web3.currentProvider.hasOwnProperty('host')) {
    //     await web3.eth
    //       .sendTransaction(tx)
    //       .once('transactionHash', hash => {
    //         dispatch('addNotification', [tx.from, hash, 'Transaction Hash']);
    //       })
    //       .on('receipt', res => {
    //         dispatch('addNotification', [tx.from, res, 'Transaction Receipt']);
    //       })
    //       .on('error', err => {
    //         dispatch('addNotification', [tx.from, err, 'Transaction Error']);
    //       });
    //   } else {
    //     return new Promise(function(resolve, reject) {
    //       web3.eth.sendTransaction(tx, function(err, res) {
    //         if (err) {
    //           reject(err);
    //         }
    //         resolve(res);
    //       });
    //     });
    //   }
    // }
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
  // web3.eth.sendTransaction = methodOverrides.sendTransaction;
  return web3; // needs to return web3 for use in vuex
}
