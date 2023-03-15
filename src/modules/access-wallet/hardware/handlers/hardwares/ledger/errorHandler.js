import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';

const ERRORS = {
  'UNKNOWN_ERROR (0x6801)': 'ledgerError.unknown-0x6801',
  'UNKNOWN_ERROR (0x6804)': 'ledgerError.unknown-0x6804',
  'UNKNOWN_ERROR (0x6b0c)': 'Unlock your device before continuing',
  'UNKNOWN_ERROR (0x650f)':
    'Error: Please refresh and select the Ethereum app on your device before pairing',
  'UNKNOWN_ERROR (0x6a15)': 'ledgerError.unknown-0x6a15',
  'Failed to sign with Ledger device: U2F TIMEOUT':
    'ledgerError.failed-to-sign',
  'Failed to sign with Ledger device: U2F DEVICE_INELIGIBLE':
    'ledgerError.failed-sign-ineligible',
  'Failed to sign with Ledger device: U2F OTHER_ERROR':
    'ledgerError.u2f-other-error',
  'Ledger device: Invalid data received (0x6a80)':
    'ledgerError.invalid-data-0x6a80',
  'Ledger device: CLA_NOT_SUPPORTED (0x6e00)':
    'ledgerError.cla-not-support-0x6e00',
  'Ledger Device is busy (lock getAddress)': 'ledgerError.device-busy-2',
  'Ledger device: INS_NOT_SUPPORTED (0x6d00)':
    'Please select supported network',
  'Ledger Device is busy (lock provideERC20TokenInformation)':
    'ledgerError.device-busy-1',
  'Ledger Device is busy (lock signTransaction)': 'ledgerError.device-busy-1',
  'Ledger Device is busy (lock signPersonalMessage)':
    'ledgerError.device-busy-1',
  'Ledger device: Incorrect length (0x6700)':
    'ledgerError.device-incorrect-length-0x6700',
  'No Ledger device found (timeout)': 'ledgerError.no-device',
  'Ledger Device is busy': 'ledgerError.device-busy-1',
  'TransportError: Failed to sign with Ledger device: U2F OTHER_ERROR':
    'ledgerError.failed-to-sign-other',
  'Invalid networkId signature returned.': 'ledgerError.invalid-network-id',
  'Please enable Contract data on the Ethereum app Settings':
    'ledgerError.enable-contract-data',
  'TransportInterfaceNotAvailable: The interface number provided is not supported by the device in its current configuration.':
    'ledgerError.transport-interface',
  'No device selected.': 'ledgerError.no-device-selected',
  'Incompatible EIP155-based V 10 and chain id 1. See the second parameter of the Transaction constructor to set the chain id.':
    'ledgerError.app-and-network-mismatch',
  'The device was disconnected': 'ledgerError.device-disconnected',
  'The transfer was cancelled': 'ledgerError.denied-by-user',
  'Unable to claim interface.': 'ledgerError.unable-to-claim',
  'No WebUSB interface found for your Ledger device. Please upgrade firmware or contact techsupport.':
    'ledgerError.no-interface-found',
  'User cancelled the requestDevice() chooser.':
    'ledgerError.user-cancelled-request-device-bluetooth',
  'Bluetooth adapter not available.':
    'ledgerError.bluetooth-adapter-not-available',
  'An operation that changes interface state is in progress.':
    'ledgerError.operation-that-changes-interface-state-in-progress',
  'connection not open': 'ledgerError.connection-not-open-on-send',
  "undefined is not an object (evaluating 'e.decorateAppAPIMethods')":
    'ledgerError.firmware-or-mobile',
  'Access denied.': 'ledgerError.access-denied',
  'WebUsb not supported.  Please try a different browser.':
    'ledgerError.web-usb-not-supported',
  'Web bluetooth is not supported.  Please try a different browser.':
    'ledgerError.web-ble-not-supported',
  'Please enable Blind signing or Contract data in the Ethereum app Settings':
    'Please enable Blind signing or Contract data in the Ethereum app Settings',
  'Ledger device: Security not satisfied':
    'Ledger device is locked or has invalid access rights',
  'GATT Server is disconnected. Cannot perform GATT operations.':
    'Device has been disconnected, please reconnect.',
  "Failed to execute 'transferOut' on 'USBDevice': A transfer error has occurred.":
    'Please select app on Ledger device and try again.',
  'Ledger device: UNKNOWN_ERROR (0x6807)': 'Device is supported',
  'Please make sure you have':
    'Please make sure app is installed and opened on Ledger device',
  'Authentication canceled.': 'Authentication canceled',
  'missing app ETH': 'Make sure you have Ethereum app opened',
  'missing app Rootstock': 'Make sure you have Rootstock app opened',
  'missing app GO': 'Make sure you have GoChain app opened',
  'missing app ETC': 'Make sure you have Ethereum Classic app opened',
  'missing app ROP': 'Make sure you have Ropsten app opened',
  'missing app XDC': 'Make sure you have XDC Network app opened'
};
const WARNINGS = {
  'Ledger device: Condition of use not satisfied (denied by the user?) (0x6985)':
    'ledgerError.denied-by-user-0x6985',
  "U2F browser support is needed for Ledger. Please use Chrome, Opera or Firefox with a U2F extension. Also make sure you're on an HTTPS connection":
    'ledgerError.unsupported-browser-u2f',
  'Ledger device: Incorrect length (0x6700)':
    'Wrong or No app selected in Ledger Device',
  "Failed to execute 'transferIn' on 'USBDevice': A transfer error has occurred.":
    'Please confirm app on Ledger device to continue',
  'Wrong App or No App':
    'Please make sure you selected an app in the Ledger device'
};
const SUCCESS = {
  'App has switched. Please retry again':
    'App has switched. Please retry again.'
};
export default WalletErrorHandler(ERRORS, WARNINGS, SUCCESS);
