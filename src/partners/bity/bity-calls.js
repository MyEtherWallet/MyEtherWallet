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
    .replace(',', '')
    .replace('-', '');
  if (cleanedNumber.slice(0, 1) !== '+') {
    cleanedNumber = '+' + cleanedNumber;
  }
  return cleanedNumber;
}

const getRates = () => {
  try {
    return get(BITY_URL + BITY_SWAP_RATES);
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const getExitRates = () => {
  try {
    return get(BITY_URL + BITY_EXIT_RATES);
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const getEstimate = async orderInfo => {
  try {
    const results = await post(
      buildPath(),
      utils.buildPayload(bityMethods.getEstimate, orderInfo)
    );
    if (results.error) {
      throw Error(results.error.message);
    }
    return results.result;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const openOrder = async orderInfo => {
  try {
    const results = await post(
      buildPath(),
      utils.buildPayload(bityMethods.createTransaction, orderInfo)
    );
    if (results.error) {
      throw Error(results.error.message);
    }

    return results.result;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const getStatus = async orderInfo => {
  try {
    const results = await post(
      buildPath(),
      utils.buildPayload(bityMethods.status, [orderInfo])
    );
    if (results.error) {
      throw Error(results.error.message);
    }
    return results.result;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const loginWithPhone = async exitData => {
  try {
    if (exitData.phoneNumber.length <= 10) {
      throw Error('Invalid phone number. Check country code');
    }
    exitData.phoneNumber = cleanPhoneData(exitData.phoneNumber);
    const results = await post(
      buildPath(),
      utils.buildPayload(bityMethods.logInWithPhoneNumber, exitData)
    );
    if (results.error) {
      throw Error(results.error.message);
    }
    return results.result;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const sendReceivedSmsCode = async exitData => {
  try {
    const results = await post(
      buildPath(),
      utils.buildPayload(bityMethods.sendReceivedSmsCode, exitData)
    );
    if (results.error) {
      throw Error(results.error.message);
    }
    return results.result;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const buildCyptoToFiatOrderData = async orderData => {
  try {
    const results = await post(
      buildPath(),
      utils.buildPayload(bityMethods.buildCyptoToFiatOrderData, orderData)
    );
    if (results.error) {
      throw Error(results.error.message);
    }
    return results.result;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const getCyptoToFiatOrderDetails = async detailsData => {
  try {
    const results = await post(
      buildPath(),
      utils.buildPayload(bityMethods.getExitOrderDetails, detailsData)
    );
    if (results.error) {
      throw Error(results.error.message);
    }
    return results.result;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const getStatusFiat = async (orderInfo, phoneToken) => {
  try {
    const results = await post(
      buildPath(),
      utils.buildPayload(bityMethods.statusFiat, {
        orderId: orderInfo,
        phoneToken: phoneToken.phoneToken
      })
    );
    if (results.error) {
      throw Error(results.error.message);
    }
    return results.result;
  } catch (e) {
    utils.handleOrThrow(e);
  }
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
