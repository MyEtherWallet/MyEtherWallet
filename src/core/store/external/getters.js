import BigNumber from 'bignumber.js';
import platformList from '@/_generated/platformlist.json';
import {
  formatFiatValue,
  formatPercentageValue,
  formatIntegerValue
} from '@/core/helpers/numberFormatHelper';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
// import { keccak256 } from 'web3-utils';
// const STORAGE_TTL = 1000 * 60 * 60 * 24;
// const TIMESTAMP = 'timestamp';
// const COINGECKO_ENDPOINT = 'https://api.coingecko.com/api/v3/';
// const REFRESH_DELAY = 1000 * 60 * 5;
/**
 * Get Eth Fiat value
 */
const fiatValue = function (state, getters) {
  const tokenUSDValue = getters.networkTokenUSDMarket.value;
  return new BigNumber(tokenUSDValue);
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
  if (!tokenList.length) return new BigNumber(0);
  const totalValue = tokenList.reduce((total, currentVal) => {
    const balance =
      !currentVal.isHidden &&
      currentVal.usdBalance !== null &&
      (currentVal.price_change_percentage_24h !== null ||
        currentVal.market_cap !== 0)
        ? currentVal.usdBalance
        : 0;
    return new BigNumber(total).plus(balance);
  }, 0);
  return totalValue;
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
  (state, getters, rootState, rootGetters) => contractAddress => {
    if (!contractAddress) {
      return null;
    }
    contractAddress = contractAddress.toLowerCase();
    let tokenId = platformList[contractAddress];
    let cgToken;
    if (contractAddress === MAIN_TOKEN_ADDRESS) {
      tokenId = rootGetters['global/network'].type.coingeckoID;
      cgToken = getters.getCoinGeckoTokenById(tokenId);
      const networkType = rootGetters['global/network'].type;
      return Object.assign(cgToken, {
        name: networkType.currencyName,
        symbol: networkType.currencyName,
        subtext: networkType.name_long,
        value: networkType.name_long,
        contract: MAIN_TOKEN_ADDRESS,
        img: cgToken.img !== '' ? cgToken.img : networkType.icon,
        decimals: 18
      });
    }
    cgToken = getters.getCoinGeckoTokenById(tokenId);
    const networkToken = state.networkTokens.get(contractAddress);

    if (!networkToken) return null;
    return Object.assign(cgToken, {
      name: networkToken.name,
      symbol: networkToken.symbol,
      subtext: networkToken.name,
      value: networkToken.name,
      contract: networkToken.address,
      img: networkToken.icon_png ? networkToken.icon_png : '',
      decimals: networkToken.decimals
    });
  };

const getLastTimestamp = state => async () => {
  const timestamp = state.lastTimestamp;
  if (timestamp) return timestamp.timestamp;
  return null;
};

const getTokenValue =
  (state, rootGetters, getters, rootState, commit) =>
  async (tokenBalance, coingeckoID, fiatSymbol) => {
    await commit('external/setMarketInfo');
    const balanceBN = new BigNumber(tokenBalance);
    const market = (await getters.getMarketData([coingeckoID]))[0];
    const fiat = await getters.getFiatValue(fiatSymbol);
    if (market && fiat) {
      return balanceBN
        .multipliedBy(market.current_price)
        .multipliedBy(fiat.exchange_rate)
        .toFixed(2);
    }
    return '0';
  };

// const getTokenPrice = async (coingeckoID, currency = 'usd') => {
//   const urlParams = new URLSearchParams();
//   urlParams.append('ids', coingeckoID);
//   urlParams.append('vs_currencies', currency);

//   return cacheFetch(
//     {
//       url: `${COINGECKO_ENDPOINT}simple/price?include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false&${urlParams.toString()}`
//     },
//     REFRESH_DELAY
//   ).then(json => {
//     if (json[coingeckoID] && json[coingeckoID][currency] !== undefined) {
//       return json[coingeckoID][currency].toString();
//     }
//     return null;
//   });
// };

const getMarketInfoByContracts =
  (state, getters, commit) => async (contracts, platformId) => {
    await commit('external/setMarketInfo');
    const allTokens = Object.values(platformList);
    const requested = {};
    const contractTokenMap = {};
    contracts.forEach(add => (contractTokenMap[add] = null));
    const tokenIds = allTokens
      .filter(token => {
        if (
          token.platforms[platformId] &&
          contracts.includes(token.platforms[platformId])
        ) {
          contractTokenMap[token.platforms[platformId]] = token.id;
          return true;
        }
        return false;
      })
      .map(token => token.id);
    const marketData = await getters.getMarketData(tokenIds);
    Object.keys(contractTokenMap).forEach(contract => {
      if (contractTokenMap[contract]) {
        requested[contract] =
          marketData.find(data => data?.id === contractTokenMap[contract]) ||
          null;
      } else {
        requested[contract] = null;
      }
    });
    return requested;
  };

// const getMarketData = async coingeckoIDs => {
//   return await cacheFetch(
//     {
//       url: `${COINGECKO_ENDPOINT}coins/markets?vs_currency=usd&order=market_cap_desc&price_change_percentage=7d&per_page=250&page=1&sparkline=true&ids=${coingeckoIDs.join(
//         ','
//       )}`
//     },
//     REFRESH_DELAY
//   ).then(json => {
//     const markets = json;
//     const retMarkets = [];
//     coingeckoIDs.forEach(id => {
//       retMarkets.push(markets.find(m => m.id === id) || null);
//     });
//     return retMarkets;
//   });
// };

const getFiatValue = (state, getters, commit) => async symbol => {
  await commit('external/setMarketInfo');
  const allFiatData = state.fiatInfo;
  if (allFiatData[symbol]) return allFiatData[symbol];
  return null;
};

export default {
  fiatValue,
  balanceFiatValue,
  contractToToken,
  networkTokenUSDMarket,
  totalTokenFiatValue,
  getCoinGeckoTokenById,
  getLastTimestamp,
  getFiatValue,
  // getTokenPrice,
  getTokenValue,
  getMarketInfoByContracts
  // getMarketData
};
