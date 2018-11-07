import { chainCurrencies, fiat } from './currencyDetails';

const networkSymbols = {
  ETH: 'ETH',
  ROP: 'ROP'
};

const swapServer = 'https://mew-v5-swap-dev-server.nanoapp.io';

const supportedProviders = ['simplex', 'kybernetwork', 'changelly', 'bity'];
export {
  networkSymbols,
  chainCurrencies,
  fiat,
  supportedProviders,
  swapServer
};
