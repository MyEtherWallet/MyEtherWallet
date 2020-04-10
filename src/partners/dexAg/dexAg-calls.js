import { get } from '@/helpers/httpRequests';
import {PROXY_CONTRACT_ADDRESS} from './config';
import { utils } from '../helpers';

const getSupportedCurrencies = async () => {
  try {
    const currencyList = await get('https://api-v2.dex.ag/token-list-full');

    const currencyDetails = {};
    const tokenDetails = {};
    if (currencyList) {
      for (let i = 0; i < currencyList.length; i++) {
        if(currencyList[i].address){
          const details = {
            symbol: currencyList[i].symbol.toUpperCase(),
            name: currencyList[i].name,
            address: currencyList[i].address
          };
          currencyDetails[details.symbol] = details;
          tokenDetails[details.symbol] = details;
        }
      }
      return { currencyDetails, tokenDetails };
    }
    throw Error('Dex.ag get supported currencies failed to return a value');
  } catch (e) {
    utils.handleOrThrow(e);
    errorLogger(e);
  }
};

const getPrice = async (fromToken, toToken, fromValue) => {
  try {
    const results = await get(
      `https://api-v2.dex.ag/price?from=${fromToken}&to=${toToken}&fromAmount=${fromValue}&dex=all`
    );
    if (results.error) {
      throw Error(results.error.message);
    }
    return results;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const createTransaction = async transactionParams => {
  try {
    const url = `https://api-v2.dex.ag/tradeAndSend?from=${transactionParams.fromCurrency}&to=${transactionParams.toCurrency}&fromAmount=${transactionParams.fromValue}&dex=${transactionParams.dex}&recipient=${transactionParams.toAddress}&proxy=${PROXY_CONTRACT_ADDRESS}`;
    const results = await get(url);
    if (results.error) {
      throw Error(results.error.message);
    }

    return results;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

export default {
  getSupportedCurrencies,
  getPrice,
  createTransaction
};
