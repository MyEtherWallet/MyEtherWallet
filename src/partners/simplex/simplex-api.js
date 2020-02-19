import { host } from './config';
import { post, get } from '@/helpers/httpRequests';
import { utils } from '../helpers';


const getCurrencies = () =>{
  const options = {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  };
  return get(`${host.url}/current-currencies`, options);
}


const getQuote = reqObj => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    };
    return post(`${host.url}/quote`, reqObj, options);
  } catch (e) {
    utils.handleOrThrow(e);
  }
};
const getOrder = reqObj => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    };
    return post(`${host.url}/order`, reqObj, options);
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const getStatus = userId => {
  try {
    return get(`${host.url}/status/${userId}`);
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const getExchangeRates = () => {
  try {
    return get(`${host.url}/exchange-rates`);
  } catch (e) {
    utils.handleOrThrow(e);
  }
};
export { getQuote, getOrder, getStatus, getExchangeRates, getCurrencies };
