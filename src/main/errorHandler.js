import WalletErrorHandler from '@/modules/access-wallet/common/WalletErrorHandler';

const mewApiError = 'Websocket connection failed';
export const knownErrors = {
  'Can\'t assign to property "request"': mewApiError,
  "Cannot create property 'request'": mewApiError
};

export default WalletErrorHandler(knownErrors, {});
