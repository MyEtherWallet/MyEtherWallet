import BigNumber from 'bignumber.js';
import store from '@/core/store';
import cacheFetch from './cacheFetch';
const COINGECKO_ENDPOINT = 'https://api.coingecko.com/api/v3/';
const REFRESH_DELAY = 1000 * 60 * 5;

export const getLastTimestamp = function () {
  const state = store.state.external;
  const timestamp = state.lastTimestamp;
  if (timestamp) return timestamp;
  return null;
};

/**
 * Get Token value in fiat currency
 * @param {string} tokenBalance Amount of token balance
 * @param {string} coingeckoID Coingecko ID of token
 * @param {string} fiatSymbol Symbol of the fiat currency
 * @returns Token's fiat value as a string
 */
export const getTokenValue = async (tokenBalance, coingeckoID, fiatSymbol) => {
  // setMarketInfo before calling
  const balanceBN = new BigNumber(tokenBalance);
  const market = (await getMarketData([coingeckoID]))[0];
  const fiat = await getFiatValue(fiatSymbol);
  if (market && fiat) {
    return balanceBN
      .multipliedBy(market.current_price)
      .multipliedBy(fiat.exchange_rate)
      .toFixed(2);
  }
  return '0';
};

export const getTokenPrice = async (coingeckoID, currency = 'usd') => {
  const urlParams = new URLSearchParams();
  urlParams.append('ids', coingeckoID);
  urlParams.append('vs_currencies', currency);

  return await cacheFetch(
    {
      url: `${COINGECKO_ENDPOINT}simple/price?include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false&${urlParams.toString()}`
    },
    REFRESH_DELAY
  ).then(json => {
    if (json[coingeckoID] && json[coingeckoID][currency] !== undefined) {
      return json[coingeckoID][currency].toString();
    }
    return null;
  });
};

export const getMarketInfoByContracts = async (contracts, platformId) => {
  // setMarketInfo before calling
  const allTokens = Object.values(await getAllTokens());
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
  const marketData = await getMarketData(tokenIds);
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

export const getMarketData = async coingeckoIDs => {
  return await cacheFetch(
    {
      url: `${COINGECKO_ENDPOINT}coins/markets?vs_currency=usd&order=market_cap_desc&price_change_percentage=7d&per_page=250&page=1&sparkline=true&ids=${coingeckoIDs.join(
        ','
      )}`
    },
    REFRESH_DELAY
  ).then(json => {
    const markets = json;
    const retMarkets = [];
    coingeckoIDs.forEach(id => {
      retMarkets.push(markets.find(m => m.id === id) || null);
    });
    return retMarkets;
  });
};

export const getFiatValue = async symbol => {
  // setMarketInfo before calling
  const state = store.state.external;
  const allFiatData = state.fiatInfo;
  if (allFiatData[symbol]) return allFiatData[symbol];
  return null;
};

export const getAllTokens = () => {
  const state = store.state.external;
  return state.allTokens;
};

export const getCache = hash => {
  const state = store.state.external;
  return state.cache[hash];
};
