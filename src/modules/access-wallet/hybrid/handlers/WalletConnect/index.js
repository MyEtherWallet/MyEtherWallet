// import WalletConnect from '@walletconnect/client';
import SignClient from '@walletconnect/sign-client';
import { Web3Modal } from '@web3modal/standalone';
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

const projectId = '72299ce67c7d5c879dd8da2df1a6875b';
const IS_HARDWARE = false;
class WalletConnectWallet {
  constructor(signClient) {
    this.identifier = WALLET_TYPES.WALLET_CONNECT;
    this.isHardware = IS_HARDWARE;
    // this.topic = topic;
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
      console.log('lmao');
      try {
        const { uri, approval } = await this.signClient.connect({
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
        console.log('create web3 modal');
        const modal = new Web3Modal({
          walletConnectVersion: 2,
          projectId,
          standaloneChains: ['eip155:1']
        });

        console.log('use uri');

        if (uri) {
          modal.openModal({ uri, standaloneChains: ['eip155:1'] });
          const session = await approval();
          console.log(session, 'hakdog');
          modal.closeModal();
        }
      } catch (e) {
        console.log(e);
      }
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
    projectId,
    metadata: {
      name: 'MyEtherWallet Inc',
      description:
        'MyEtherWallet (MEW) is a free, open-source, client-side interface for generating Ethereum wallets & more. Interact with the Ethereum blockchain easily & securely.'
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
  // const { topic } = await signClient.core.pairing.create();
  const walletConnectWallet = new WalletConnectWallet(signClient);
  const _tWallet = await walletConnectWallet.init();
  return _tWallet;
};
createWallet.errorHandler = errorHandler;

export default createWallet;
