import { post } from '@/helpers/httpRequests';
import { bityMethods } from './config';
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

const getRates = async () => {
  try {
    const results = await post(
      buildPath(),
      utils.buildPayload(bityMethods.getCryptoRates)
    );
    if (results.error) {
      throw Error(results.error.message);
    }
    return results.result;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const getExitRates = async () => {
  try {
    const results = await post(
      buildPath(),
      utils.buildPayload(bityMethods.getFiatRates)
    );
    if (results.error) {
      throw Error(results.error.message);
    }
    return results.result;
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

const createOrder = async orderInfo => {
  try {
    const results = await post(
      buildPath(),
      utils.buildPayload(bityMethods.createOrder, orderInfo)
    );
    console.log(results); // todo remove dev item
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

const orderDetails = async orderInfo => {
  try {
    const results = await post(
      buildPath(),
      utils.buildPayload(bityMethods.orderDetails, orderInfo)
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

const getStatusFiat = async orderInfo => {
  try {
    const results = await post(
      buildPath(),
      utils.buildPayload(bityMethods.orderDetails, {
        orderId: orderInfo,
        detailsUrl: orderInfo
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
  createOrder,
  orderDetails,
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
