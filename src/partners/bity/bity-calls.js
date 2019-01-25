import { post, get } from '@/helpers/httpRequests';
import {
  bityMethods,
  BITY_URL,
  BITY_SWAP_RATES,
  BITY_EXIT_RATES
} from './config';
import { swapApiEndpoints } from '../partnersConfig';
import { utils } from '../helpers';

function makeError(msg) {
  // console.log(msg); // todo remove dev item
  return Error(msg);
}

function buildPath() {
  return swapApiEndpoints.base + swapApiEndpoints.bity;
}

function cleanPhoneData(phoneNumber) {
  let cleanedNumber = phoneNumber
    .replace(')', '')
    .replace('.', '')
    .replace(' ', '')
    .replace('(', '')
    .replace(',', '')
    .replace('-', '');
  if (cleanedNumber.slice(0, 1) !== '+') {
    cleanedNumber = '+' + cleanedNumber;
  }
  return cleanedNumber;
}

const getRates = () => {
  return get(BITY_URL + BITY_SWAP_RATES);
};

const getExitRates = () => {
  return get(BITY_URL + BITY_EXIT_RATES);
};

const getEstimate = async orderInfo => {
  const results = await post(
    buildPath(),
    utils.buildPayload(bityMethods.getEstimate, orderInfo)
  );
  if (results.error) {
    throw makeError(results.error.message);
  }
  return results.result;
};

const openOrder = async orderInfo => {
  const results = await post(
    buildPath(),
    utils.buildPayload(bityMethods.createTransaction, orderInfo)
  );
  if (results.error) {
    throw makeError(results.error.message);
  }
  return results.result;
};

const getStatus = async orderInfo => {
  const results = await post(
    buildPath(),
    utils.buildPayload(bityMethods.status, orderInfo)
  );
  if (results.error) {
    throw makeError(results.error.message);
  }
  return results.result;
};

const loginWithPhone = async exitData => {
  if (exitData.phoneNumber.length <= 10) {
    throw makeError('Invalid phone number. Check country code');
  }
  exitData.phoneNumber = cleanPhoneData(exitData.phoneNumber);
  const results = await post(
    buildPath(),
    utils.buildPayload(bityMethods.logInWithPhoneNumber, exitData)
  );
  if (results.error) {
    throw makeError(results.error.message);
  }
  return results.result;
};

const sendReceivedSmsCode = async exitData => {
  const results = await post(
    buildPath(),
    utils.buildPayload(bityMethods.sendReceivedSmsCode, exitData)
  );
  if (results.error) {
    throw makeError(results.error.message);
  }
  return results.result;
};

const buildCyptoToFiatOrderData = async orderData => {
  const results = await post(
    buildPath(),
    utils.buildPayload(bityMethods.buildCyptoToFiatOrderData, orderData)
  );
  if (results.error) {
    throw makeError(results.error.message);
  }
  return results.result;
};

const getCyptoToFiatOrderDetails = async detailsData => {
  const results = await post(
    buildPath(),
    utils.buildPayload(bityMethods.getExitOrderDetails, detailsData)
  );
  if (results.error) {
    throw makeError(results.error.message);
  }
  return results.result;
};

const getStatusFiat = async (orderInfo, phoneToken) => {
  const results = await post(
    buildPath(),
    utils.buildPayload(bityMethods.statusFiat, {
      orderId: orderInfo,
      phoneToken: phoneToken.phoneToken
    })
  );
  if (results.error) {
    throw makeError(results.error.message);
  }
  return results.result;
};

export {
  getEstimate,
  getRates,
  getExitRates,
  openOrder,
  getStatus,
  loginWithPhone,
  sendReceivedSmsCode,
  buildCyptoToFiatOrderData,
  getCyptoToFiatOrderDetails,
  getStatusFiat
};
