import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';

const ERRORS = {
  'User canceled': 'walletconnectError-user-cancelled-the-action',
  'QR Code Modal closed': 'walletconnectError-qr-code-popup-closed',
  'Call Request Rejected': 'walletconnectError-request-rejected',
  'Session currently connected':
    'walletconnectError-session-currently-connected',
  "Cannot read property 'setItem' of null":
    'walletconnectError-issue-accessing-walletconnect-please-clear-cache',
  'No error message': 'walletconnectError-no-error-message'
};
const WARNINGS = {};

export default WalletErrorHandler(ERRORS, WARNINGS);
