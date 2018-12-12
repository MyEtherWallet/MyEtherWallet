import { post, get } from '@/helpers/httpRequests';
import { bityRateEndpoint, bityMethods } from './config';
import { swapApiEndpoints } from '../partnersConfig';

function buildPath() {
  return swapApiEndpoints.base + swapApiEndpoints.bity;
}

function buildPayload(method, data) {
  return {
    jsonrpc: '2.0',
    method: method,
    params: data,
    id: parseInt(Math.random() * 100)
  };
}

const getRates = () => {
  return get(bityRateEndpoint);
};

const openOrder = orderInfo => {
  return post(
    buildPath(),
    buildPayload(bityMethods.createTransaction, orderInfo)
  );
};

const getStatus = orderInfo => {
  return post(buildPath(), buildPayload(bityMethods.status, orderInfo));
};

export { getRates, openOrder, getStatus };
