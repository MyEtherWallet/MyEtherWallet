import BigNumber from 'bignumber.js';
import platformList from '@/_generated/platformlist.json';
import {
  formatFiatValue,
  formatPercentageValue,
  formatIntegerValue
} from '@/core/helpers/numberFormatHelper';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
const tempTokenCache = {};
/**
 * Get Eth Fiat value
 */
const fiatValue = function (state, getters) {
  const tokenUSDValue = getters.networkTokenUSDMarket.value;
  const rate = state.currencyRate.data?.exchange_rate || 1;
  return new BigNumber(tokenUSDValue).times(rate);
};

/**
 * Get Eth Balance Fiat value
 */
const balanceFiatValue = function (state, getters, rootState, rootGetters) {
  const balanceInETH = rootGetters['wallet/balanceInETH'];
  return new BigNumber(balanceInETH).times(getters.fiatValue);
};

const totalTokenFiatValue = function (state, getters, rootState, rootGetters) {
  const tokenList = rootGetters['wallet/tokensList'];
  const rate = state.currencyRate.data?.exchange_rate || 1;
  if (!tokenList.length) return new BigNumber(0);
  const totalValue = tokenList.reduce((total, currentVal) => {
    const balance =
      currentVal.usdBalance !== null &&
      (currentVal.price_change_percentage_24h !== null ||
        currentVal.market_cap !== 0)
        ? currentVal.usdBalance
        : 0;
    return new BigNumber(total).plus(balance);
  }, 0);
  return totalValue.times(rate);
};

/**
 * Get main currency market info
 */
const networkTokenUSDMarket = function (
  state,
  getters,
  rootState,
  rootGetters
) {
  const cgid = rootGetters['global/network'].type.coingeckoID;
  if (cgid) {
    const token = state.coinGeckoTokens.get(cgid);
    if (token)
      return {
        value: token.current_price,
        symbol: '$',
        name: 'USD',
        price_change_percentage_24h: token.price_change_percentage_24h
      };
  }
  return {
    value: 0,
    symbol: '$',
    name: 'USD',
    price_change_percentage_24h: 0
  };
};
const getCoinGeckoTokenById = state => cgid => {
  const cgToken = state.coinGeckoTokens.get(cgid);
  return {
    name: cgToken ? cgToken.symbol.toUpperCase() : '',
    symbol: cgToken ? cgToken.symbol.toUpperCase() : '',
    subtext: cgToken ? cgToken.name : '',
    value: cgToken ? cgToken.name : '',
    img: cgToken ? `https://img.mewapi.io/?image=${cgToken.image}` : '',
    market_cap: cgToken ? cgToken.market_cap : '0',
    market_capf: cgToken ? formatIntegerValue(cgToken.market_cap).value : '0',
    price_change_percentage_24h: cgToken
      ? cgToken.price_change_percentage_24h
      : '0',
    price_change_percentage_24hf:
      cgToken && cgToken.price_change_percentage_24h
        ? formatPercentageValue(cgToken.price_change_percentage_24h).value
        : '0',
    price: cgToken ? cgToken.current_price : '0',
    pricef: cgToken ? formatFiatValue(cgToken.current_price).value : '0'
  };
};
/**
 * Get Token info including market data if exists
 */
const contractToToken =
  (state, getters, rootState, rootGetters) => contractAdress => {
    contractAdress = contractAdress.toLowerCase();
    let tokenId = platformList[contractAdress];
    if (contractAdress === MAIN_TOKEN_ADDRESS) {
      tokenId = rootGetters['global/network'].type.coingeckoID;
      const networkType = rootGetters['global/network'].type;
      cgToken = getters.getCoinGeckoTokenById(tokenId);
      return Object.assign(cgToken, {
        name: networkType.name,
        symbol: networkType.name,
        subtext: networkType.name_long,
        value: networkType.name_long,
        contract: MAIN_TOKEN_ADDRESS,
        img: cgToken.img !== '' ? cgToken.img : networkType.icon,
        decimals: 18
      });
    }
    let cgToken;
    cgToken = getters.getCoinGeckoTokenById(tokenId);
    let networkToken = tempTokenCache[contractAdress];
    if (!networkToken) {
      networkToken = rootGetters['global/network'].type.tokens.find(
        t => t.address.toLowerCase() === contractAdress
      );
      tempTokenCache[contractAdress] = networkToken;
    }
    if (!networkToken) return null;
    return Object.assign(cgToken, {
      name: networkToken.symbol,
      symbol: networkToken.symbol,
      subtext: networkToken.name,
      value: networkToken.name,
      contract: networkToken.address,
      img: networkToken.icon_png ? networkToken.icon_png : '',
      decimals: networkToken.decimals
    });
  };

export default {
  fiatValue,
  balanceFiatValue,
  contractToToken,
  networkTokenUSDMarket,
  totalTokenFiatValue,
  getCoinGeckoTokenById
};
