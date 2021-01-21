import axios from 'axios';
import BigNumber from 'bignumber.js';
import { v4 as uuidv4 } from 'uuid';
import erc20Abi from '../abi/erc20';
import Configs from '../configs';
import { toBN, toHex, toWei } from 'web3-utils';
import Web3Contract from 'web3-eth-contract';
const HOST_URL = 'https://swap.mewapi.io/changelly';
class Changelly {
  constructor(web3) {
    this.web3 = web3;
    this.provider = 'changelly';
  }
  getSupportedTokens() {
    return axios
      .post(`${HOST_URL}`, {
        id: uuidv4(),
        jsonrpc: '2.0',
        method: 'getCurrenciesFull',
        params: {}
      })
      .then(response => {
        const data = response.data.result.filter(d => d.fixRateEnabled);
        return data.map(d => {
          const contract_address = d.contractAddress
            ? d.contractAddress.toLowerCase()
            : '0x' + d.ticker;
          return {
            contract_address,
            decimals: 18,
            img: `https://img.mewapi.io/?image=${d.image}`,
            name: d.fullName,
            symbol: d.ticker.toUpperCase()
          };
        });
      });
  }
  getQuote({ fromT, toT, fromAmount }) {
    const fromAmountBN = new BigNumber(fromAmount);
    const queryAmount = fromAmountBN.div(
      new BigNumber(10).pow(new BigNumber(fromT.decimals))
    );
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
        if (response.data.result[0].result === 0) return [];
        return [
          {
            exchange: this.provider,
            provider: this.provider,
            amount: response.data.result[0].amountTo,
            rateId: response.data.result[0].id
          }
        ];
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
        if (fromT.contract_address === Configs.ETH) {
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
          txObj.to = toT.contract_address;
        }
        return this.web3.eth.estimateGas(txObj).then(gas => {
          console.log(txObj, gas);
          txObj.gas = gas;
          return {
            provider: this.provider,
            response: response.data.result,
            transactions: [txObj]
          };
        });
      });
  }
  async executeTrade(tradeObj) {
    const from = await this.web3.eth.getCoinbase();
    const gasPrice = await this.web3.eth.getGasPrice();
    if (tradeObj.transactions.length === 1) {
      return new Promise((resolve, reject) => {
        this.web3.eth
          .sendTransaction(
            Object.assign(tradeObj.transactions[0], {
              from,
              gasPrice
            })
          )
          .on('transactionHash', hash => {
            return resolve({ hashes: [hash] });
          })
          .catch(reject);
      });
    }
    const txs = [];
    tradeObj.transactions.forEach(tx => {
      tx.from = from;
      tx.gasPrice = gasPrice;
      txs.push(tx);
    });

    return new Promise((resolve, reject) => {
      let counter = 0;
      const hashes = [];
      this.web3.mew
        .sendBatchTransactions(txs)
        .then(promises => {
          promises.forEach(p => {
            p.on('transactionHash', hash => {
              hashes.push(hash);
              counter++;
              if (counter === promises.length) resolve({ hashes });
            });
          });
        })
        .catch(reject);
    });
  }
  getStatus(statusObj) {
    let isSuccess = true;
    let isPending = false;
    const hashes = statusObj.hashes;
    const promises = [];
    hashes.forEach(h => {
      promises.push(
        this.web3.eth.getTransactionReceipt(h).then(receipt => {
          if (!receipt.blockNumber) {
            isPending = true;
            return;
          }
          if (!receipt.status) {
            isSuccess = false;
          }
        })
      );
    });
    return Promise.all(promises).then(() => {
      if (isPending)
        return {
          isPending,
          isSuccess: false
        };
      return {
        isPending,
        isSuccess
      };
    });
  }
}
export default Changelly;
