import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';
const ERRORS = {
  'User rejected action': 'User rejected action'
};
const WARNINGS = {};

export default WalletErrorHandler(ERRORS, WARNINGS);
