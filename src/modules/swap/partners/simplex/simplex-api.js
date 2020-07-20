import { host } from './config';
import { post, get } from '@/helpers/httpRequests';
import { utils } from '../helpers';

export default class SimplexApi {
  constructor(errorHandler) {
    this.handleOrThrow = utils.handleOrThrow(errorHandler);
  }

  getCurrencies() {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    };
    return get(`${host.url}/current-currencies`, options);
  }

  getQuote(reqObj) {
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
      this.handleOrThrow(e);
    }
  }
  getOrder(reqObj) {
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
      this.handleOrThrow(e);
    }
  }

  getStatus(userId) {
    try {
      return get(`${host.url}/status/${userId}`);
    } catch (e) {
      this.handleOrThrow(e);
    }
  }

  getExchangeRates() {
    try {
      return get(`${host.url}/exchange-rates`);
    } catch (e) {
      this.handleOrThrow(e);
    }
  }
}

// export { getQuote, getOrder, getStatus, getExchangeRates, getCurrencies };
