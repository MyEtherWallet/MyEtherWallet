import { request } from './helpers/provider';

export const getQuote = async (url, params) => {
  return request({
    url: `${url}/pegout/getQuotes`,
    method: 'POST',
    body: params
  });
};

export const acceptQuote = async (url, params, headers) => {
  return request({
    url: `${url}/pegout/acceptQuote`,
    method: 'POST',
    body: params,
    headers: headers
  });
};
