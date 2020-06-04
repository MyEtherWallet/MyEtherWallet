import { post } from '@/helpers/httpRequests';
import { utils } from '../helpers';
import { swapApiEndpoints } from '@/partners/partnersConfig';
import { dexAgMethods } from './config';
import web3 from 'web3';

function buildPath() {
  return swapApiEndpoints.base + swapApiEndpoints.dexag;
}

const getSupportedCurrencies = async () => {
  try {
    const currencyListRaw = await post(
      buildPath(),
      utils.buildPayload(dexAgMethods.getSupportedCurrencies, {})
    );
    const currencyList = currencyListRaw.result;
    const currencyDetails = {};
    const tokenDetails = {};
    if (currencyList) {
      for (let i = 0; i < currencyList.length; i++) {
        if (currencyList[i].address) {
          const details = {
            symbol: currencyList[i].symbol.toUpperCase(),
            name: currencyList[i].name,
            address: currencyList[i].address
          };
          currencyDetails[details.symbol] = details;
          tokenDetails[details.symbol] = details;
        }
      }
      return { currencyDetails, tokenDetails };
    }
    throw Error('Dex.ag get supported currencies failed to return a value');
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const getPrice = async (fromToken, toToken, fromValue) => {
  try {
    const results = await post(
      buildPath(),
      utils.buildPayload(dexAgMethods.getPrice, {
        fromToken,
        toToken,
        fromValue
      })
    );
    if (results.error) {
      utils.checkErrorJson(results);
    }
    return results.result;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

/*
{"jsonrpc":"2.0","id":127,"method":"eth_estimateGas","params":[[{"from":"0x43689531907482BEE7e650D18411E284A7337A66","to":"0x6b175474e89094c44da98b954eedeac495271d0f","value":"0x0","data":"0x095ea7b3000000000000000000000000ccaf8533b6822a6c17b1059dda13c168e75544a4000000000000000000000000000000000000000000000000002386f26fc10000"},{"from":"0x43689531907482BEE7e650D18411E284A7337A66","to":"0x6b175474e89094c44da98b954eedeac495271d0f","value":"0x0","data":"0x095ea7b3000000000000000000000000ccaf8533b6822a6c17b1059dda13c168e75544a4000000000000000000000000000000000000000000000000002586f26fc10000"}]]}


 */
const estimateGas = async (txs, from) => {
  try {
    txs = txs.map(entry => {
      entry.from = from;
      entry.value = web3.utils.toHex(entry.value);
      if (entry.gas) delete entry.gas;
      return entry;
    });

    const results = await post(
      'https://estimategas.mewapi.io',
      utils.buildPayload('eth_estimateGas', [txs]),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (results.error) {
      utils.checkErrorJson(results);
    }
    return results.result;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const createTransaction = async transactionParams => {
  try {
    if (transactionParams.dex === 'dexag') {
      transactionParams.dex = 'ag';
    }
    const results = await post(
      buildPath(),
      utils.buildPayload(dexAgMethods.createTransaction, { transactionParams })
    );
    if (results.error) {
      utils.checkErrorJson(results);
    }

    return results.result;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const supportedDexes = async () => {
  try {
    const results = await post(
      buildPath(),
      utils.buildPayload(dexAgMethods.supportedDexes, {})
    );
    if (results.error) {
      utils.checkErrorJson(results);
    }

    return results.result;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

export default {
  getSupportedCurrencies,
  getPrice,
  createTransaction,
  supportedDexes,
  estimateGas
};
