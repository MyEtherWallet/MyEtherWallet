import BigNumber from 'bignumber.js';

import {
  global as useGlobalStore,
  wallet as useWalletStore
} from '@/core/store/index.js';

import platformList from '@/_generated/platformlist.json';
import {
  formatFiatValue,
  formatPercentageValue,
  formatIntegerValue
} from '@/core/helpers/numberFormatHelper';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
/**
 * Get Eth Fiat value
 */
const fiatValue = function () {
  const tokenUSDValue = this.networkTokenUSDMarket.value;
  return new BigNumber(tokenUSDValue);
};

/**
 * Get Eth Balance Fiat value
 */
const balanceFiatValue = function () {
  const walletStore = useWalletStore();
  const balanceInETH = walletStore.balanceInETH;
  return new BigNumber(balanceInETH).times(this.fiatValue);
};

const totalTokenFiatValue = function () {
  const walletStore = useWalletStore();
  const tokenList = walletStore.tokensList;
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
const networkTokenUSDMarket = function (state) {
  const globalStore = useGlobalStore();
  const cgid = globalStore.network.type.coingeckoID;
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
  const networkCurrencyTokens = state.coinGeckoNetworkCurrencies.get(cgid);
  return {
    name: networkCurrencyTokens
      ? networkCurrencyTokens.symbol.toUpperCase()
      : cgToken
      ? cgToken.symbol.toUpperCase()
      : '',
    symbol: networkCurrencyTokens
      ? networkCurrencyTokens.symbol.toUpperCase()
      : cgToken
      ? cgToken.symbol.toUpperCase()
      : '',
    subtext: networkCurrencyTokens
      ? networkCurrencyTokens.name
      : cgToken
      ? cgToken.name
      : '',
    value: networkCurrencyTokens
      ? networkCurrencyTokens.name
      : cgToken
      ? cgToken.name
      : '',
    img: networkCurrencyTokens
      ? `https://img.mewapi.io/?image=${networkCurrencyTokens.image}`
      : cgToken
      ? `https://img.mewapi.io/?image=${cgToken.image}`
      : '',
    market_cap: networkCurrencyTokens
      ? networkCurrencyTokens.market_cap
      : cgToken
      ? cgToken.market_cap
      : '0',
    market_capf: networkCurrencyTokens
      ? formatIntegerValue(networkCurrencyTokens.market_cap).value
      : cgToken
      ? formatIntegerValue(cgToken.market_cap).value
      : '0',
    price_change_percentage_24h: networkCurrencyTokens
      ? networkCurrencyTokens.price_change_percentage_24h
      : cgToken
      ? cgToken.price_change_percentage_24h
      : '0',
    price_change_percentage_24hf: networkCurrencyTokens
      ? formatPercentageValue(networkCurrencyTokens.price_change_percentage_24h)
          .value
      : cgToken && cgToken.price_change_percentage_24h
      ? formatPercentageValue(cgToken.price_change_percentage_24h).value
      : '0',
    price: networkCurrencyTokens
      ? networkCurrencyTokens.current_price
      : cgToken
      ? cgToken.current_price
      : '0',
    pricef: networkCurrencyTokens
      ? formatFiatValue(networkCurrencyTokens.current_price).value
      : cgToken
      ? formatFiatValue(cgToken.current_price).value
      : '0'
  };
};
/**
 * Get Token info including market data if exists
 */
const contractToToken = state => contractAddress => {
  const globalStore = useGlobalStore();
  if (!contractAddress) {
    return null;
  }
  contractAddress = contractAddress.toLowerCase();
  let tokenId = platformList[contractAddress];
  let cgToken;
  if (contractAddress === MAIN_TOKEN_ADDRESS) {
    tokenId = globalStore.network.type.coingeckoID;
    cgToken = this.getCoinGeckoTokenById(tokenId);
    const networkType = globalStore.network.type;
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
  cgToken = this.getCoinGeckoTokenById(tokenId);
  const networkToken = state.networkTokens.get(contractAddress);
  const name = networkToken ? networkToken.name : cgToken.name;
  const symbol = networkToken ? networkToken.symbol : cgToken.symbol;
  const img = cgToken.img ? cgToken.img : networkToken ? networkToken.icon : '';
  const address = networkToken ? networkToken.address : contractAddress;
  const networkTokenObj = {
    name: name,
    symbol: symbol,
    subtext: name,
    value: name,
    contract: address,
    img: img
  };

  if (networkToken && networkToken.hasOwnProperty('decimals')) {
    networkTokenObj['decimals'] = networkToken.decimals;
  }

  return Object.assign(cgToken, networkTokenObj);
};

export default {
  fiatValue,
  balanceFiatValue,
  contractToToken,
  networkTokenUSDMarket,
  totalTokenFiatValue,
  getCoinGeckoTokenById
};
