import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';
const ERRORS = {
  'Wrong Password': 'coolWalletError.wrong-password',
  CardLocked: 'coolWalletError.card-locked',
  AlreadyRegistered: 'coolWalletError.already-registered',
  NoWalletInstance: 'coolWalletError.no-wallet-instance',
  'navigator.bluetooth is undefined': 'coolWalletError.no-bluetooth',
  'GATT Server is disconnected': 'Connection Failed',
  'Max number of App paired. Delete one of the paired app.':
    'coolWalletError.max-app-instance',
  'browser not supported': 'coolWalletError.no-bluetooth',
  'User cancelled the requestDevice() chooser': 'User cancelled action!',
  'NetworkError: GATT operation already in progress.':
    'Unknown CoolWallet Error!',
  'Card Locked. Unlock with a registered App or reset your wallet.':
    'Card Locked. Unlock with a registered App or reset your wallet.',
  'Invalid hex string':
    'Something went wrong! Please make sure your password is correct!',
  'Bluetooth adapter not available.':
    'coolWalletError.bluetooth-adapter-not-available',
  'An operation that changes interface state is in progress.':
    'coolWalletError.operation-that-changes-interface-state-in-progress',
  'connection not open': 'coolWalletError.connection-not-open-on-send'
};
const WARNINGS = {};
export default WalletErrorHandler(ERRORS, WARNINGS);
