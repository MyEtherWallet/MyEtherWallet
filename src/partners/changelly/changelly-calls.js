import { post, get } from '@/helpers/httpRequests';
import { changellyAddresses } from './config';
import { swapServer } from '../partnersConfig';

function buildPath(route) {
  return swapServer + route;
}

const getCurrencies = async network => {
  if (changellyAddresses[network]) {
    const results = await get(
      buildPath(changellyAddresses[network].currencies)
    );
    return results.result;
  }
  return Promise.resolve({});
};

const getRate = async (fromCurrency, toCurrency, fromValue, network) => {
  if (changellyAddresses[network]) {
    const results = await post(buildPath(changellyAddresses[network].rate), {
      from: fromCurrency,
      to: toCurrency,
      amount: fromValue
    });
    return results.result;
  }
  return Promise.resolve(-1);
};

const getBatchRate = async (pairArray, network) => {
  if (changellyAddresses[network]) {
    const results = await post(
      buildPath(changellyAddresses[network].batchRate),
      { params: pairArray }
    );
    return results.result;
  }
  return Promise.resolve(-1);
};

const getMin = async (fromCurrency, toCurrency, fromValue, network) => {
  if (changellyAddresses[network]) {
    const results = await post(buildPath(changellyAddresses[network].min), {
      from: fromCurrency,
      to: toCurrency,
      amount: fromValue
    });
    return results.result;
  }
  return Promise.resolve(-1);
};

const getBatchMin = async (pairArray, network) => {
  if (changellyAddresses[network]) {
    const results = await post(
      buildPath(changellyAddresses[network].batchMin),
      { params: pairArray }
    );
    return results.result;
  }
  return Promise.resolve(-1);
};

const validateAddress = async (addressDetails, network) => {
  if (changellyAddresses[network]) {
    const results = await post(
      buildPath(changellyAddresses[network].validate),
      addressDetails
    );
    return results.result;
  }
  return Promise.resolve(-1);
};

const createTransaction = async (transactionParams, network) => {
  if (changellyAddresses[network]) {
    const results = await post(
      buildPath(changellyAddresses[network].createTransaction),
      transactionParams
    );
    console.log(results); // todo remove dev item
    return results.result;
  }
  return Promise.resolve(-1);
};

const openOrder = orderInfo => {
  return Promise.resolve({ orderInfo });
};

const getStatus = async (orderId, network) => {
  if (changellyAddresses[network]) {
    const results = await post(buildPath(changellyAddresses[network].status), {
      orderId: orderId
    });
    return results.result;
  }
  throw Error(`Changelly does not support ${network} network`);
};

const login = () => {
  return Promise.resolve({});
};

export default {
  getCurrencies,
  getRate,
  getBatchRate,
  getMin,
  getBatchMin,
  validateAddress,
  createTransaction,
  openOrder,
  getStatus,
  login
};
