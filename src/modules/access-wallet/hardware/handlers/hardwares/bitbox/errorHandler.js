import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';
const ERRORS = {
  errorUnexpected: 'bitboxError.unexpected',
  errorInvalidPassword: 'bitboxError.invalid-password',
  errorUserAbort: 'bitboxError.user-abort',
  errorUserTimeout: 'bitboxError.user-timeout',
  errorNotInitialized: 'bitboxError.not-initialized',
  errorUpgradeFirmware: 'bitboxError.upgrade-firmware',
  errorUnsupportedFirmware: 'bitboxError.unsupported-firmware',
  'Bluetooth adapter not available.':
    'bitboxError.bluetooth-adapter-not-available',
  'An operation that changes interface state is in progress.':
    'bitboxError.operation-that-changes-interface-state-in-progress'
};
const WARNINGS = {};

export default WalletErrorHandler(ERRORS, WARNINGS);
