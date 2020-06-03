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
    console.log(utils.buildPayload('eth_estimateGas', [txs])); // todo remove dev item
    const toSend = {
      jsonrpc: '2.0',
      id: 127,
      method: 'eth_estimateGas',
      params: [
        [
          {
            from: '0x7676e10eefc7311970a12387518442136ea14d81',
            to: '0xB76c291871b92A7c9e020b2511a3402A3bf0499d',
            value: '0x0',
            data:
              '0xef3f3d0b000000000000000000000000c011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000007676e10eefc7311970a12387518442136ea14d810000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000004a0000000000000000000000000000000000000000000000000000be579fd1b7eac00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000c011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f000000000000000000000000c011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f000000000000000000000000818e6fecd516ecc3849daf6845e3ec868087b755000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000818e6fecd516ecc3849daf6845e3ec868087b755000000000000000000000000000000000000000000000000000000000000016c095ea7b3000000000000000000000000818e6fecd516ecc3849daf6845e3ec868087b7550000000000000000000000000000000000000000000000000000000000000000095ea7b3000000000000000000000000818e6fecd516ecc3849daf6845e3ec868087b755ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffcb3c28c7000000000000000000000000c011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f0000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000b76c291871b92a7c9e020b2511a3402a3bf0499d800000000000016c889a28c160ce0422bb9138ff1d4e48274000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000092c1f48ad7ef2ae00801620325af996f843293a300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000440000000000000000000000000000000000000000000000000000000000000088000000000000000000000000000000000000000000000000000000000000016c0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
          }
        ]
      ]
    };
    const results = await post('https://estimategas.mewapi.io', toSend);
    // const results = await post(
    //   'https://estimategas.mewapi.io',
    //   utils.buildPayload('eth_estimateGas', [txs]),
    //   {
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // );
    // if (results.error) {
    //   utils.checkErrorJson(results);
    // }
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
