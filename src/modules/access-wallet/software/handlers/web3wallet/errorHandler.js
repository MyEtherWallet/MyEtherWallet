import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';
const ERRORS = {
  REJECT_TX:
    'Returned error: Error: MetaMask Tx Signature: User denied transaction signature.',
  'User rejected action!': 'User rejected action!',
  "Can't sign messages from a burner account!":
    "Can't sign messages from a burner account!",
  'MetaMask Tx Signature: User denied transaction signature.':
    'Returned error: Error: MetaMask Tx Signature: User denied transaction signature.',
  'Promise was rejected with a falsy value': 'Action rejected by user'
};
const WARNINGS = {};

export default WalletErrorHandler(ERRORS, WARNINGS);
