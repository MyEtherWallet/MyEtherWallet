import axios from 'axios';
import BigNumber from 'bignumber.js';
import { v4 as uuidv4 } from 'uuid';
import erc20Abi from '../abi/erc20';
import Configs from '../configs';
import { toBN, toHex, toWei } from 'web3-utils';
import Web3Contract from 'web3-eth-contract';
import { ETH } from '@/utils/networks/types';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

const HOST_URL = 'https://swap.mewapi.io/changelly';
const REQUEST_CACHER = 'https://requestcache.mewapi.io/?url=';
class Changelly {
  constructor(web3, chain) {
    this.web3 = web3;
    this.provider = 'changelly';
    this.supportednetworks = [ETH.name];
    this.chain = chain;
  }
  isSupportedNetwork(chain) {
    return this.supportednetworks.includes(chain);
  }
  getSupportedTokens() {
    return axios
      .post(`${REQUEST_CACHER}${HOST_URL}`, {
        id: '1',
        jsonrpc: '2.0',
        method: 'getCurrenciesFull',
        params: {}
      })
      .then(response => {
        const data = response.data.result.filter(d => d.fixRateEnabled);
        return data.map(d => {
          const contract = d.contractAddress
            ? d.contractAddress.toLowerCase()
            : '0x' + d.ticker;
          return {
            contract,
            decimals: 18,
            img: `https://img.mewapi.io/?image=${d.image}`,
            name: d.fullName,
            symbol: d.ticker.toUpperCase(),
            isEth: d.contractAddress ? true : false
          };
        });
      })
      .catch(err => {
        Toast(err, {}, ERROR);
      });
  }
  isValidToAddress({ toT, address }) {
    const type = toT.symbol.toLowerCase();
    return axios
      .post(`${HOST_URL}`, {
        id: uuidv4(),
        jsonrpc: '2.0',
        method: 'validateAddress',
        params: {
          currency: type,
          address: address
        }
      })
      .then(response => {
        return response.data.result.result;
      })
      .catch(err => {
        Toast(err, {}, ERROR);
      });
  }
  getMinMaxAmount({ fromT, toT }) {
    return axios
      .post(`${HOST_URL}`, {
        id: uuidv4(),
        jsonrpc: '2.0',
        method: 'getPairsParams',
        params: [
          {
            from: fromT.symbol.toLowerCase(),
            to: toT.symbol.toLowerCase()
          }
        ]
      })
      .then(response => {
        const result = response?.data?.result[0];
        return {
          minFrom: result?.minAmountFloat,
          maxFrom: result?.maxAmountFloat
        };
      })
      .catch(err => {
        Toast(err, {}, ERROR);
      });
  }

  getQuote({ fromT, toT, fromAmount }) {
    const fromAmountBN = new BigNumber(fromAmount);
    const queryAmount = fromAmountBN.div(
      new BigNumber(10).pow(new BigNumber(fromT.decimals))
    );
    return this.getMinMaxAmount({ fromT, toT }).then(minmax => {
      if (minmax && (!minmax.minFrom || !minmax.maxFrom)) return [];
      if (
        BigNumber(minmax.minFrom).gt(queryAmount) ||
        BigNumber(minmax.maxFrom).lt(queryAmount)
      )
        return [];
      return axios
        .post(`${HOST_URL}`, {
          id: uuidv4(),
          jsonrpc: '2.0',
          method: 'getFixRateForAmount',
          params: [
            {
              from: fromT.symbol.toLowerCase(),
              to: toT.symbol.toLowerCase(),
              amountFrom: queryAmount.toString()
            }
          ]
        })
        .then(response => {
          return [
            {
              exchange: this.provider,
              provider: this.provider,
              amount:
                response.data.result[0].result === 0
                  ? '0'
                  : response.data.result[0].amountTo,
              rateId:
                response.data.result[0].result === 0
                  ? ''
                  : response.data.result[0].id,
              minFrom: minmax.minFrom,
              maxFrom: minmax.maxFrom
            }
          ];
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
    });
  }
  getTrade({ fromAddress, toAddress, quote, fromT, toT, fromAmount }) {
    const fromAmountBN = new BigNumber(fromAmount);
    const queryAmount = fromAmountBN.div(
      new BigNumber(10).pow(new BigNumber(fromT.decimals))
    );
    return axios
      .post(`${HOST_URL}`, {
        id: uuidv4(),
        jsonrpc: '2.0',
        method: 'createFixTransaction',
        params: {
          from: fromT.symbol.toLowerCase(),
          to: toT.symbol.toLowerCase(),
          refundAddress: fromAddress,
          address: toAddress,
          amountFrom: queryAmount.toString(),
          rateId: quote.rateId
        }
      })
      .then(async response => {
        if (Array.isArray(response.data.result))
          return new Error('Invalid input');
        const txObj = {
          from: fromAddress,
          data: '0x',
          value: '0x0',
          gas: '0x0'
        };
        if (fromT.contract === Configs.ETH) {
          txObj.to = response.data.result.payinAddress;
          txObj.value = toHex(
            toBN(toWei(response.data.result.amountExpectedFrom, 'ether'))
          );
        } else {
          let amountBN = new BigNumber(response.data.result.amountExpectedFrom);
          amountBN = amountBN
            .times(new BigNumber(10).pow(new BigNumber(fromT.decimals)))
            .toFixed(0);
          amountBN = toBN(amountBN);
          const erc20contract = new Web3Contract(erc20Abi);
          txObj.data = erc20contract.methods
            .transfer(response.data.result.payinAddress, amountBN)
            .encodeABI();
          txObj.to = toT.contract;
        }
        return this.web3.eth.estimateGas(txObj).then(gas => {
          txObj.gas = gas;
          return {
            provider: this.provider,
            response: response.data.result,
            transactions: [txObj]
          };
        });
      })
      .catch(err => {
        Toast(err, {}, ERROR);
      });
  }
  async executeTrade(tradeObj, confirmInfo) {
    const from = await this.web3.eth.getCoinbase();
    const gasPrice = tradeObj.gasPrice ? tradeObj.gasPrice : null;
    return new Promise((resolve, reject) => {
      this.web3.eth
        .sendTransaction(
          Object.assign(tradeObj.transactions[0], {
            from,
            gasPrice,
            handleNotification: false,
            confirmInfo: confirmInfo
          })
        )
        .on('transactionHash', hash => {
          return resolve({
            hashes: [hash],
            provider: this.provider,
            statusObj: { id: tradeObj.response.id }
          });
        })
        .catch(reject);
    });
  }
  getStatus(statusObj) {
    statusObj = statusObj.statusObj;
    return axios
      .post(`${HOST_URL}`, {
        id: uuidv4(),
        jsonrpc: '2.0',
        method: 'getStatus',
        params: {
          id: statusObj.id
        }
      })
      .then(async response => {
        const submittedStatuses = ['waiting', 'new'];
        const pendingStatuses = ['confirming', 'exchanging', 'sending'];
        const completedStatuses = ['finished'];
        const failedStatuses = ['failed', 'refunded', 'hold', 'expired'];
        const status = response.data.result;
        if (submittedStatuses.includes(status)) return Configs.status.SUBMITTED;
        if (pendingStatuses.includes(status)) return Configs.status.PENDING;
        if (completedStatuses.includes(status)) return Configs.status.COMPLETED;
        if (failedStatuses.includes(status)) return Configs.status.COMPLETED;
        return Configs.status.UNKNOWN;
      })
      .catch(err => {
        Toast(err, {}, ERROR);
      });
  }
}
export default Changelly;
