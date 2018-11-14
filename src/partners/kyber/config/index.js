import { kyberAddressFallback, KyberCurrencies } from './fallbacks';

import {
  mainChainCurrency,
  providerName,
  defaultValues,
  kyberTokenList,
  kyberTokenInfoList,
  kyberValidNetworks,
  kyberNetworkENS,
  walletDepositeAddress
} from './config';
import kyberNetworkABI from './kyberNetwork.abi';
import ERC20 from './ERC20Token.abi';

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
