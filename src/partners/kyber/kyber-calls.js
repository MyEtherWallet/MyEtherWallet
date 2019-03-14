import { get } from '@/helpers/httpRequests';
import { kyberTokenList, kyberTokenInfoList } from './config';
import { utils } from '../helpers';

const getTokenList = async network => {
  try {
    if (kyberTokenList[network]) {
      return get(kyberTokenList[network]);
    }
    return Promise.resolve({});
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const getRates = async network => {
  try {
    if (kyberTokenInfoList[network]) {
      return get(kyberTokenInfoList[network]);
    }
    return Promise.resolve({});
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

export default { getTokenList, getRates };
