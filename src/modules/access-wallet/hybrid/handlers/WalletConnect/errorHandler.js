import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';

const ERRORS = {
  'User canceled': 'user cancelled the action',
  'QR Code Modal closed': 'QR code popup closed',
  'Call Request Rejected': 'Request rejected',
  'Session currently connected': 'Session currently connected',
  "Cannot read property 'setItem' of null":
    'Issue accessing WalletConnect! Please try clearing your cache',
  'No error message': 'No error message'
};
const WARNINGS = {};

export default WalletErrorHandler(ERRORS, WARNINGS);
