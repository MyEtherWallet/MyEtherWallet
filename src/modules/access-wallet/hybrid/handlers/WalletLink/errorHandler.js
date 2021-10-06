import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';

const ERRORS = {
  'User denied account authorization': 'user denied the authorization',
  'User denied transaction signature': 'user denied the transaction',
  'User denied message signature': 'user denied sign message',
  'Browser is blocking third-party localStorage usage. To continue, turn off third-party storage blocking or whitelist WalletLink.':
    'This Browser is not supported',
  'Session currently connected': 'Session currently connected',
  "Cannot read property 'setItem' of null":
    'Issue accessing WalletConnect! Please try clearing your cache'
};
const WARNINGS = {};

export default WalletErrorHandler(ERRORS, WARNINGS);
