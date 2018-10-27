import { chainCurrencies, fiat } from './currencyDetails';
import Tokens from './EthereumTokens';
import OtherChains from './OtherChains'

const networkSymbols = {
  ETH: 'ETH',
  ROP: 'ROP'
};

const swapServer = 'https://mew-v5-swap-dev-server.nanoapp.io';

const supportedProviders = ['simplex', 'kybernetwork', 'changelly', 'bity'];
export {
  Tokens,
  OtherChains,
  networkSymbols,
  chainCurrencies,
  fiat,
  supportedProviders,
  swapServer
};
