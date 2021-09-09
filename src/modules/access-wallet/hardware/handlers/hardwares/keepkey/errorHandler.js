import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';
const ERRORS = {
  'No device selected.': 'keepkeyError.no-device-selected',
  'Invalid PIN': 'keepkeyError.invalid-pin',
  'Unable to claim interface.': 'keepKey.cant-claim',
  'WebUSB is not available in this browser. We recommend trying Chrome.':
    'keepKey.browser-not-supported',
  'Unexpected Message': 'keepKey.generic-error',
  'Unknown message type received': 'keepKey.generic-error',
  'Conflicting Application: Another wallet is trying to connect with your KeepKey.':
    'keepkeyError.another-wallet-trying-to-connect-with-keepkey',
  'User cancelled the requestDevice() chooser.':
    'keepkeyError.user-cancelled-request-device-bluetooth',
  'Bluetooth adapter not available.':
    'keepkeyError.bluetooth-adapter-not-available',
  'An operation that changes interface state is in progress.':
    'keepkeyError.operation-that-changes-interface-state-in-progress'
};
const WARNINGS = {};
export default WalletErrorHandler(ERRORS, WARNINGS);
