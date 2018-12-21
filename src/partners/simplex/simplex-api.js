import { host } from './config';
import { post, get } from '@/helpers/httpRequests';

const getQuote = reqObj => {
  const options = {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  };
  return post(`${host.url}/quote`, reqObj, options);
};
const getOrder = reqObj => {
  const options = {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  };
  return post(`${host.url}/order`, reqObj, options);
};
const getStatus = userId => {
  return get(`${host.url}/status/${userId}`);
};
export { getQuote, getOrder, getStatus };
