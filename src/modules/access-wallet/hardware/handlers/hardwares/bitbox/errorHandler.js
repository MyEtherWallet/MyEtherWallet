import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';
const ERRORS = {
  errorUnexpected: 'bitboxError.unexpected',
  errorInvalidPassword: 'bitboxError.invalid-password',
  errorUserAbort: 'bitboxError.user-abort',
  errorUserTimeout: 'bitboxError.user-timeout',
  errorNotInitialized: 'bitboxError.not-initialized',
  errorUpgradeFirmware: 'bitboxError.upgrade-firmware',
  errorUnsupportedFirmware: 'bitboxError.unsupported-firmware'
};
const WARNINGS = {};

export default WalletErrorHandler(ERRORS, WARNINGS);
