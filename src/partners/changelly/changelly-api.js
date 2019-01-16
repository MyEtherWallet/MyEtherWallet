import debugLogger from 'debug';
import changellyCalls from './changelly-calls';
import { requireExtraId } from './config';

const errorLogger = debugLogger('v5-error:changelly-api');

const getSupportedCurrencies = async network => {
  try {
    const currencyList = await changellyCalls.getCurrencies(network);
    const currencyDetails = {};
    const tokenDetails = {};
    if (currencyList) {
      for (let i = 0; i < currencyList.length; i++) {
        if (
          !requireExtraId.includes(currencyList[i].name.toUpperCase()) &&
          currencyList[i].enabled
        ) {
          const details = {
            symbol: currencyList[i].name.toUpperCase(),
            name: currencyList[i].fullName
          };
          currencyDetails[details.symbol] = details;
          tokenDetails[details.symbol] = details;
        }
      }
      return { currencyDetails, tokenDetails };
    }
    throw Error('Changelly get supported currencies failed to return a value');
  } catch (e) {
    errorLogger(e);
  }
};

export default {
  getSupportedCurrencies
};
