import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';

const ERRORS = {
  'Popup closed': 'trezorError.popup-closed',
  'Device disconnected': 'trezorError.device-disconnect',
  'device disconnected during action': 'trezorError.device-disconnect-action',
  'Action cancelled by user': 'trezorError.user-cancelled-action',
  'Permissions not granted': 'trezorError.no-permission',
  'Device call in progress': 'trezorError.call-in-progress',
  'Transport is missing': 'trezorError.transport-missing',
  'EthAppPleaseEnableContractData: Please enable Contract data on the Ethereum app Settings':
    'trezorError.turn-on-contract-data',
  'Initialize failed: Response of unexpected type: Address. Should be Features':
    'trezorError.initializing-failed',
  Cancelled: 'trezorError.cancelled',
  'Iframe timeout': 'trezorError.iframe-timeout',
  'Browser not supported': 'trezorError.unsupported-browser',
  'popup failed to open': 'trezorError.popup-failed-to-open',
  'Safety check failed': 'trezorError.safety-check-failed',
  'TrezorConnect not yet initialized':
    'trezorError.trezor-connect-not-initialized',
  'User cancelled the requestDevice() chooser.':
    'trezorError.user-cancelled-request-device-bluetooth',
  'Bluetooth adapter not available.':
    'trezorError.bluetooth-adapter-not-available',
  'An operation that changes interface state is in progress.':
    'trezorError.operation-that-changes-interface-state-in-progress',
  'connection not open': 'trezorError.connection-not-open-on-send',
  'Iframe blocked': 'trezorError.iframe-blocked',
  'Manifest not set. Read more at https://github.com/trezor/connect/blob/develop/docs/index.md':
    'Device is busy! Please try again.',
  'Forbidden key path': 'Path not supported!',
  'DOMException: Blocked a frame with origin "https://myetherwallet.com" from accessing a cross-origin frame.':
    'Block frame',
  'Manifest not set.': 'Device is busy! Please try again.'
};

const WARNINGS = {};

export default WalletErrorHandler(ERRORS, WARNINGS);
