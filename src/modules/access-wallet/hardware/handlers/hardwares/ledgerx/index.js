import './polyfill.js';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import bip44Paths from '@/modules/access-wallet/hardware/handlers/bip44';
import ledgerx from '@/assets/images/icons/wallets/x.svg';

class ledgerX {
  constructor() {
    this.identifier = WALLET_TYPES.LEDGERX;
    this.isHardware = false;
    this.supportedPaths = bip44Paths[WALLET_TYPES.LEDGER];
    this.meta = {
      name: 'LedgerX',
      img: {
        type: 'img',
        value: ledgerx
      }
    };
  }
}
export default ledgerX;
