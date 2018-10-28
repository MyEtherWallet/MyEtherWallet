import { KyberCurrenciesETH } from './currencies';
import { KyberCurrenciesROP } from './currenciesRop';
import {
  mainChainCurrency,
  providerName,
  defaultValues,
  kyberAddressFallback,
  kyberTokenList,
  kyberTokenInfoList,
  kyberValidNetworks,
  kyberNetworkENS,
  walletDepositeAddress
} from './config';
import kyberNetworkABI from './kyberNetworkABI';
import ERC20 from './ERC20TokenABI';

const KyberCurrencies = { ETH: KyberCurrenciesETH, ROP: KyberCurrenciesROP };
export {
  mainChainCurrency,
  providerName,
  defaultValues,
  walletDepositeAddress,
  kyberNetworkENS,
  KyberCurrencies,
  kyberAddressFallback,
  kyberTokenList,
  kyberTokenInfoList,
  kyberValidNetworks,
  kyberNetworkABI,
  ERC20
};
