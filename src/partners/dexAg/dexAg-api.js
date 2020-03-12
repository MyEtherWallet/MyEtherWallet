import debugLogger from 'debug';
import { post, get } from '@/helpers/httpRequests';
import { requireExtraId } from './config';
import { utils } from '../helpers';

const errorLogger = debugLogger('v5-error:changelly-api');

const getSupportedCurrencies = async network => {
  try {
    const currencyList = await get('https://api-v2.dex.ag/token-list-full');
    const currencyDetails = {};
    const tokenDetails = {};
    if (currencyList) {
      for (let i = 0; i < currencyList.length; i++) {
        const details = {
          symbol: currencyList[i].symbol.toUpperCase(),
          name: currencyList[i].name,
          address: currencyList[i].address
        };
        currencyDetails[details.symbol] = details;
        tokenDetails[details.symbol] = details;
      }
      return { currencyDetails, tokenDetails };
    }
    throw Error('Dex.ag get supported currencies failed to return a value');
  } catch (e) {
    utils.handleOrThrow(e);
    errorLogger(e);
  }
};

export default {
  getSupportedCurrencies
};
