import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';

const ERRORS = {
  'User canceled': 'user cancelled the action',
  'QR Code Modal closed': 'QR code popup closed',
  'Call Request Rejected': 'Request rejected',
  'Session currently connected': 'Session currently connected'
};
const WARNINGS = {};

export default WalletErrorHandler(ERRORS, WARNINGS);
