import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';
const ERRORS = {
  WrongPassword: 'coolWalletError.wrong-password',
  CardLocked: 'coolWalletError.card-locked',
  AlreadyRegistered: 'coolWalletError.already-registered',
  NoWalletInstance: 'coolWalletError.no-wallet-instance',
  'navigator.bluetooth is undefined': 'coolWalletError.no-bluetooth',
  MaxAppRegistered: 'coolWalletError.max-app-instance',
  'browser not supported': 'coolWalletError.no-bluetooth',
  'User cancelled the requestDevice() chooser':
    'coolWalletError.user-cancelled-request-device-bluetooth',
  'Bluetooth adapter not available.':
    'coolWalletError.bluetooth-adapter-not-available',
  'An operation that changes interface state is in progress.':
    'coolWalletError.operation-that-changes-interface-state-in-progress'
};
const WARNINGS = {};
export default WalletErrorHandler(ERRORS, WARNINGS);
