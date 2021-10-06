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
  'connection not open': 'trezorError.connection-not-open-on-send'
};

const WARNINGS = {};

export default WalletErrorHandler(ERRORS, WARNINGS);
