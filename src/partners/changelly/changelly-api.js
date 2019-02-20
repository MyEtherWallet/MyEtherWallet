import debugLogger from 'debug';
import changellyCalls from './changelly-calls';
import { requireExtraId } from './config';
import { utils } from '../helpers';

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
          if (
            currencyList[i].extraIdName === null ||
            currencyList[i].extraIdName === undefined
          ) {
            const details = {
              symbol: currencyList[i].name.toUpperCase(),
              name: currencyList[i].fullName,
              fixRateEnabled: currencyList[i].fixRateEnabled
            };
            currencyDetails[details.symbol] = details;
            tokenDetails[details.symbol] = details;
          }
        }
      }
      return { currencyDetails, tokenDetails };
    }
    throw Error('Changelly get supported currencies failed to return a value');
  } catch (e) {
    utils.handleOrThrow(e);
    errorLogger(e);
  }
};

export default {
  getSupportedCurrencies
};
