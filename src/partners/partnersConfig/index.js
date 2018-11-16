import { chainCurrencies, fiat } from './currencyDetails';
import EthereumTokens from './EthereumTokens';
import OtherChains from './OtherChains';

const networkSymbols = {
  ETH: 'ETH',
  ROP: 'ROP'
};

const baseCurrency = 'ETH';
const baseCurrencyEntry = { symbol: 'ETH', name: 'Ether' };

const swapServer = 'https://mew-v5-swap-dev-server.nanoapp.io';

export {
  baseCurrency,
  baseCurrencyEntry,
  EthereumTokens,
  OtherChains,
  networkSymbols,
  chainCurrencies,
  fiat,
  swapServer
};
