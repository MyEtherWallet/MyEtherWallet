import { post } from '@/helpers/httpRequests';
import { kyberMethods } from './config';
import { swapApiEndpoints } from '../partnersConfig';
import { utils } from '../helpers';
import { Toast } from '@/helpers';

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
        Toast.responseHandler('kyber-token-list-update-failed', 1);
      }

      return results.result;
    }
    return Promise.resolve({ data: false });
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
        Toast.responseHandler('kyber-gasLimit-list-update-failed', 1);
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
        Toast.responseHandler('kyber-list-update-failed', 1);
      }
      return results.result;
    }
    return Promise.resolve({ data: false });
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

export default { getTokenList, getRates, getGasLimits };
