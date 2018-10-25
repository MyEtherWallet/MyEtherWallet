import { post, get } from '@/helpers/httpRequests';
import { changellyAddresses } from './config';
import { swapServer } from '../config';

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

const getRate = async (rateDetails, network) => {
  if (changellyAddresses[network]) {
    const results = await post(
      buildPath(changellyAddresses[network].rate),
      rateDetails
    );
    return results.result;
  }
  return Promise.resolve(-1);
};

const getMin = async (rateDetails, network) => {
  if (changellyAddresses[network]) {
    const results = await post(
      buildPath(changellyAddresses[network].min),
      rateDetails
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
      orderid: orderId
    });
    return results.result;
  }
  return Promise.resolve(-1);
};

const login = () => {
  return Promise.resolve({});
};

export {
  getCurrencies,
  getRate,
  getMin,
  validateAddress,
  createTransaction,
  openOrder,
  getStatus,
  login
};
