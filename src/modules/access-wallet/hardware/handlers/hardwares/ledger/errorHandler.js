import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';

const ERRORS = {
  'Failed to sign with Ledger device: U2F TIMEOUT':
    'ledgerError.failed-to-sign',
  'Failed to sign with Ledger device: U2F DEVICE_INELIGIBLE':
    'ledgerError.failed-sign-ineligible',
  'UNKNOWN_ERROR (0x6801)': 'ledgerError.unknown-0x6801',
  'UNKNOWN_ERROR (0x6804)': 'ledgerError.unknown-0x6804',
  'Ledger device: UNKNOWN_ERROR (0x6804)': 'ledgerError.unknown-0x6804',
  'Ledger device: UNKNOWN_ERROR (0x6b0c)': 'ledgerError.unknown-0x6boc',
  'Ledger device: UNKNOWN_ERROR (0x650f)': 'ledgerError.wrong-wallet',
  'Ledger device: Invalid data received (0x6a80)':
    'ledgerError.invalid-data-0x6a80',
  'Ledger device: CLA_NOT_SUPPORTED (0x6e00)':
    'ledgerError.cla-not-support-0x6e00',
  'Ledger Device is busy (lock getAddress)': 'ledgerError.device-busy-2',
  'Ledger device: INS_NOT_SUPPORTED (0x6d00)': 'ledgerError.wrong-wallet',
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
    'ledgerError.operation-that-changes-interface-state-in-progress'
};
const WARNINGS = {
  'Ledger device: Condition of use not satisfied (denied by the user?) (0x6985)':
    'ledgerError.denied-by-user-0x6985',
  "U2F browser support is needed for Ledger. Please use Chrome, Opera or Firefox with a U2F extension. Also make sure you're on an HTTPS connection":
    'ledgerError.unsupported-browser-u2f',
  'Ledger device: Incorrect length (0x6700)':
    'Wrong or No app selected in Ledger Device'
};

export default WalletErrorHandler(ERRORS, WARNINGS);
