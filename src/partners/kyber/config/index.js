import { KyberCurrenciesETH } from './currencies';
import { KyberCurrenciesROP } from './currenciesRop';
import {
  kyberAddressFallback,
  kyberTokenList,
  kyberTokenInfoList,
  kyberValidNetworks
} from './config';
import kyberNetworkABI from './kyberNetworkABI';
import ERC20 from './ERC20TokenABI';

const KyberCurrencies = { ETH: KyberCurrenciesETH, ROP: KyberCurrenciesROP };
export {
  KyberCurrencies,
  kyberAddressFallback,
  kyberTokenList,
  kyberTokenInfoList,
  kyberValidNetworks,
  kyberNetworkABI,
  ERC20
};
