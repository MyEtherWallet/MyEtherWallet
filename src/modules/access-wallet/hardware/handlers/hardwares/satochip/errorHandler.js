import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';

const ERRORS = {
  'Popup closed': 'satochipError.popup-closed',
  'Device disconnected': 'satochipError.device-disconnect',
  'device disconnected during action': 'satochipError.device-disconnect-action',
  'Action cancelled by user': 'satochipError.user-cancelled-action',
  'Permissions not granted': 'satochipError.no-permission',
  'Device call in progress': 'satochipError.call-in-progress',
  Cancelled: 'satochipError.cancelled',
  'Iframe timeout': 'satochipError.iframe-timeout',
  'popup failed to open': 'satochipError.popup-failed-to-open',
  'Satochip: error while connecting to Satochip-Bridge': 'satochipError.connect-error',
  'No response received from 2FA': 'satochipError.noresponse-2FA',
  'Signing request rejected by user': 'satochipError.rejected-2FA',
  'No card found': 'satochipError.no-card-found',
  'message is undefined': 'satochipError.no-card-found'
};

const WARNINGS = {};

export default WalletErrorHandler(ERRORS, WARNINGS);
