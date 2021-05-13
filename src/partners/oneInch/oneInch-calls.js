import { post, get } from '@/helpers/httpRequests';
import { utils } from '../helpers';
import { dexAgMethods } from './config';
import web3 from 'web3';

const HOST_URL = 'https://qa.mewwallet.dev/v2';
const GET_LIST = '/swap/list';
const GET_QUOTE = '/swap/quote';
const GET_TRADE = '/swap/trade';

function buildPath(path) {
  return HOST_URL + path;
}

const getSupportedCurrencies = async () => {
  try {
    const response = await get(`${HOST_URL}${GET_LIST}`);
    const details = response.reduce((acc, d) => {
      if (!d.contract_address) return acc;
      acc[d.symbol] = {
        address: d.contract_address.toLowerCase(),
        isEth: true,
        decimals: parseInt(d.decimals),
        img: `https://img.mewapi.io/?image=${d.icon}`,
        name: d.name ? d.name : d.symbol,
        symbol: d.symbol
      };
      return acc;
    }, {});
    const currencyDetails = details;
    const tokenDetails = details;
    return { currencyDetails, tokenDetails };
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const getPrice = async (fromToken, toToken, fromValue) => {
  try {
    const results = await get(
      `${buildPath(
        GET_QUOTE
      )}?fromContractAddress=${fromToken}&toContractAddress=${toToken}&amount=${fromValue}&exexcludeDexes=DEX_AG`
    );
    if (results.error) {
      utils.checkErrorJson(results);
    }
    return results;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const estimateGas = async (txs, from) => {
  try {
    txs = txs.map(entry => {
      if (!entry.from) entry.from = from;
      entry.value = web3.utils.toHex(entry.value);
      if (entry.gas) delete entry.gas;
      return entry;
    });
    const results = await post(
      'https://estimategas.mewapi.io',
      utils.buildPayload('eth_estimateGasList', [txs])
    );
    if (results.error) {
      utils.checkErrorJson(results, 'eth_estimateGasList');
    }
    return results.result;
  } catch (e) {
    const re = new RegExp('([0-9]+)');
    const reResult = re[Symbol.match](e.message);
    utils.handleOrThrow(e, 'eth_estimateGasList');
    if (reResult) {
      return reResult[0];
    }
  }
};

const createTransaction = async transactionParams => {
  try {
    const results = await get(
      `${buildPath(GET_TRADE)}?address=${
        transactionParams.fromAddress
      }&recipient=${
        transactionParams.toAddress
      }&dex=ONE_INCH&exchange=one_inch&platform=web&fromContractAddress=${
        transactionParams.fromTokenAddress
      }&toContractAddress=${transactionParams.toTokenAddress}&amount=${
        transactionParams.fromValue
      }`
    );
    if (results.msg === 'Unable to estimate gas price') {
      utils.checkErrorJson(results, 'eth_estimateGasList');
    }
    if (results.error) {
      utils.checkErrorJson(results);
    }

    return results;
  } catch (e) {
    utils.handleOrThrow(e);
  }
};

const excludedDexes = async () => {
  try {
    const results = await post(
      buildPath('2'),
      utils.buildPayload(dexAgMethods.excludedDexes, {})
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
  excludedDexes,
  estimateGas
};
