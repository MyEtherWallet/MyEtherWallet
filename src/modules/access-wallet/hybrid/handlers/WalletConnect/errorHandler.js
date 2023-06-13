import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';

const ERRORS = {
  'User cancelled': 'User rejected action!',
  'QR Code Modal closed': 'walletconnectError-qr-code-popup-closed',
  'Call Request Rejected': 'walletconnectError-request-rejected',
  'Session currently connected':
    'walletconnectError-session-currently-connected',
  "Cannot read property 'setItem' of null":
    'walletconnectError-issue-accessing-walletconnect-please-clear-cache',
  'No error message': 'walletconnectError-no-error-message',
  'Connection request reset. Please try again.': 'User closed modal'
};
const WARNINGS = {
  Rejected: 'Transaction rejected by user'
};

export default WalletErrorHandler(ERRORS, WARNINGS);
