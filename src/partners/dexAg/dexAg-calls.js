import { get } from '@/helpers/httpRequests';
import { swapApiEndpoints } from '../partnersConfig';
import { utils } from '../helpers';

const getCurrencies = async network => {
  try {
    if (changellyMethods[network]) {
      const results = await get('https://api-v2.dex.ag/token-list-full');
      // const results = await get(`https://swap.mewapi.io/proxy?url=https://api-v2.dex.ag/token-list-full`);

      if (results.error) {
        throw Error(results.error.message);
      }

      return results.result;
    }
    return Promise.resolve({});
  } catch (e) {
    utils.handleOrThrow(e);
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
    // const results = await get(
    //   `https://swap.mewapi.io/proxy?url=${url}`
    // );
    if (results.error) {
      throw Error(results.error.message);
    }

    return results;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

export default {
  getCurrencies,
  getPrice,
  createTransaction
};
