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

const openOrder = orderInfo => {
  return post(
    buildPath(),
    utils.buildPayload(bityMethods.createTransaction, orderInfo)
  );
};

const getStatus = orderInfo => {
  return post(buildPath(), utils.buildPayload(bityMethods.status, orderInfo));
};

export { getRates, openOrder, getStatus };
