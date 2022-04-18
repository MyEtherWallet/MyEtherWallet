import './polyfill.js';
import TransportWebBLE from '@ledgerhq/hw-transport-web-ble';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import bip44Paths from '@/modules/access-wallet/hardware/handlers/bip44';
import ledgerx from '@/assets/images/icons/wallets/x.svg';

// const delay = ms => new Promise(success => setTimeout(success, ms));

class ledgerX {
  constructor() {
    this.identifier = WALLET_TYPES.LEDGER;
    this.isHardware = true;
    this.supportedPaths = bip44Paths[WALLET_TYPES.LEDGER];
    this.meta = {
      name: 'LedgerX',
      img: {
        type: 'img',
        value: ledgerx
      }
    };
  }

  state = {
    devices: []
  };

  createBLE = async () => {
    const transport = await TransportWebBLE.create();
    this.props.onSelectDevice(transport);
  };
}
export default ledgerX;
