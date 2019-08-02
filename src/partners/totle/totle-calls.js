import { post } from '@/helpers/httpRequests';
import { totleMethods, TotleCurrencies } from './config';
import { swapApiEndpoints } from '../partnersConfig';
import { utils } from '../helpers';

function buildPath() {
  return swapApiEndpoints.base + swapApiEndpoints.totle;
}

const getTokenList = async network => {
  try {
    if (totleMethods[network]) {
      const results = await post(
        buildPath(),
        utils.buildPayload(totleMethods[network].currencies, [network])
      );

      if (results.error) {
        throw Error(results.error.message);
      }

      return results.result;
    }
    return Promise.resolve(TotleCurrencies[network] || {});
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const createOrder = async (transactionParams, network) => {
  try {
    if (totleMethods[network]) {
      const results = await post(
        buildPath(),
        utils.buildPayload(totleMethods[network].createOrder, transactionParams)
      );

      if (results.error) {
        throw Error(results.error.message);
      }

      return results.result;
    }
    return Promise.resolve(-1);
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

export default { getTokenList, createOrder };
