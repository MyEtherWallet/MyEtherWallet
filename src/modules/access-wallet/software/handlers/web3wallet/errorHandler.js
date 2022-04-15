import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';
const ERRORS = {
  REJECT_TX:
    'Returned error: Error: MetaMask Tx Signature: User denied transaction signature.',
  'User rejected action!': 'User rejected action!',
  "Can't sign messages from a burner account!":
    "Can't sign messages from a burner account!",
  'MetaMask Tx Signature: User denied transaction signature.':
    'Returned error: Error: MetaMask Tx Signature: User denied transaction signature.',
  'Promise was rejected with a falsy value': 'Action rejected by user',
  'err: insufficient funds for gas':
    'Insufficient funds. Please make sure you have enough funds to complete a transaction',
  'invalid argument':
    'Invalid argument. Please verify that the argument provided is correct',
  'execution reverted':
    'Something went wrong with the transaction: execution reverted',
  'MetaMask Message Signature: User denied message signature.':
    'MetaMask Message Signature: User denied message signature.'
};
const WARNINGS = {};

export default WalletErrorHandler(ERRORS, WARNINGS);
