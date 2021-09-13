import axios from 'axios';
import BigNumber from 'bignumber.js';
const HOST_URL = 'https://development.mewwallet.dev/v3';
const GET_LIST = '/swap/list';
const GET_QUOTE = '/swap/quote';
const GET_TRADE = '/swap/trade';
const REQUEST_CACHER = 'https://requestcache.mewapi.io/?url=';
import { isAddress } from 'web3-utils';
import Configs from '../configs';
class MEWPClass {
  constructor(providerName, web3, supportednetworks, chain) {
    this.web3 = web3;
    this.provider = providerName;
    this.supportednetworks = supportednetworks;
    this.chain = chain;
  }
  isSupportedNetwork(chain) {
    return this.supportednetworks.includes(chain);
  }
  getSupportedTokens() {
    return axios
      .get(`${REQUEST_CACHER}${HOST_URL}${GET_LIST}?chain=${this.chain}`)
      .then(response => {
        const data = response.data;
        return data.map(d => {
          return {
            contract: d.contract_address.toLowerCase(),
            isEth: true,
            decimals: parseInt(d.decimals),
            img: `https://img.mewapi.io/?image=${d.icon}`,
            name: d.name ? d.name : d.symbol,
            symbol: d.symbol,
            type: 'ERC20'
          };
        });
      });
  }
  isValidToAddress({ address }) {
    return Promise.resolve(isAddress(address));
  }
  getMinMaxAmount({ fromT }) {
    return Promise.resolve({
      minFrom: new BigNumber(1)
        .dividedBy(new BigNumber(10).pow(fromT.decimals))
        .toFixed(),
      maxFrom: new BigNumber(1)
        .multipliedBy(new BigNumber(10).pow(fromT.decimals))
        .toFixed()
    });
  }
  getQuote({ fromT, toT, fromAmount }) {
    const fromAddress = fromT.contract;
    const toAddress = toT.contract;
    if (!isAddress(fromAddress) || !isAddress(toAddress))
      return Promise.resolve([]);
    const fromAmountBN = new BigNumber(fromAmount);
    const queryAmount = fromAmountBN.div(
      new BigNumber(10).pow(new BigNumber(fromT.decimals))
    );
    return this.getMinMaxAmount({ fromT, toT }).then(minmax => {
      return axios
        .get(`${HOST_URL}${GET_QUOTE}`, {
          params: {
            fromContractAddress: fromAddress,
            toContractAddress: toAddress,
            amount: queryAmount.toFixed(fromT.decimals),
            chain: this.chain,
            excludeDexes: Object.values(MEWPClass.supportedDexes)
              .filter(dex => dex !== this.provider)
              .join(',')
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
              amount: new BigNumber(q.amount).toFixed(),
              minFrom: minmax.minFrom,
              maxFrom: minmax.maxFrom
            };
          });
        })
        .catch(e => {
          if (e.response?.data.msg === 'No matching swap pairs found')
            return [];
          return e;
        });
    });
  }
  getTrade({ fromAddress, toAddress, quote, fromT, toT, fromAmount }) {
    const contactFromAddress = fromT.contract;
    const contractToAddress = toT.contract;
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
          platform: 'web',
          fromContractAddress: contactFromAddress,
          toContractAddress: contractToAddress,
          amount: queryAmount.toFixed(fromT.decimals),
          chain: this.chain
        }
      })
      .then(response => {
        return {
          provider: this.provider,
          transactions: response.data.transactions
        };
      });
  }
  async executeTrade(tradeObj, confirmInfo) {
    const from = await this.web3.eth.getCoinbase();
    const gasPrice = tradeObj.gasPrice ? tradeObj.gasPrice : null;
    if (tradeObj.transactions.length === 1) {
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

    txs[0].confirmInfo = confirmInfo;

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
  ZERO_X: 'ZERO_X',
  ONE_INCH: 'ONE_INCH',
  PARASWAP: 'PARASWAP'
};
export default MEWPClass;
