import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';
const ERRORS = {
  'No device selected.': 'keepkeyError.no-device-selected',
  'Invalid PIN': 'keepkeyError.invalid-pin',
  'Unable to claim interface.': 'keepKey.cant-claim',
  'WebUSB is not available in this browser. We recommend trying Chrome.':
    'keepKey.browser-not-supported',
  'Unexpected Message': 'keepKey.generic-error',
  'Unknown message type received': 'keepKey.generic-error'
};
const WARNINGS = {};
export default WalletErrorHandler(ERRORS, WARNINGS);
