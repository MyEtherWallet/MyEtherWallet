import { post, get } from '@/helpers/httpRequests';
import { bityEndpoints } from './config';

const getRates = () => {
  return get(bityEndpoints.rates);
};

const openOrder = orderInfo => {
  return post(`${bityEndpoints.server}/order`, orderInfo);
};

const getStatus = orderInfo => {
  return post(`${bityEndpoints.server}/status`, orderInfo);
};

const login = () => {
  post(`${bityEndpoints.server}/login`, {}).then(data => {
    return data.token;
  });
};

export { getRates, openOrder, getStatus, login };
