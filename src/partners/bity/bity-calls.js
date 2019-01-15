import { post, get } from '@/helpers/httpRequests';
import { bityRateEndpoint, bityMethods } from './config';
import { swapApiEndpoints } from '../partnersConfig';
import { utils } from '../helpers';

function buildPath() {
  return swapApiEndpoints.base + swapApiEndpoints.bity;
}

const getRates = () => {
  return get(bityRateEndpoint);
};

const openOrder = async orderInfo => {
  const result = await post(
    buildPath(),
    utils.buildPayload(bityMethods.createTransaction, orderInfo)
  );
  if (!result.error) {
    return result.result;
  }
  throw Error(result.error.message);
};

const getStatus = async orderId => {
  const result = await post(
    buildPath(),
    utils.buildPayload(bityMethods.status, [orderId])
  );
  return result.result;
};

export { getRates, openOrder, getStatus };
