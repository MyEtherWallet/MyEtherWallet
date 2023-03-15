// import WalletConnect from '@walletconnect/client';
import { SignClient } from '@walletconnect/sign-client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { Transaction } from '@ethereumjs/tx';
import PromiEvent from 'web3-core-promievent';

import * as nodes from '@/utils/networks/nodes';
import HybridWalletInterface from '../walletInterface';
import store from '@/core/store';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import {
  sanitizeHex,
  getBufferFromHex
} from '@/modules/access-wallet/common/helpers';
import errorHandler from './errorHandler';
import commonGenerator from '@/core/helpers/commonGenerator';
import toBuffer from '@/core/helpers/toBuffer';
import walletconnect from '@/assets/images/icons/wallets/walletconnect.svg';

const PROJECT_ID = '72299ce67c7d5c879dd8da2df1a6875b';
const IS_HARDWARE = false;
class WalletConnectWallet {
  constructor(topic, signClient) {
    this.identifier = WALLET_TYPES.WALLET_CONNECT;
    this.isHardware = IS_HARDWARE;
    this.topic = topic;
    this.signClient = signClient;

    // if (
    //   walletConnect &&
    //   walletConnect.connected &&
    //   walletConnect._sessionStorage
    // ) {
    //   walletConnect._sessionStorage.removeSession();
    //   walletConnect.killSession(); // remove any leftover connections
    // }
    // this.walletConnect = walletConnect;
    this.signClient.on('session_delete', () => {
      store.dispatch('wallet/removeWallet');
    });

    this.meta = {
      name: 'Wallet Connect',
      img: {
        type: 'img',
        value: walletconnect
      }
    };
  }
  init() {
    // eslint-disable-next-line
    return new Promise(async (resolve, reject) => {
      const txSigner = tx => {
        const from = tx.from;
        tx = new Transaction(tx, {
          common: commonGenerator(store.getters['global/network'])
        });
        const txJSON = tx.toJSON();
        txJSON.from = from;
        const prom = PromiEvent(false);
        this.walletConnect
          .sendTransaction(txJSON)
          .then(hash => {
            prom.eventEmitter.emit('transactionHash', hash);
            store.state.wallet.web3.eth.sendTransaction.method._confirmTransaction(
              prom,
              hash,
              { params: [txJSON] }
            );
          })
          .catch(err => {
            prom.reject(err);
          });
        return prom.eventEmitter;
      };
      const msgSigner = msg => {
        return new Promise((resolve, reject) => {
          const msgParams = [
            '0x' + toBuffer(msg).toString('hex'),
            sanitizeHex(this.walletConnect.accounts[0])
          ];
          this.walletConnect
            .signPersonalMessage(msgParams)
            .then(result => {
              resolve(getBufferFromHex(sanitizeHex(result)));
            })
            .catch(reject);
        });
      };
      const { uri, approval } = await this.signClient.connect({
        pairingTopic: this.topic,
        requiredNamespaces: {
          eip155: {
            methods: [
              'eth_sendTransaction',
              'eth_signTransaction',
              'eth_sign',
              'personal_sign'
            ],
            chains: ['eip155:1'],
            events: ['accountsChanged']
          }
        }
      });

      if (uri) {
        QRCodeModal.open(uri);
      }
      console.log('huh?', approval);
      const session = await approval();
      console.log('do you get here AAAA', session);
      // this.walletConnect.createSession();
      // this.walletConnect.on('connect', (error, payload) => {
      //   if (error) {
      //     return reject(error);
      //   }
      //   this.walletConnect._qrcodeModal.close();
      //   const { accounts } = payload.params[0];
      //   resolve(
      //     new HybridWalletInterface(
      //       sanitizeHex(accounts[0]),
      //       this.isHardware,
      //       this.identifier,
      //       txSigner,
      //       msgSigner,
      //       this.walletConnect,
      //       errorHandler,
      //       this.meta
      //     )
      //   );
      // });
    });
  }
}
const createWallet = async () => {
  const signClient = await SignClient.init({
    projectId: PROJECT_ID,
    metadata: {
      name: 'MyEtherWallet Inc',
      description:
        'MyEtherWallet (MEW) is a free, open-source, client-side interface for generating Ethereum wallets & more. Interact with the Ethereum blockchain easily & securely.',
      url: '#'
    }
  });
  signClient.on('session_event', ({ event }) => {
    console.log(event, 'sesh event');
  });
  signClient.on('session_update', ({ event }) => {
    console.log(event, 'sesh update');
  });
  signClient.on('session_delete', ({ event }) => {
    console.log(event, 'sesh delete');
  });
  const { topic } = await signClient.core.pairing.create();
  const walletConnectWallet = new WalletConnectWallet(topic, signClient);
  const _tWallet = await walletConnectWallet.init();
  return _tWallet;
};
createWallet.errorHandler = errorHandler;

export default createWallet;
