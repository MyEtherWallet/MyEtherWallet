import { post } from '@/helpers/httpRequests';
import { utils } from '../helpers';
import {swapApiEndpoints} from '@/partners/partnersConfig';
import {dexAgMethods} from './config';

function buildPath() {
  return swapApiEndpoints.base + swapApiEndpoints.dexag;
}

const getSupportedCurrencies = async () => {
  try {
    const currencyListRaw = await post(
      buildPath(),
      utils.buildPayload(dexAgMethods.getSupportedCurrencies, {})
    );
    const currencyList = currencyListRaw.result;
    const currencyDetails = {};
    const tokenDetails = {};
    if (currencyList) {
      for (let i = 0; i < currencyList.length; i++) {
        if (currencyList[i].address) {
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
    const results = await post(
      buildPath(),
      utils.buildPayload(dexAgMethods.getPrice, { fromToken, toToken, fromValue })
    );
    if (results.error) {
      throw Error(results.error.message);
    }
    return results.result;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const createTransaction = async transactionParams => {
  try {
    const results = await post( buildPath(), utils.buildPayload(dexAgMethods.createTransaction, {transactionParams}));
    if (results.error) {
      throw Error(results.error.message);
    }

    return results.result;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

export default {
  getSupportedCurrencies,
  getPrice,
  createTransaction
};
