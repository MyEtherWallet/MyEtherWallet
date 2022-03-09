import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';
const ERRORS = {
  'public key only wallets needs a signer':
    'Public key only wallets needs a signer',
  err: 'Something went wrong!',
  'Invalid networkId signature returned.':
    'Invalid networkId signature returned.',
  'Private key does not satisfy the curve requirements (ie. it is invalid)':
    'Private key does not satisfy the curve requirements (ie. it is invalid)'
};
const WARNINGS = {};

export default WalletErrorHandler(ERRORS, WARNINGS);
