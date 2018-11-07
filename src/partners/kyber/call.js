import { post, get } from '@/helpers/httpRequests';
import { kyberTokenList, kyberTokenInfoList } from './config';

const getTokenList = network => {
  if (kyberTokenList[network]) {
    return get(kyberTokenList[network]);
  }
  return Promise.resolve({});
};

const getRates = network => {
  if (kyberTokenInfoList[network]) {
    return get(kyberTokenInfoList[network]);
  }
  return Promise.resolve({});
};

const getRate = rateDetails => {
  return post('https://127.0.0.1:9100/getExchangeAmount', rateDetails);
};

const getMin = rateDetails => {
  return post('https://127.0.0.1:9100/getMinAmount', rateDetails);
};

export { getTokenList, getRates, getRate, getMin };
