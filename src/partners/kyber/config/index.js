import {
  kyberBaseCurrency,
  PROVIDER_NAME,
  TIME_SWAP_VALID,
  MAX_DEST_AMOUNT,
  MIN_RATE_BUFFER,
  defaultValues,
  specialGasLimits,
  kyberTokenList,
  kyberTokenInfoList,
  kyberValidNetworks,
  kyberNetworkENS,
  walletDepositeAddress,
  kyberAddressFallback,
  kyberGasLimitList,
  KyberCurrencies,
  FEE_RATE
} from './config';
import kyberNetworkABI from './kyberNetwork.abi';
import { ERC20 } from '../../partnersConfig';
import GAS_LIMITS from './gasLimits';

export {
  kyberBaseCurrency,
  PROVIDER_NAME,
  TIME_SWAP_VALID,
  MAX_DEST_AMOUNT,
  MIN_RATE_BUFFER,
  defaultValues,
  specialGasLimits,
  walletDepositeAddress,
  kyberNetworkENS,
  KyberCurrencies,
  kyberAddressFallback,
  kyberGasLimitList,
  kyberTokenList,
  kyberTokenInfoList,
  kyberValidNetworks,
  kyberNetworkABI,
  ERC20,
  FEE_RATE,
  GAS_LIMITS
};
