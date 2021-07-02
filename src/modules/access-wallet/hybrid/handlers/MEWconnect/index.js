import MEWconnect from '@myetherwallet/mewconnect-web-client';
import store from '@/core/store';
import { Transaction } from 'ethereumjs-tx';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import {
  getSignTransactionObject,
  sanitizeHex,
  getBufferFromHex,
  calculateChainIdFromV
} from '@/modules/access-wallet/common/helpers';
import { hashPersonalMessage } from 'ethereumjs-util';
import errorHandler from './errorHandler';
import commonGenerator from '@/core/helpers/commonGenerator';
import toBuffer from '@/core/helpers/toBuffer';
import HybridWalletInterface from '../walletInterface';
import mewwallet from '@/assets/images/icons/wallets/mewwallet.svg';

const V1_SIGNAL_URL = 'https://connect.mewapi.io';
const V2_SIGNAL_URL = 'wss://connect2.mewapi.io/staging';
const IS_HARDWARE = true;
let thisAddress = null;
import { EventBus } from '@/core/plugins/eventBus';

class MEWconnectWallet {
  constructor() {
    this.identifier = WALLET_TYPES.MEW_CONNECT;
    this.isHardware = IS_HARDWARE;
    this.mewConnect = new MEWconnect.Initiator({
      v1Url: V1_SIGNAL_URL,
      v2Url: V2_SIGNAL_URL
    });
    this.mewConnect.disconnect = () => {
      this.mewConnect.disconnectRTC();
    };

    this.icon = {
      type: 'img',
      value: mewwallet
    };
  }
  async init(qrcode) {
    this.mewConnect.on('codeDisplay', qrcode);
    const txSigner = async tx => {
      let tokenInfo;
      if (tx.data.slice(0, 10) === '0xa9059cbb') {
        tokenInfo = store.getters['external/contractToToken'](tx.to);
        if (tokenInfo) {
          tx.currency = {
            symbol: tokenInfo.symbol,
            decimals: tokenInfo.decimals,
            address: tokenInfo.address
          };
        }
      }
      if (!tx.from && thisAddress) {
        tx.from = thisAddress;
      }
      const networkId = tx.chainId;
      return new Promise(resolve => {
        if (!tx.gasLimit) {
          tx.gasLimit = tx.gas;
        }

        this.mewConnect.sendRtcMessage('signTx', JSON.stringify(tx));
        this.mewConnect.once('signTx', result => {
          tx = new Transaction(sanitizeHex(result), {
            common: commonGenerator(store.getters['global/network'])
          });
          const signedChainId = calculateChainIdFromV(tx.v);
          if (signedChainId !== networkId)
            throw new Error(
              'Invalid networkId signature returned. Expected: ' +
                networkId +
                ', Got: ' +
                signedChainId,
              'InvalidNetworkId'
            );
          resolve(getSignTransactionObject(tx));
        });
      });
    };
    const msgSigner = async msg => {
      return new Promise(resolve => {
        const msgHash = hashPersonalMessage(toBuffer(msg));
        this.mewConnect.sendRtcMessage('signMessage', {
          hash: msgHash.toString('hex'),
          text: msg
        });
        this.mewConnect.once('signMessage', data => {
          resolve(getBufferFromHex(sanitizeHex(data.sig)));
        });
      });
    };

    const address = await signalerConnect(V1_SIGNAL_URL, this.mewConnect);

    return new HybridWalletInterface(
      sanitizeHex(address),
      this.isHardware,
      this.identifier,
      txSigner,
      msgSigner,
      this.mewConnect,
      errorHandler,
      this.icon
    );
  }
}
const createWallet = async qrcode => {
  const _MEWconnectWallet = new MEWconnectWallet();
  const _tWallet = await _MEWconnectWallet.init(qrcode);
  return _tWallet;
};
createWallet.errorHandler = errorHandler;
const signalerConnect = (url, mewConnect) => {
  return new Promise(resolve => {
    mewConnect.initiatorStart(url);
    mewConnect.on('RtcConnectedEvent', () => {
      mewConnect.on('RtcClosedEvent', () => {
        if (mewConnect.getConnectonState()) {
          EventBus.$emit('mewConnectDisconnected');
          store.dispatch('wallet/removeWallet');
        }
      });
      mewConnect.sendRtcMessage('address', '');
      mewConnect.once('address', data => {
        thisAddress = data.address;
        resolve(data.address);
      });
    });
  });
};

export default createWallet;
