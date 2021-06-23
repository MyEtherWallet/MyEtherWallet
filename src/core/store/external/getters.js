import BigNumber from 'bignumber.js';
import platformList from '@/_generated/platformlist.json';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
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

/**
 * Get Token info including market data if exists
 */
const contractToToken =
  (state, getters, rootState, rootGetters) => contractAdress => {
    contractAdress = contractAdress.toLowerCase();
    let tokenId = platformList[contractAdress];
    if (contractAdress === MAIN_TOKEN_ADDRESS) {
      tokenId = rootGetters['global/network'].type.coingeckoID;
      cgToken = state.coinGeckoTokens.get(tokenId);
      if (!cgToken) return null;
      return {
        name: cgToken.symbol.toUpperCase(),
        symbol: cgToken.symbol.toUpperCase(),
        subtext: cgToken.name,
        value: cgToken.name,
        contract: MAIN_TOKEN_ADDRESS,
        img: cgToken.image,
        decimals: 18,
        market_cap: cgToken ? cgToken.market_cap : '0',
        price_change_percentage_24h: cgToken
          ? cgToken.price_change_percentage_24h
          : '0',
        price: cgToken ? cgToken.current_price : '0',
        pricef: cgToken ? formatFiatValue(cgToken.current_price).value : '0'
      };
    }
    let cgToken;
    if (tokenId) {
      cgToken = state.coinGeckoTokens.get(tokenId);
    }
    const networkToken = rootGetters['global/network'].type.tokens.filter(
      t => t.address.toLowerCase() === contractAdress
    )[0];
    if (!networkToken) return null;
    return {
      name: networkToken.symbol,
      symbol: networkToken.symbol,
      subtext: networkToken.name,
      value: networkToken.name,
      contract: networkToken.address,
      img: networkToken.icon ? networkToken.icon : '',
      decimals: networkToken.decimals,
      market_cap: cgToken ? cgToken.market_cap : '0',
      price_change_percentage_24h: cgToken
        ? cgToken.price_change_percentage_24h
        : '0',
      price: cgToken ? cgToken.current_price : '0',
      pricef: cgToken ? formatFiatValue(cgToken.current_price).value : '0'
    };
  };

export default {
  fiatValue,
  balanceFiatValue,
  contractToToken,
  networkTokenUSDMarket,
  totalTokenFiatValue
};
