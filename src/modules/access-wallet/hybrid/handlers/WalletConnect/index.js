import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { Transaction } from '@ethereumjs/tx';
import PromiEvent from 'web3-core-promievent';

import HybridWalletInterface from '../walletInterface';
import store from '@/core/store';
import * as nodes from '@/utils/networks/nodes';
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
    this.client = signClient;
    this.client.on('session_delete', () => {
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
        this.client
          .request({ method: 'eth_sendTransaction', params: [txJSON] })
          .then(hash => {
            prom.eventEmitter.emit('transactionHash', hash);
            store.state.wallet.web3.eth.sendTransaction.method._confirmTransaction(
              prom,
              hash,
              { params: [txJSON] }
            );
          })
          .catch(err => {
            prom.reject(
              err.message === '' && err.code === 0
                ? prom.reject('User cancelled')
                : err
            );
          });
        return prom.eventEmitter;
      };
      const msgSigner = msg => {
        return new Promise((resolve, reject) => {
          const msgParams = [
            sanitizeHex(store.state.wallet.address),
            '0x' + toBuffer(msg).toString('hex')
          ];
          this.client
            .request({ method: 'eth_sign', params: msgParams })
            .then(result => {
              resolve(getBufferFromHex(sanitizeHex(result)));
            })
            .catch(err => {
              reject(
                err.message === '' && err.code === 0
                  ? reject('User cancelled')
                  : err
              );
            });
        });
      };
      resolve(
        new HybridWalletInterface(
          sanitizeHex(this.client.accounts[0]),
          this.isHardware,
          this.identifier,
          txSigner,
          msgSigner,
          this.client,
          errorHandler,
          this.meta
        )
      );
    });
  }
}
const createWallet = async () => {
  const allChainIds = Object.values(nodes)
    .map(item => {
      if (item.type.chainID !== 1) {
        return item.type.chainID;
      }
    })
    .filter(item => !!item);
  const signClient = await EthereumProvider.init({
    projectId,
    showQrModal: true,
    chains: [1],
    optionalChains: allChainIds,
    methods: ['eth_sendTransaction', 'eth_sign'],
    events: ['chainChanged', 'accountsChanged'],
    metadata: {
      name: 'MyEtherWallet Inc',
      description:
        'MyEtherWallet (MEW) is a free, open-source, client-side interface for generating Ethereum wallets & more. Interact with the Ethereum blockchain easily & securely.',
      url: 'https://myetherwallet.com',
      icons: ['https://www.myetherwallet.com/favicon.png']
    }
  });
  if (signClient.connected) {
    signClient.disconnect();
  }

  signClient.on('connect', evt => {
    const { chainId } = evt;
    const foundNode = Object.values(nodes).find(item => {
      if (item.type.chainID === parseInt(chainId)) return item;
    });
    if (foundNode) {
      store
        .dispatch('global/setNetwork', {
          network: foundNode,
          walletType: WALLET_TYPES.WALLET_CONNECT
        })
        .then(() => {
          store.dispatch('wallet/setWeb3Instance');
        });
    }
  });
  await signClient.connect().catch(e => {
    throw e;
  });

  const walletConnectWallet = new WalletConnectWallet(signClient);
  const _tWallet = await walletConnectWallet.init();
  return _tWallet;
};
createWallet.errorHandler = errorHandler;

export default createWallet;
