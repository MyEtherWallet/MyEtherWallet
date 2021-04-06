import axios from 'axios';
import BigNumber from 'bignumber.js';
const HOST_URL = 'https://qa.mewwallet.dev/v2';
const GET_LIST = '/swap/list';
const GET_QUOTE = '/swap/quote';
const GET_TRADE = '/swap/trade';
import { isAddress } from 'web3-utils';
import Configs from '../configs';
class MEWPClass {
  constructor(providerName, web3) {
    this.web3 = web3;
    this.provider = providerName;
  }
  getSupportedTokens() {
    return axios.get(`${HOST_URL}${GET_LIST}`).then(response => {
      const data = response.data;
      return data.map(d => {
        return {
          contract_address: d.contract_address.toLowerCase(),
          isEth: true,
          decimals: parseInt(d.decimals),
          img: `https://img.mewapi.io/?image=${d.icon}`,
          name: d.name ? d.name : d.symbol,
          symbol: d.symbol
        };
      });
    });
  }
  isValidToAddress({ address }) {
    return Promise.resolve(isAddress(address));
  }
  getQuote({ fromT, toT, fromAmount }) {
    if (!isAddress(fromT.contract_address) || !isAddress(toT.contract_address))
      return Promise.resolve([]);
    const fromAmountBN = new BigNumber(fromAmount);
    const queryAmount = fromAmountBN.div(
      new BigNumber(10).pow(new BigNumber(fromT.decimals))
    );
    return axios
      .get(`${HOST_URL}${GET_QUOTE}`, {
        params: {
          fromContractAddress: fromT.contract_address,
          toContractAddress: toT.contract_address,
          amount: queryAmount.toFixed(fromT.decimals),
          exexcludeDexes:
            this.provider === MEWPClass.supportedDexes.DEX_AG
              ? MEWPClass.supportedDexes.ONE_INCH
              : MEWPClass.supportedDexes.DEX_AG
        }
      })
      .then(response => {
        const quotes = response.data.quotes.filter(
          q => q.dex === this.provider
        );
        return quotes.map(q => {
          return {
            exchange: q.exchange,
            provider: this.provider,
            amount: q.amount
          };
        });
      })
      .catch(e => {
        if (e.response.data.msg === 'No matching swap pairs found') return [];
        return e;
      });
  }
  getTrade({ fromAddress, toAddress, quote, fromT, toT, fromAmount }) {
    const fromAmountBN = new BigNumber(fromAmount);
    const queryAmount = fromAmountBN.div(
      new BigNumber(10).pow(new BigNumber(fromT.decimals))
    );
    return axios
      .get(`${HOST_URL}${GET_TRADE}`, {
        params: {
          address: fromAddress,
          recipient: toAddress,
          dex: this.provider,
          exchange: quote.exchange,
          platform: 'ios',
          fromContractAddress: fromT.contract_address,
          toContractAddress: toT.contract_address,
          amount: queryAmount.toFixed(fromT.decimals)
        }
      })
      .then(response => {
        return {
          provider: this.provider,
          transactions: response.data.transactions
        };
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
              gasPrice,
              handleNotification: false
            })
          )
          .on('transactionHash', hash => {
            return resolve({
              provider: this.provider,
              statusObj: { hashes: [hash] },
              hashes: [hash]
            });
          })
          .catch(reject);
      });
    }
    const txs = [];
    tradeObj.transactions.forEach(tx => {
      tx.from = from;
      tx.gasPrice = gasPrice;
      tx.handleNotification = false;
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
              if (counter === promises.length)
                resolve({
                  provider: this.provider,
                  hashes,
                  statusObj: { hashes }
                });
            });

            p.on('error', err => {
              hashes.push(err);
              counter++;
              if (counter === promises.length)
                reject({
                  provider: this.provider,
                  hashes,
                  statusObj: { hashes }
                });
            });
          });
        })
        .catch(reject);
    });
  }
  getStatus(statusObj) {
    let isSuccess = true;
    let isPending = false;
    const hashes = statusObj.statusObj.hashes;
    const promises = [];
    hashes.forEach(h => {
      promises.push(
        this.web3.eth.getTransactionReceipt(h).then(receipt => {
          if (!receipt || (receipt && !receipt.blockNumber)) {
            isPending = true;
            return;
          }
          if (receipt && !receipt.status) {
            isSuccess = false;
          }
        })
      );
    });
    return Promise.all(promises).then(() => {
      if (isPending) return Configs.status.PENDING;
      if (!isSuccess) return Configs.status.FAILED;
      if (isSuccess) return Configs.status.COMPLETED;
      return Configs.status.UNKNOWN;
    });
  }
}
MEWPClass.supportedDexes = {
  DEX_AG: 'DEX_AG',
  ONE_INCH: 'ONE_INCH'
};
export default MEWPClass;
