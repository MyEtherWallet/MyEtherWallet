import { TIME_SWAP_VALID_DEFAULT } from '../../partnersConfig/config';

import { TotleCurrenciesETH } from './currenciesETH';

const ETH_ENDPOINT = 'https://api.totle.com/';

const totleTokenList = {
  ETH: `${ETH_ENDPOINT}/tokens`
};

const TotleCurrencies = {
  ETH: TotleCurrenciesETH
};

const totleMethods = {
  ETH: {
    currencies: 'getSupportedTokens',
    createOrder: 'createOrder'
  }
};

const FEE_RATE = 0;
const TIME_SWAP_VALID = TIME_SWAP_VALID_DEFAULT;
const PROVIDER_NAME = 'totle';

export {
  FEE_RATE,
  PROVIDER_NAME,
  TIME_SWAP_VALID,
  totleTokenList,
  TotleCurrencies,
  totleMethods
};
