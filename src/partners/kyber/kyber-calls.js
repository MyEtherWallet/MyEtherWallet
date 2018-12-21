import { get } from '@/helpers/httpRequests';
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

export default { getTokenList, getRates };
