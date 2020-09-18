import { utils, post } from '../helpers';
import { swapApiEndpoints } from '../partnersConfig';
import { dexAgMethods } from './config';

function buildPath() {
  return swapApiEndpoints.base + swapApiEndpoints.dexag;
}

export default class DexAgCalls {
  constructor(errorHandler) {
    this.handleOrThrow = utils.handleOrThrow(errorHandler);
  }

  async getSupportedCurrencies() {
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
      this.handleOrThrow(e);
    }
  }

  async getPrice(fromToken, toToken, fromValue) {
    try {
      const results = await post(
        buildPath(),
        utils.buildPayload(dexAgMethods.getPrice, {
          fromToken,
          toToken,
          fromValue
        })
      );
      if (results.error) {
        utils.checkErrorJson(results);
      }
      return results.result;
    } catch (e) {
      this.handleOrThrow(e);
    }
  }

  async createTransaction(transactionParams) {
    try {
      if (transactionParams.dex === 'dexag') {
        transactionParams.dex = 'ag';
      }
      const results = await post(
        buildPath(),
        utils.buildPayload(dexAgMethods.createTransaction, {
          transactionParams
        })
      );
      console.log(results); // todo remove dev item
      console.log(results.result.metadata); // todo remove dev item
      if (results.error) {
        utils.checkErrorJson(results);
      }

      return results.result;
    } catch (e) {
      this.handleOrThrow(e);
    }
  }

  async supportedDexes() {
    try {
      const results = await post(
        buildPath(),
        utils.buildPayload(dexAgMethods.supportedDexes, {})
      );
      if (results.error) {
        utils.checkErrorJson(results);
      }

      return results.result;
    } catch (e) {
      this.handleOrThrow(e);
    }
  }
}

// export default {
//   getSupportedCurrencies,
//   getPrice,
//   createTransaction,
//   supportedDexes
// };
