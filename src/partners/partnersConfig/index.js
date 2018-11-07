import { chainCurrencies, fiat } from './currencyDetails';
import EthereumTokens from './EthereumTokens';
import OtherChains from './OtherChains';

const networkSymbols = {
  ETH: 'ETH',
  ROP: 'ROP'
};

const swapServer = 'https://mew-v5-swap-dev-server.nanoapp.io';

const supportedProviders = ['simplex', 'kybernetwork', 'changelly', 'bity'];
export {
  EthereumTokens,
  OtherChains,
  networkSymbols,
  chainCurrencies,
  fiat,
  supportedProviders,
  swapServer
};
