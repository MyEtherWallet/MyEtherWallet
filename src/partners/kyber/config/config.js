// TODO: look into only using kyberTokenInfoList for ETH and parsing results differently if ROP?
import { TIME_SWAP_VALID_DEFAULT } from '../../partnersConfig/config';

const kyberTokenList = {
  ETH: 'https://tracker.kyber.network/api/tokens/supported',
  ROP: 'https://tracker.kyber.network/api/tokens/supported?chain=ropsten'
};

const kyberTokenInfoList = {
  ETH: 'https://tracker.kyber.network/api/tokens/pairs'
};

const kyberAddressFallback = {
  ETH: '0x818e6fecd516ecc3849daf6845e3ec868087b755',
  ROP: '0x818E6FECD516Ecc3849DAf6845e3EC868087B755'
};

import { KyberCurrenciesETH } from './currenciesETH';
import { KyberCurrenciesROP } from './currenciesROP';

const KyberCurrencies = { ETH: KyberCurrenciesETH, ROP: KyberCurrenciesROP };

const walletDepositeAddress = '0x4247951c2eb6d0bA38d233fe7d542c8c80c9d46A'; // i.e. where payments go
const kyberNetworkENS = 'kybernetwork.eth';
const kyberValidNetworks = ['ETH', 'ROP'];

const defaultValues = {
  tradeGasLimit: 400000,
  tokenToTokenGasLimit: 400000,
  tokenApprovalGasLimit: 50000, //40205,
  maxGasPrice: 30000000000, // 30 Gwei
  gasPrice: 2000000000 // 2 Gwei
};
const MAX_DEST_AMOUNT = '1000000000000000000000000000000000000';
const TIME_SWAP_VALID = TIME_SWAP_VALID_DEFAULT;
const PROVIDER_NAME = 'kybernetwork';
const kyberBaseCurrency = 'ETH';

export {
  kyberBaseCurrency,
  PROVIDER_NAME,
  TIME_SWAP_VALID,
  MAX_DEST_AMOUNT,
  defaultValues,
  kyberTokenList,
  kyberTokenInfoList,
  kyberValidNetworks,
  kyberNetworkENS,
  walletDepositeAddress,
  KyberCurrencies,
  kyberAddressFallback
};
