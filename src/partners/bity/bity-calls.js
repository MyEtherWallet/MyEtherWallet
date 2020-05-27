import { post } from '@/helpers/httpRequests';
import { bityMethods } from './config';
import { swapApiEndpoints } from '../partnersConfig';
import { utils } from '../helpers';

function buildPath() {
  return swapApiEndpoints.base + swapApiEndpoints.bity;
}

const getRates = async () => {
  try {
    const results = await post(
      buildPath(),
      utils.buildPayload(bityMethods.getCryptoRates)
    );
    if (results.error) {
      utils.checkErrorJson(results);
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
      utils.checkErrorJson(results);
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
      utils.checkErrorJson(results);
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
    if (results.error) {
      utils.checkErrorJson(results);
    }

    return results.result;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const openOrder = async orderInfo => {
  // v2
  try {
    const results = await post(
      buildPath(),
      utils.buildPayload(bityMethods.createTransactionV2, orderInfo)
    );

    if (results.error) {
      utils.checkErrorJson(results);
    }

    return results.result;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const sendSignedMessage = async signedParts => {
  // v2
  try {
    const results = await post(
      buildPath(),
      utils.buildPayload(bityMethods.sendSignedMessageV2, signedParts)
    );
    if (results.error) {
      utils.checkErrorJson(results);
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
      utils.checkErrorJson(results);
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
      utils.buildPayload(bityMethods.getStatusV2, orderInfo)
    );

    if (results.error) {
      if (Object.keys(results.error.message).length === 0) {
        return;
      }
      utils.checkErrorJson(results);
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
      utils.checkErrorJson(results);
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
      utils.checkErrorJson(results);
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
      utils.checkErrorJson(results);
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
      utils.checkErrorJson(results);
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
  sendSignedMessage,
  sendReceivedSmsCode,
  buildCyptoToFiatOrderData,
  getCyptoToFiatOrderDetails,
  getStatusFiat
};
