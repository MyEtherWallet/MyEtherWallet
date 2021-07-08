import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';
const ERRORS = {
  Unexpected: 'bitbox02Error.unexpected',
  'User abort': 'bitbox02Error.user-abort',
  Uninitialized: 'bitbox02Error.not-initialized',
  'Firmware upgrade required': 'bitbox02Error.upgrade-firmware',
  'Unsupported firmware': 'bitbox02Error.unsupported-firmware',
  'Origin not whitelisted': 'bitbox02Error.unsupported-origin',
  'BitBoxBridge not found': 'bitbox02Error.no-bridge',
  'Expected one BitBox02': 'bitbox02Error.expected-one',
  'Pairing rejected': 'bitbox02Error.pairing-rejected',
  'Your BitBox02 is busy': 'bitbox02Error.busy',
  'Unsupported device': 'bitbox02Error.unsupported-device'
};
const WARNINGS = {
  'Attestation failed': 'bitbox02Error.attestation-failed'
};
export default WalletErrorHandler(ERRORS, WARNINGS);
