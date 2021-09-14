import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';

const ERRORS = {
  27010: 'bcvaultError.invalid-device-pin-or-password',
  daemonError2: 'bcvaultError.closed-modal',
  daemonError1: 'bcvaultError.session-error',
  daemonError3: 'bcvaultError.https-issue',
  25601: 'bcvaultError.user-no-action',
  40449: 'bcvaultError.user-cancelled-action',
  daemonError0x6901: 'bcvaultError.daemon0x6901',
  'Bluetooth adapter not available.':
    'bcvaultError.bluetooth-adapter-not-available',
  'An operation that changes interface state is in progress.':
    'bcvaultError.operation-that-changes-interface-state-in-progress'
};
const WARNINGS = {
  jsError1: 'bcvaultError.browser-popup',
  jsErrormew1: 'bcvaultError.only-one-wallet',
  jsErrormew2: 'bcvaultError.can-only-sign-eth',
  jsErrormew3: 'bcvaultError.check-daemon',
  jsErrormew4: 'bcvaultError.no-account-found',
  jsErrormew5: 'bcvaultError.no-device-found'
};
export default WalletErrorHandler(ERRORS, WARNINGS);
