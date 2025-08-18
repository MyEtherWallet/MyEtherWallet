import BigNumber from 'bignumber.js';

const state = {
  localStore: false,
  path: '',
  currencyRate: {},
  coinGeckoTokens: new Map(), //map of {coingeckoId: coingeckotokeninfo}
  coinGeckoNetworkCurrencies: new Map(), //map of {coingeckoId: coingeckotokeninfo}
  networkTokens: new Map(), //map of {contract: token}
  eip6963Providers: [],
  selectedEIP6963Provider: null,
  selectedEIP6963Info: null,
  totalTokenFiatValue: BigNumber(0)
};

export default state;
