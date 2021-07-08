import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';

const ERRORS = {
  'User canceled': 'user cancelled the action',
  'QR Code Modal closed': 'QR code popup closed',
  'Call Request Rejected': 'Request rejected'
};
const WARNINGS = {};

export default WalletErrorHandler(ERRORS, WARNINGS);
