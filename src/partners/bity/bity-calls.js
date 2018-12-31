import { post, get } from '@/helpers/httpRequests';
import {
  bityMethods,
  BITY_URL,
  BITY_SWAP_RATES,
  BITY_EXIT_RATES
} from './config';
import { swapApiEndpoints } from '../partnersConfig';
import { utils } from '../helpers';

function buildPath() {
  return swapApiEndpoints.base + swapApiEndpoints.bity;
}

const getRates = () => {
  return get(BITY_URL + BITY_SWAP_RATES);
};

const getExitRates = () => {
  return get(BITY_URL + BITY_EXIT_RATES);
};

const openOrder = orderInfo => {
  return post(
    buildPath(),
    utils.buildPayload(bityMethods.createTransaction, orderInfo)
  );
};

const loginWithPhone = phoneNumber => {
  return post(
    buildPath(),
    utils.buildPayload(bityMethods.logInWithPhoneNumber, {
      phone_number: phoneNumber
    })
  );
};

const sendReceivedSmsCode = (code, phoneToken) => {
  return post(
    buildPath(),
    utils.buildPayload(bityMethods.sendReceivedSmsCode, {
      code: code,
      phoneToken: phoneToken
    })
  );
};

const buildCyptoToFiatOrderData = orderInfo => {
  return post(
    buildPath(),
    utils.buildPayload(bityMethods.buildCyptoToFiatOrderData, orderInfo)
  );
};

const getStatus = orderInfo => {
  return post(buildPath(), utils.buildPayload(bityMethods.status, orderInfo));
};

export {
  getRates,
  getExitRates,
  openOrder,
  getStatus,
  loginWithPhone,
  sendReceivedSmsCode,
  buildCyptoToFiatOrderData
};
