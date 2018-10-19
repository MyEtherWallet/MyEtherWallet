import { chainCurrencies, fiat } from './currencyDetails';

const networkSymbols = {
  ETH: 'ETH',
  ROP: 'ROP'
};

const supportedProviders = ['simplex', 'kybernetwork', 'changelly', 'bity'];
export { networkSymbols, chainCurrencies, fiat, supportedProviders };
