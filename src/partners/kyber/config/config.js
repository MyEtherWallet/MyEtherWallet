// TODO: look into only using kyberTokenInfoList for ETH and parsing results differently if ROP?
import { TIME_SWAP_VALID_DEFAULT } from '../../partnersConfig/config';

import { KyberCurrenciesETH } from './currenciesETH';
import { KyberCurrenciesROP } from './currenciesROP';
import { KyberCurrenciesKOV } from './currenciesKOV';

const ETH_ENDPINT = 'https://api.kyber.network';
const ROP_ENDPOINT = 'https://ropsten-api.kyber.network';

const kyberTokenList = {
  ETH: `${ETH_ENDPINT}/currencies`,
  ROP: `${ROP_ENDPOINT}/currencies`
};

const kyberTokenInfoList = {
  ETH: `${ETH_ENDPINT}/api/tokens/pairs`
};

const kyberGasLimitList = {
  ETH: `${ETH_ENDPINT}/gasLimitConfig`,
  ROP: `${ROP_ENDPOINT}/gasLimitConfig`
};

const kyberAddressFallback = {
  ETH: '0x818e6fecd516ecc3849daf6845e3ec868087b755',
  ROP: '0x818E6FECD516Ecc3849DAf6845e3EC868087B755',
  KOV: '0x692f391bCc85cefCe8C237C01e1f636BbD70EA4D'
};

const KyberCurrencies = {
  ETH: KyberCurrenciesETH,
  ROP: KyberCurrenciesROP,
  KOV: KyberCurrenciesKOV
};

const walletDepositeAddress = '0x4247951c2eb6d0bA38d233fe7d542c8c80c9d46A'; // i.e. where payments go
const kyberNetworkENS = 'kybernetwork.eth';
const kyberValidNetworks = ['ETH', 'ROP', 'KOV'];

const defaultValues = {
  tradeGasLimit: 400000,
  tokenToTokenGasLimit: 400000,
  tokenApprovalGasLimit: 100000, //40205,
  maxGasPrice: 30000000000, // 30 Gwei
  gasPrice: 2000000000 // 2 Gwei
};

const kyberMethods = {
  ETH: {
    currencies: 'getSupportedTokens',
    rate: 'getCryptoRates',
    gasLimits: 'getGasLimits'
  },
  ROP: {
    currencies: 'getSupportedTokens',
    rate: 'getCryptoRates',
    gasLimits: 'getGasLimits'
  }
};

const FEE_RATE = 0;
const MIN_RATE_BUFFER = 0.05; // 5%
const MAX_DEST_AMOUNT = '1000000000000000000000000000000000000';
const TIME_SWAP_VALID = TIME_SWAP_VALID_DEFAULT;
const PROVIDER_NAME = 'kybernetwork';
const kyberBaseCurrency = 'ETH';

const specialGasLimits = {
  DGX: 750000
};

export {
  kyberBaseCurrency,
  FEE_RATE,
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
  KyberCurrencies,
  kyberGasLimitList,
  kyberAddressFallback,
  kyberMethods
};
