import { post } from '@/helpers/httpRequests';
import { changellyMethods } from './config';
import { swapApiEndpoints } from '../partnersConfig';
import { utils } from '../helpers';

function buildPath() {
  return swapApiEndpoints.base + swapApiEndpoints.changelly;
}

const getCurrencies = async network => {
  try {
    if (changellyMethods[network]) {
      const results = await post(
        buildPath(),
        utils.buildPayload(changellyMethods[network].currenciesFull, {})
      );

      if (results.error) {
        throw Error(results.error.message);
      }

      return results.result;
    }
    return Promise.resolve({});
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const getRate = async (fromCurrency, toCurrency, fromValue, network) => {
  try {
    if (changellyMethods[network]) {
      const results = await post(
        buildPath(),
        utils.buildPayload(changellyMethods[network].rate, {
          from: fromCurrency,
          to: toCurrency,
          amount: fromValue
        })
      );

      if (results.error) {
        throw Error(results.error.message);
      }
      return results.result;
    }
    return Promise.resolve(-1);
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const getMin = async (fromCurrency, toCurrency, fromValue, network) => {
  try {
    if (changellyMethods[network]) {
      const results = await post(
        buildPath(),
        utils.buildPayload(changellyMethods[network].min, {
          from: fromCurrency,
          to: toCurrency
        })
      );

      if (results.error) {
        throw Error(results.error.message);
      }

      return results.result;
    }
    return Promise.resolve(-1);
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const validateAddress = async (addressDetails, network) => {
  try {
    if (changellyMethods[network]) {
      const results = await post(
        buildPath(),
        utils.buildPayload(changellyMethods[network].validate, addressDetails)
      );

      if (results.error) {
        throw Error(results.error.message);
      }

      return results.result;
    }
    return Promise.resolve(-1);
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const createTransaction = async (transactionParams, network) => {
  try {
    if (changellyMethods[network]) {
      const results = await post(
        buildPath(),
        utils.buildPayload(
          changellyMethods[network].createTransaction,
          transactionParams
        )
      );

      if (results.error) {
        throw Error(results.error.message);
      }

      return results.result;
    }
    return Promise.resolve(-1);
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const getStatus = async (orderId, network) => {
  try {
    if (changellyMethods[network]) {
      const results = await post(
        buildPath(),
        utils.buildPayload(changellyMethods[network].status, {
          id: orderId
        })
      );

      if (results.error) {
        throw Error(results.error.message);
      }

      return results.result;
    }
    throw Error(`Changelly does not support ${network} network`);
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const login = () => {
  return Promise.resolve({});
};

const getFixRate = async (fromCurrency, toCurrency, fromValue, network) => {
  try {
    if (changellyMethods[network]) {
      const results = await post(
        buildPath(),
        utils.buildPayload(changellyMethods[network].getFixRate, [
          {
            from: fromCurrency,
            to: toCurrency
          }
        ])
      );

      if (results.error) {
        throw Error(results.error.message);
      }
      return results.result;
    }
    return Promise.resolve(-1);
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const createFixTransaction = async (transactionParams, network) => {
  try {
    if (changellyMethods[network]) {
      const results = await post(
        buildPath(),
        utils.buildPayload(
          changellyMethods[network].createFixTransaction,
          transactionParams
        )
      );

      if (results.error) {
        throw Error(results.error.message);
      }

      return results.result;
    }
    return Promise.resolve(-1);
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

export default {
  getCurrencies,
  getRate,
  getMin,
  validateAddress,
  createTransaction,
  getStatus,
  login,
  getFixRate,
  createFixTransaction
};
