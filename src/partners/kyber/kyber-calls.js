import { post } from '@/helpers/httpRequests';
import { kyberMethods, KyberCurrencies, GAS_LIMITS } from './config';
import { swapApiEndpoints } from '../partnersConfig';
import { utils } from '../helpers';

function buildPath() {
  return swapApiEndpoints.base + swapApiEndpoints.kyber;
}

const getTokenList = async network => {
  try {
    if (kyberMethods[network]) {
      const results = await post(
        buildPath(),
        utils.buildPayload(kyberMethods[network].currencies, [network])
      );

      if (results.error) {
        throw Error(results.error.message);
      }

      return results.result;
    }
    return Promise.resolve(KyberCurrencies[network] || {});
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const getRates = async network => {
  try {
    if (kyberMethods[network]) {
      const results = await post(
        buildPath(),
        utils.buildPayload(kyberMethods[network].rate, [network])
      );

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

const getGasLimits = async network => {
  try {
    if (kyberMethods[network]) {
      const results = await post(
        buildPath(),
        utils.buildPayload(kyberMethods[network].gasLimits, [])
      );

      if (results.error) {
        throw Error(results.error.message);
      }

      return results.result;
    }
    return Promise.resolve(GAS_LIMITS || {});
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

export default { getTokenList, getRates, getGasLimits };
