import debugLogger from 'debug';
import kyberCalls from './kyber-calls';

const errorLogger = debugLogger('v5-error:kyber-api');

const retrieveRatesFromAPI = async (
  network,
  rates = new Map(),
  tokenDetails = {}
) => {
  const apiRates = await kyberCalls.getRates(network);
  const data = Object.keys(apiRates);
  data.forEach(key => {
    const keyParts = key.split('_');
    rates.set(`${keyParts[0]}/${keyParts[1]}`, apiRates[key].currentPrice);
    if (
      apiRates[key].symbol &&
      apiRates[key].name &&
      apiRates[key].decimals &&
      apiRates[key].contractAddress
    ) {
      // otherwise the entry is invalid
      tokenDetails[apiRates[key].symbol] = {
        symbol: apiRates[key].symbol,
        name: apiRates[key].name,
        contractAddress: apiRates[key].contractAddress,
        decimals: apiRates[key].decimals
      };
    }
  });
  return { rates, tokenDetails };
};

const getSupportedTokenList = async network => {
  try {
    const tokenList = await kyberCalls.getTokenList(network);
    const tokenDetails = {};
    for (let i = 0; i < tokenList.length; i++) {
      if (
        tokenList[i].symbol &&
        tokenList[i].name &&
        tokenList[i].decimals &&
        tokenList[i].contractAddress
      ) {
        // otherwise the entry is invalid
        const symbol = tokenList[i].symbol.toUpperCase();
        tokenDetails[symbol] = tokenList[i];
      }
    }
    return tokenDetails;
  } catch (e) {
    errorLogger(e);
  }
};

export default { retrieveRatesFromAPI, getSupportedTokenList };
