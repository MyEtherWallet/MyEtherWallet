import MEWconnect from '@myetherwallet/mewconnect-web-client';
import store from '@/store';
import { Transaction } from 'ethereumjs-tx';
import { MEW_CONNECT as mewConnectType } from '../../bip44/walletTypes';
import {
  getSignTransactionObject,
  sanitizeHex,
  getBufferFromHex,
  calculateChainIdFromV
} from '../../utils';
import { hashPersonalMessage } from 'ethereumjs-util';
import errorHandler from './errorHandler';
import commonGenerator from '@/helpers/commonGenerator';
import { Misc } from '@/helpers';
import HybridWalletInterface from '../walletInterface';

const V1_SIGNAL_URL = 'https://connect.mewapi.io';
const V2_SIGNAL_URL = 'wss://connect2.mewapi.io/staging';
const IS_HARDWARE = true;

class MEWconnectWallet {
  constructor() {
    this.identifier = mewConnectType;
    this.isHardware = IS_HARDWARE;
    this.mewConnect = new MEWconnect.Initiator({
      v1Url: V1_SIGNAL_URL,
      v2Url: V2_SIGNAL_URL
    });
    this.mewConnect.disconnect = () => {
      this.mewConnect.disconnectRTC();
    };
  }
  async init(qrcode) {
    this.mewConnect.on('codeDisplay', qrcode);
    const txSigner = async tx => {
      let tokenInfo;
      if (tx.data.slice(0, 10) === '0xa9059cbb') {
        tokenInfo = store.state.main.network.type.tokens.find(
          entry => entry.address.toLowerCase() === tx.to.toLowerCase()
        );
        if (tokenInfo) {
          tx.currency = {
            symbol: tokenInfo.symbol,
            decimals: tokenInfo.decimals,
            address: tokenInfo.address
          };
        }
      }
      const networkId = tx.chainId;
      return new Promise(resolve => {
        if (!tx.gasLimit) {
          tx.gasLimit = tx.gas;
        }
        this.mewConnect.sendRtcMessage('signTx', JSON.stringify(tx));
        this.mewConnect.once('signTx', result => {
          tx = new Transaction(sanitizeHex(result), {
            common: commonGenerator(store.state.main.network)
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
        const msgHash = hashPersonalMessage(Misc.toBuffer(msg));
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
      errorHandler
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
          store._vm.$eventHub.$emit('mewConnectDisconnected');
          store.dispatch('main/clearWallet');
        }
      });
      mewConnect.sendRtcMessage('address', '');
      mewConnect.once('address', data => {
        resolve(data.address);
      });
    });
  });
};

export default createWallet;
