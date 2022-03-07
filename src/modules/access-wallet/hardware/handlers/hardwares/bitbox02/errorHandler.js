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
  'Unsupported device': 'bitbox02Error.unsupported-device',
  'User cancelled the requestDevice() chooser.':
    'bitbox02Error.user-cancelled-request-device-bluetooth',
  'Bluetooth adapter not available.':
    'bitbox02Error.bluetooth-adapter-not-available',
  'An operation that changes interface state is in progress.':
    'bitbox02Error.operation-that-changes-interface-state-in-progress',
  'connection not open': 'bitbox02Error.connection-not-open-on-send',
  'Could not establish a connection to the BitBox02':
    'bitbox02Error.could-not-establish-connection',
  'InvalidStateError: The device is already open.':
    'Device already connected. Please refresh your browser and try again!',
  "Bitbox02 doesn't support signing a regular transaction with 0 value!":
    "Bitbox02 doesn't support signing a regular transaction with 0 value!" // custom error for handling the value
};
const WARNINGS = {
  'Attestation failed': 'bitbox02Error.attestation-failed'
};
export default WalletErrorHandler(ERRORS, WARNINGS);
