import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';
const ERRORS = {
  WrongPassword: 'coolWalletError.wrong-password',
  CardLocked: 'coolWalletError.card-locked',
  AlreadyRegistered: 'coolWalletError.already-registered',
  NoWalletInstance: 'coolWalletError.no-wallet-instance',
  'navigator.bluetooth is undefined': 'coolWalletError.no-bluetooth',
  MaxAppRegistered: 'coolWalletError.max-app-instance',
  'browser not supported': 'coolWalletError.no-bluetooth',
  'User cancelled the requestDevice() chooser.': 'User cancelled action!',
  'NetworkError: GATT operation already in progress.': 'AAAAAAAAAAAAAAAAAA'
};
const WARNINGS = {};
export default WalletErrorHandler(ERRORS, WARNINGS);
