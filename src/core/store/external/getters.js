import BigNumber from 'bignumber.js';
import platformList from '@/_generated/platformlist.json';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';
/**
 * Get Eth Fiat value
 */
const fiatValue = function (state) {
  const ethUSDValue = state.ETHUSDValue.value || 0;
  const rate = state.currencyRate.data?.exchange_rate || 1;
  return new BigNumber(ethUSDValue).times(rate);
};

/**
 * Get Eth Balance Fiat value
 */
const balanceFiatValue = function (state, getters, rootState, rootGetters) {
  const balanceInETH = rootGetters['wallet/balanceInETH'];
  return new BigNumber(balanceInETH).times(getters.fiatValue);
};

/**
 * Get Token info including market data if exists
 */
const contractToToken =
  (state, getters, rootState, rootGetters) => contractAdress => {
    contractAdress = contractAdress.toLowerCase();
    const tokenId = platformList[contractAdress];
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
  contractToToken
};
