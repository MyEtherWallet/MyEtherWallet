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
    'trezor.initializing-failed',
  Cancelled: 'trezorError.cancelled',
  'Iframe timeout': 'trezor.iframe-timeout',
  'Browser not supported': 'trezor.unsupported-browser',
  'popup failed to open': 'trezor.popup-failed-to-open',
  'Safety check failed': 'trezor.safety-check-failed',
  'TrezorConnect not yet initialized': 'trezor.trezor-connect-not-initialized',
  'User cancelled the requestDevice() chooser.':
    'trezor.user-cancelled-request-device-bluetooth',
  'Bluetooth adapter not available.': 'trezor.bluetooth-adapter-not-available',
  'An operation that changes interface state is in progress.':
    'trezor.operation-that-changes-interface-state-in-progress'
};

const WARNINGS = {};

export default WalletErrorHandler(ERRORS, WARNINGS);
