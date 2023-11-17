import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';
const ERRORS = {
  'Wrong Password': 'coolWalletError.wrong-password',
  CardLocked: 'coolWalletError.card-locked',
  AlreadyRegistered: 'coolWalletError.already-registered',
  NoWalletInstance: 'coolWalletError.no-wallet-instance',
  'navigator.bluetooth is undefined': 'coolWalletError.no-bluetooth',
  'Web Bluetooth API': 'Bluetooth must be enabled.',
  'GATT Server is disconnected': 'Connection Failed',
  'Max number of App paired. Delete one of the paired app.':
    'coolWalletError.max-app-instance',
  'Connection failed': 'Connection Failed',
  'browser not supported': 'coolWalletError.no-bluetooth',
  'User cancelled the requestDevice() chooser': 'User cancelled action!',
  'NetworkError: GATT operation already in progress.':
    'Unknown CoolWallet Error!',
  'NotSupportedError: GATT operation failed for unknown reason.':
    'CoolWallet Disconnected unexpectedly! Please Try again!',
  'Card Locked. Unlock with a registered App or reset your wallet.':
    'Card Locked. Unlock with a registered App or reset your wallet.',
  'Invalid hex string':
    'Something went wrong! Please make sure your password is correct!',
  'Bluetooth adapter not available.':
    'coolWalletError.bluetooth-adapter-not-available',
  'An operation that changes interface state is in progress.':
    'coolWalletError.operation-that-changes-interface-state-in-progress',
  'connection not open': 'coolWalletError.connection-not-open-on-send',
  'error function: executeAPDU, message: executeAPDU error: NotSupportedError: GATT operation failed for unknown reason.':
    'Unexpected error! Please refresh page and try again!',
  'REGISTER - ': 'Registration Error! Please refresh page and try again'
  // 'invalid remainder': 'Not enough balance!'
};
const WARNINGS = {
  'command info: {"CLA":"80","INS":"1C","P1":"00","P2":"00"}, returnCode: 6A84, message: file full':
    'coolWalletError.max-app-instance',
  'command info: {"CLA":"80","INS":"10","P2":"00"}, returnCode: 6A84, message: file full':
    'coolWalletError.max-app-instance',
  'error function: executeAPDU, message: executeAPDU error: NetworkError: GATT Server is disconnected. Cannot perform GATT operations. (Re)connect first with `device.gatt.connect`.':
    'System Paired successfully, Please refresh page and try again!',
  'Max number of App paired. Delete one of the paired app.':
    'coolWalletError.max-app-instance',
  'error function: , message: Firmware version too low.':
    "Please update your wallet's firmware!"
};
export default WalletErrorHandler(ERRORS, WARNINGS);
