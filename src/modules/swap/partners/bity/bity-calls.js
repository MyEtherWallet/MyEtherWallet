import { bityMethods } from './config';
import { swapApiEndpoints } from '../partnersConfig';
import { utils, post } from '../helpers';

function buildPath() {
  return swapApiEndpoints.base + swapApiEndpoints.bity;
}

export default class BityCalls {
  constructor() {
    this.handleOrThrow = utils.handleOrThrow;
  }

  async getRates() {
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
      this.handleOrThrow(e);
    }
  }

  async getExitRates() {
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
      this.handleOrThrow(e);
    }
  }

  async getEstimate(orderInfo) {
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
      this.handleOrThrow(e);
    }
  }

  async createOrder(orderInfo) {
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
      this.handleOrThrow(e);
    }
  }

  async openOrder(orderInfo) {
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
      this.handleOrThrow(e);
    }
  }

  async sendSignedMessage(signedParts) {
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
      this.handleOrThrow(e);
    }
  }

  async orderDetails(orderInfo) {
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
      this.handleOrThrow(e);
    }
  }

  async getStatus(orderInfo) {
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
      this.handleOrThrow(e);
    }
  }

  async sendReceivedSmsCode(exitData) {
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
      this.handleOrThrow(e);
    }
  }

  async buildCyptoToFiatOrderData(orderData) {
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
      this.handleOrThrow(e);
    }
  }

  async getCyptoToFiatOrderDetails(detailsData) {
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
      this.handleOrThrow(e);
    }
  }

  async getStatusFiat(orderInfo) {
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
      this.handleOrThrow(e);
    }
  }
}

// export {
//   getEstimate,
//   createOrder,
//   orderDetails,
//   getRates,
//   getExitRates,
//   openOrder,
//   getStatus,
//   sendSignedMessage,
//   sendReceivedSmsCode,
//   buildCyptoToFiatOrderData,
//   getCyptoToFiatOrderDetails,
//   getStatusFiat
// };
