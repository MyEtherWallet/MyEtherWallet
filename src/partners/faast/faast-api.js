import debugLogger from 'debug';
import querystring from 'querystring';
import { get, post } from '@/helpers/httpRequests';
import { host, supportedNetworks } from './config';
import { utils } from '../helpers';

const errorLogger = debugLogger('v5-error:faast-api');

function buildPath(path, query) {
  let url = `${host}/api/v2/public/${path}`;
  if (query) url += '?' + querystring.stringify(query);
  return url;
}

const getSupportedCurrencies = async network => {
  const currencyDetails = {};
  const tokenDetails = {};
  let geoResults = {};
  try {
    geoResults = await getGeoRestriction();
    if (geoResults.blocked) {
      return { currencyDetails, tokenDetails };
    }
  } catch (e) {
    utils.handleOrThrow(e);
    errorLogger(e);
  }
  try {
    const currencyList = await getCurrencies(network);
    if (currencyList) {
      for (let i = 0; i < currencyList.length; i++) {
        if (currencyList[i].deposit && currencyList[i].receive) {
          const details = {
            symbol: currencyList[i].symbol,
            name: currencyList[i].name,
            validFrom:
              (!geoResults.restricted || !currencyList[i].restricted) &&
              currencyList[i].deposit,
            validTo:
              (!geoResults.restricted || !currencyList[i].restricted) &&
              currencyList[i].receive
          };
          currencyDetails[details.symbol] = details;
          tokenDetails[details.symbol] = details;
        }
      }
      return { currencyDetails, tokenDetails };
    }
    throw Error('Faast get supported currencies failed to return a value');
  } catch (e) {
    utils.handleOrThrow(e);
    errorLogger(e);
  }
};

const getCurrencies = async network => {
  try {
    if (supportedNetworks.includes(network)) {
      const results = await get(buildPath('currencies'));

      if (results.error) {
        throw Error(results.error);
      }

      return results;
    }
    return Promise.resolve([]);
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const getRate = async (fromCurrency, toCurrency, fromValue, network) => {
  try {
    if (supportedNetworks.includes(network)) {
      const pair = `${fromCurrency}_${toCurrency}`;
      let query;
      if (fromValue) query = { deposit_amount: fromValue };
      const results = await get(buildPath(`price/${pair}`, query));

      if (results.error) {
        throw Error(results.error);
      }

      return results;
    }
    return Promise.resolve({});
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const validateAddress = async (addressDetails, network) => {
  try {
    if (supportedNetworks.includes(network)) {
      const results = await post(buildPath('address'), addressDetails);

      if (results.error) {
        throw Error(results.error);
      }

      return results;
    }
    return Promise.resolve({});
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const createTransaction = async (transactionParams, network) => {
  try {
    if (supportedNetworks.includes(network)) {
      const results = await post(buildPath('swap'), transactionParams);

      if (results.error) {
        throw Error(results.error);
      }

      return results;
    }
    return Promise.resolve({});
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const getOrder = async (orderId, network) => {
  try {
    if (supportedNetworks.includes(network)) {
      const results = await get(buildPath(`swaps/${orderId}`));

      if (results.error) {
        throw Error(results.error);
      }

      return results;
    }
    throw Error(`Faast does not support ${network} network`);
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const getGeoRestriction = async () => {
  try {
    const results = await get(buildPath('geoinfo'));

    if (results.error) {
      throw Error(results.error);
    }

    return results;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

export default {
  getSupportedCurrencies,
  getCurrencies,
  getRate,
  validateAddress,
  createTransaction,
  getOrder,
  getGeoRestriction
};
