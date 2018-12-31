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

function cleanPhoneData(phoneNumber) {
  let cleanedNumber = phoneNumber
    .replace(')', '')
    .replace('.', '')
    .replace(' ', '')
    .replace('(', '')
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

const openOrder = async orderInfo => {
  const results = await post(
    buildPath(),
    utils.buildPayload(bityMethods.createTransaction, orderInfo)
  );
  return results.result;
};

const getStatus = async orderInfo => {
  const results = await post(
    buildPath(),
    utils.buildPayload(bityMethods.status, orderInfo)
  );
  return results.result;
};

const loginWithPhone = async exitData => {
  if (exitData.phoneNumber.length <= 10) {
    throw Error('Invalid phone number. Check country code');
  }
  exitData.phoneNumber = cleanPhoneData(exitData.phoneNumber);
  const results = await post(
    buildPath(),
    utils.buildPayload(bityMethods.logInWithPhoneNumber, exitData)
  );
  return results.result;
};

const sendReceivedSmsCode = async exitData => {
  const results = await post(
    buildPath(),
    utils.buildPayload(bityMethods.sendReceivedSmsCode, exitData)
  );
  return results.result;
};

const buildCyptoToFiatOrderData = async orderData => {
  const results = await post(
    buildPath(),
    utils.buildPayload(bityMethods.buildCyptoToFiatOrderData, orderData)
  );
  return results.result;
};

const getStatusFiat = async (orderInfo, phoneToken) => {
  const results = await post(
    buildPath(),
    utils.buildPayload(bityMethods.status, {
      orderId: orderInfo,
      phoneToken: phoneToken
    })
  );
  return results.result;
};

export {
  getRates,
  getExitRates,
  openOrder,
  getStatus,
  loginWithPhone,
  sendReceivedSmsCode,
  buildCyptoToFiatOrderData,
  getStatusFiat
};
