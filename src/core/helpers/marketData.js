import BigNumber from 'bignumber.js';
import platformList from '@/_generated/platformlist.json';
import store from '@/core/store';
import cacheFetch from './cacheFetch';
import {
  formatFiatValue,
  formatPercentageValue,
  formatIntegerValue
} from '@/core/helpers/numberFormatHelper';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
const FIAT_EXCHANGE_RATE_ENDPOINT =
  'https://mainnet.mewwallet.dev/v2/prices/exchange-rates';
const COINGECKO_ENDPOINT = 'https://api.coingecko.com/api/v3/';
const REFRESH_DELAY = 1000 * 60 * 5;

function getState() {
  return store.state.external;
}

export const getLastTimestamp = function () {
  const state = getState();
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
  await setMarketInfo();
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
  await setMarketInfo();
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
  await setMarketInfo();
  const allFiatData = getState().fiatInfo;
  if (allFiatData[symbol]) return allFiatData[symbol];
  return null;
};

export const getAllTokens = () => {
  return getState().allTokens;
};

export const getCache = hash => {
  return getState().cache[hash];
};

export const setMarketInfo = async function () {
  const lastTimestamp = getLastTimestamp();
  if (lastTimestamp && lastTimestamp >= new Date().getTime() - REFRESH_DELAY)
    return;
  const allCoins = await fetch(
    `${COINGECKO_ENDPOINT}coins/list?include_platform=true`
  )
    .then(res => res.json())
    .then(json => {
      const allTokens = json;
      const tokens = {};
      allTokens.forEach(token => {
        tokens[token.id] = token;
      });
      // Format tokens to contain contract and platforms?
      return tokens;
    });
  setAllTokens(allCoins);
  const fiatMarketData = await fetch(`${FIAT_EXCHANGE_RATE_ENDPOINT}`)
    .then(res => res.json())
    .then(json => {
      const topMarkets = json;
      const tokens = {};
      topMarkets.forEach(token => {
        tokens[token.fiat_currency] = token;
      });
      return tokens;
    });
  setFiatExchangeRates(fiatMarketData);
  setLastTimestamp(new Date().getTime());
};

export const setAllTokens = function (tokens) {
  const state = getState();
  state.allTokens = tokens;
};

export const setLastTimestamp = function (timestamp) {
  const state = getState();
  state.lastTimestamp = timestamp;
};
export const setFiatExchangeRates = function (tokens) {
  const state = getState();
  state.fiatInfo = tokens;
};

/**
 * Get a Coingecko data for a token by ID
 * @param {string} cgid Coingecko ID of token
 * @returns Coingecko token object
 */
export const getCoinGeckoTokenById = async cgid => {
  const cgToken = await getMarketData([cgid]).then(tokens => tokens[0]);
  const tokenData = getAllTokens()[cgid];
  const currentNetwork = store.getters['global/network'].type;
  const networkName = currentNetwork.name_long
    .toLowerCase()
    .split(' ')
    .join('-');
  console.log('networkName', networkName);
  console.log('tokenData', tokenData);
  console.log('cgToken', cgToken);
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
    pricef: cgToken ? formatFiatValue(cgToken.current_price).value : '0',
    contract:
      currentNetwork.coingeckoID === cgid
        ? MAIN_TOKEN_ADDRESS
        : tokenData.platforms[networkName],
    platforms: tokenData.platforms
  };
};

/**
 * Get Token info including market data if exists
 */
export const contractToToken = async contractAddress => {
  if (!contractAddress) {
    return null;
  }
  const rootGetters = store.getters;
  const state = getState();
  contractAddress = contractAddress.toLowerCase();
  let tokenId = platformList[contractAddress];
  const tokenData = getAllTokens()[tokenId]; // Object: {platforms, id, name, symbol}
  console.log('tokenData', tokenData);
  let cgToken;
  if (contractAddress === MAIN_TOKEN_ADDRESS) {
    tokenId = rootGetters['global/network'].type.coingeckoID;
    return await getCoinGeckoTokenById(tokenId).then(token => {
      cgToken = token;
      console.log('cgToken contractToToken', cgToken);
      const networkType = rootGetters['global/network'].type;
      return Object.assign(cgToken, {
        name: networkType.currencyName,
        symbol: networkType.currencyName,
        subtext: networkType.name_long,
        value: networkType.name_long,
        // contract: MAIN_TOKEN_ADDRESS,
        img: cgToken.img !== '' ? cgToken.img : networkType.icon,
        decimals: 18
      });
    });
  }
  return await getCoinGeckoTokenById(tokenId).then(token => {
    cgToken = token;
    console.log('cgToken contractToToken (network)', cgToken);
    const networkToken = state.networkTokens.get(contractAddress);
    console.log('networkToken', networkToken);

    if (!networkToken) return null;
    return Object.assign(cgToken, {
      name: networkToken.name,
      symbol: networkToken.symbol,
      subtext: networkToken.name,
      value: networkToken.name,
      // contract: networkToken.address,
      img: networkToken.icon_png ? networkToken.icon_png : '',
      decimals: networkToken.decimals
    });
  });
};

// Format users tokensList
// const formatCoinGeckoTokens = async tokens => {
//   // Number of passes required to format all tokens
//   const MAX_TOKENS_PER_PASS = 250;
//   const passes = tokens.length / MAX_TOKENS_PER_PASS + 1;
//   const remainder = tokens.length % MAX_TOKENS_PER_PASS;
//   for (let i = 0; i < passes; i++) {
//     for ()
//   }
//   const cgToken = await getMarketData([token.id]).then(tokens => tokens[0]);
//   const currentNetwork = store.getters.global.network.type;
//   const networkName = currentNetwork.name_long
//     .toLowerCase()
//     .split(' ')
//     .join('-');
//   console.log('networkName', networkName);
//   console.log('token', token);
//   console.log('cgToken', cgToken);
//   return {
//     name: cgToken ? cgToken.symbol.toUpperCase() : '',
//     symbol: cgToken ? cgToken.symbol.toUpperCase() : '',
//     subtext: cgToken ? cgToken.name : '',
//     value: cgToken ? cgToken.name : '',
//     img: cgToken ? `https://img.mewapi.io/?image=${cgToken.image}` : '',
//     market_cap: cgToken ? cgToken.market_cap : '0',
//     market_capf: cgToken ? formatIntegerValue(cgToken.market_cap).value : '0',
//     price_change_percentage_24h: cgToken
//       ? cgToken.price_change_percentage_24h
//       : '0',
//     price_change_percentage_24hf:
//       cgToken && cgToken.price_change_percentage_24h
//         ? formatPercentageValue(cgToken.price_change_percentage_24h).value
//         : '0',
//     price: cgToken ? cgToken.current_price : '0',
//     pricef: cgToken ? formatFiatValue(cgToken.current_price).value : '0',
//     contract:
//       currentNetwork.coingeckoID === token.id
//         ? MAIN_TOKEN_ADDRESS
//         : token.platforms[networkName],
//     platforms: token.platforms
//   };
// };
