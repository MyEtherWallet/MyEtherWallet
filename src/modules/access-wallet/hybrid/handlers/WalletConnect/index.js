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
import { BSC, ETH, MATIC } from '@/utils/networks/types';

// eslint-disable-next-line
const projectId = WALLET_CONNECT_PROJECT_ID;
const IS_HARDWARE = false;
class WalletConnectWallet {
  constructor(signClient, identifier) {
    this.identifier = identifier;
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
    return new Promise(async resolve => {
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
          const signerMethod =
            this.identifier === WALLET_TYPES.WALLET_CONNECT
              ? 'personal_sign'
              : 'eth_sign';
          this.client
            .request({ method: signerMethod, params: msgParams })
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
const createWallet = async (identifier = WALLET_TYPES.WALLET_CONNECT) => {
  const allChainIds =
    identifier === WALLET_TYPES.WALLET_CONNECT
      ? Object.values(nodes)
          .map(item => {
            if (item.type.chainID !== 1) {
              return item.type.chainID;
            }
          })
          .filter(item => !!item)
      : [BSC.chainID, MATIC.chainID];
  const methods =
    identifier === WALLET_TYPES.WALLET_CONNECT
      ? ['eth_sendTransaction', 'personal_sign']
      : ['eth_sendTransaction', 'eth_sign'];
  const signClient = await EthereumProvider.init({
    projectId,
    showQrModal: true,
    chains: [ETH.chainID],
    optionalChains: allChainIds,
    methods: methods,
    events: ['chainChanged', 'accountsChanged'],
    metadata: {
      name: 'MyEtherWallet Inc',
      description:
        'MyEtherWallet (MEW) is a free, open-source, client-side interface for generating Ethereum wallets & more. Interact with the Ethereum blockchain easily & securely.',
      url: 'https://myetherwallet.com',
      icons: ['https://www.myetherwallet.com/favicon.png']
    },
    qrModalOptions: {
      themeVariables: {
        '--wcm-z-index': 300
      },
      explorerExcludedWalletIds: 'ALL',
      explorerRecommendedWalletIds: 'NONE',
      enableExplorer: false
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
          walletType: identifier
        })
        .then(() => {
          store.dispatch('wallet/setWeb3Instance');
        });
    }
  });
  await signClient.connect().catch(e => {
    throw e;
  });

  const walletConnectWallet = new WalletConnectWallet(signClient, identifier);
  const _tWallet = await walletConnectWallet.init();
  return _tWallet;
};
createWallet.errorHandler = errorHandler;

export default createWallet;
