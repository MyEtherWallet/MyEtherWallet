import MEWconnect from '@myetherwallet/mewconnect-web-client';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { sanitizeHex } from '@/modules/access-wallet/common/helpers';
import errorHandler from './errorHandler';
import HybridWalletInterface from '../walletInterface';
import mewwallet from '@/assets/images/icons/wallets/mewwallet.svg';
import store from '@/core/store';
const IS_HARDWARE = true;
class MEWconnectWallet {
  constructor() {
    this.identifier = WALLET_TYPES.MEW_CONNECT;
    this.isHardware = IS_HARDWARE;
    this.meta = {
      name: 'MEW Wallet',
      img: {
        type: 'img',
        value: mewwallet
      }
    };
  }
  async init() {
    const connection = new MEWconnect.Initiator({ newPopupCreator: true });
    this.mewConnect = await connection.createWalletOnly(
      store.getters['global/network']
    );
    this.mewConnect.disconnect = () => {
      this.mewConnect.mewConnect.disconnectRTC();
    };
    this.mewConnect.mewConnect.on('RtcClosedEvent', () => {
      if (this.mewConnect.mewConnect.getConnectonState()) {
        store.dispatch('wallet/removeWallet');
      }
    });
    const txSigner = this.mewConnect.txSigner;
    const msgSigner = this.mewConnect.msgSigner;
    const address = '0x' + this.mewConnect.publicKey.toString('hex');

    return new HybridWalletInterface(
      sanitizeHex(address),
      this.isHardware,
      this.identifier,
      txSigner,
      msgSigner,
      this.mewConnect,
      errorHandler,
      this.meta
    );
  }
}
const createWallet = async () => {
  const _MEWconnectWallet = new MEWconnectWallet();
  const _tWallet = await _MEWconnectWallet.init();
  return _tWallet;
};
createWallet.errorHandler = errorHandler;
export default createWallet;
