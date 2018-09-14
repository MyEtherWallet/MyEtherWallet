export default function web3OverideMew(web3, wallet, eventHub) {
  if (!wallet) return web3;

  const methodOverides = {
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
        } else if (tx.metamaskOnly) {
          delete tx['metamaskOnly'];
          eventHub.$emit(
            'showMetamaskModal',
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
    ...methodOverides
  };

  web3.eth.signTransaction = methodOverides.signTransaction;
  web3.eth.sign = methodOverides.signMessage;
  return web3; // needs to return web3 for use in vuex
}
