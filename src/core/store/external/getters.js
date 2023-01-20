import BigNumber from 'bignumber.js';
import platformList from '@/_generated/platformlist.json';
// import {
//   formatFiatValue,
//   formatPercentageValue,
//   formatIntegerValue
// } from '@/core/helpers/numberFormatHelper';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import {
  getCoinGeckoTokenById,
  getMarketData
} from '@/core/helpers/marketData';

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
    return getMarketData([cgid]).then(val => {
      const token = val;
      if (token)
        return {
          value: token.current_price,
          symbol: '$',
          name: 'USD',
          price_change_percentage_24h: token.price_change_percentage_24h
        };
    });
  }
  return {
    value: 0,
    symbol: '$',
    name: 'USD',
    price_change_percentage_24h: 0
  };
};
// const getCoinGeckoTokenById =
//   (state, getters, rootState, rootGetters) => cgid => {
//     const cgToken = getters.getMarketData([cgid]).then(tokens => tokens[0]);
//     const tokenData = Object.values(getters.getAllTokens()).find(
//       item => item.id === cgid
//     );
//     const currentNetwork = rootGetters['global/network'].type;
//     const networkName = currentNetwork.name_long
//       .toLowerCase()
//       .split(' ')
//       .join('-');
//     console.log('networkName', networkName);
//     console.log('tokenData', tokenData);
//     console.log('cgToken', cgToken);
//     return {
//       name: cgToken ? cgToken.symbol.toUpperCase() : '',
//       symbol: cgToken ? cgToken.symbol.toUpperCase() : '',
//       subtext: cgToken ? cgToken.name : '',
//       value: cgToken ? cgToken.name : '',
//       img: cgToken ? `https://img.mewapi.io/?image=${cgToken.image}` : '',
//       market_cap: cgToken ? cgToken.market_cap : '0',
//       market_capf: cgToken ? formatIntegerValue(cgToken.market_cap).value : '0',
//       price_change_percentage_24h: cgToken
//         ? cgToken.price_change_percentage_24h
//         : '0',
//       price_change_percentage_24hf:
//         cgToken && cgToken.price_change_percentage_24h
//           ? formatPercentageValue(cgToken.price_change_percentage_24h).value
//           : '0',
//       price: cgToken ? cgToken.current_price : '0',
//       pricef: cgToken ? formatFiatValue(cgToken.current_price).value : '0',
//       contract:
//         currentNetwork.coingeckoID === cgid
//           ? MAIN_TOKEN_ADDRESS
//           : tokenData.platforms[networkName]
//     };
//   };
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
      return getCoinGeckoTokenById(tokenId).then(token => {
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
    return getCoinGeckoTokenById(tokenId).then(token => {
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

// Enkrypt functions
const getAllTokens = state => () => {
  return state.allTokens;
};

const getCache = state => hash => {
  return state.cache[hash];
};

export default {
  fiatValue,
  balanceFiatValue,
  contractToToken,
  networkTokenUSDMarket,
  totalTokenFiatValue,
  getCache,
  getAllTokens
};
