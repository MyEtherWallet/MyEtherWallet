import Swap, {
  getSupportedNetworks,
  isSupportedNetwork
} from '@enkryptcom/swap';
import { OneInch, ZEROX, ParaSwap, Changelly } from './providers';
import BigNumber from 'bignumber.js';
import Configs from './configs/providersConfigs';
import hasValidDecimals from '@/core/helpers/hasValidDecimals.js';

const WalletIdentifier = 'mew';
class MEWSwap {
  constructor(web3, chain) {
    this.providers = [
      new OneInch(web3, chain),
      new ZEROX(web3, chain),
      new ParaSwap(web3, chain),
      new Changelly(web3, chain)
    ];
    this.chain = chain;
    this.swapper = new Swap({
      network: chain,
      walletIdentifier: WalletIdentifier,
      api: web3,
      evmOptions: {
        infiniteApproval: false
      }
    });
  }
  async getAllTokens(chain = 'ETH') {
    await this.swapper.initPromise;
    const toTokens = this.swapper.getToTokens();
    const fromTokens = this.swapper.getFromTokens();
    const trending =
      toTokens.trending[chain] && toTokens.trending[chain].length > 0
        ? toTokens.trending[chain]
        : [];
    const allTokens = {
      fromTokens: fromTokens.all.map(item =>
        Object.assign({}, { contract: item.address }, item)
      ),
      toTokens: toTokens.all[chain].map(item =>
        Object.assign({}, { contract: item.address }, item)
      ),
      featured: trending.map(item =>
        Object.assign({}, { contract: item.address }, item)
      )
    };
    return allTokens;
  }
  // Receive All Quotes and trades for mew,
  // Changelly must be retrieved individually
  async getAllQuotes({ fromT, toT, fromAmount, fromAddress }) {
    const newFrom = Object.assign({}, fromT, {
      address: fromT.contract,
      logoURI: fromT.img,
      type: 'evm'
    });
    let allQuotes = [];
    if (!isSupportedNetwork(this.chain)) return [];
    const newQuotes = await this.swapper.getQuotes({
      fromAddress: fromAddress,
      toAddress: fromAddress,
      amount: BigNumber(fromAmount),
      fromToken: newFrom,
      toToken: toT
    });
    /**
     * QuoteResponse {
     *  fromTokenAmount: BN,
     *  minMax: MinMaxType,
     *  provider: String,
     *  quote: QuoteType,
     *  toTokenAmount: BN,
     *  totalGasLimit: Number
     * }
     *
     * MinMaxType {
     *  maximumFrom: BN,
     *  maximumTo: BN,
     *  minimumFrom: BN,
     *  minimumTo: BN
     * }
     *
     * QuoteType {
     *  meta: Meta,
     *  options: QuoteOptions,
     *  provider: String
     * }
     *
     * Meta {
     *  infiniteApproval: Boolean,
     *  walletIdentifier: String
     * }
     *
     * QuoteOptions {
     *  amount: BN,
     *  fromAddress: String,
     *  fromToken: TokenType,
     *  toAddress: String,
     *  toToken: TokenType
     * }
     *
     */
    return Promise.all(
      newQuotes.map(async item => {
        const swap = await this.swapper.getSwap(item.quote);
      })
    );
    const newSwap = await this.swapper.getSwap(newQuotes[0].quote);
    const providers = [this.providers[0], this.providers[3]];
    return Promise.all(
      providers.map((p, i) => {
        if (!p.isSupportedNetwork(this.chain)) return Promise.resolve();
        return i === 0
          ? p.getTrade({ fromT, toT, fromAmount, fromAddress }).then(quotes => {
              allQuotes = allQuotes.concat(quotes);
            })
          : p.getQuote({ fromT, toT, fromAmount }).then(quotes => {
              allQuotes = allQuotes.concat(quotes);
            });
      })
    ).then(() => {
      allQuotes.sort((q1, q2) => {
        // Distinguishes between changelly amount and mew
        const amount1 = q1.amount ? q1.amount : q1.minimum;
        const amount2 = q2.amount ? q2.amount : q2.minimum;
        if (new BigNumber(amount1).gt(new BigNumber(amount2))) return -1;
        return 1;
      });

      // Set Provider information
      const quotesWProvider = allQuotes.map(q => {
        const provider = q.exchange || q.provider.toLowerCase();
        if (Configs.exchangeInfo[provider]) {
          q.exchangeInfo = Configs.exchangeInfo[provider];
        } else {
          q.exchangeInfo = Configs.exchangeInfo.default;
          q.exchangeInfo.name = provider;
        }
        return q;
      });
      console.log(quotesWProvider, newSwap);
      return quotesWProvider;
    });
  }
  getQuotesForSet(arr) {
    const quotes = [];
    const provider = this.providers[3];
    for (let i = 0; i < arr.length; i++) {
      quotes.push(provider.getQuote(arr[i]));
    }
    return Promise.all(quotes);
  }

  // Get trade only for Changelly
  // Other trades can be received through getAllQuotes
  getTrade(tradeInfo) {
    if (tradeInfo.provider === 'changelly')
      return this.providers[3].getTrade(tradeInfo);
  }
  isValidToAddress(addressInfo) {
    for (const p of this.providers) {
      if (p.provider === addressInfo.provider)
        return p.isValidToAddress(addressInfo);
    }
  }
  executeTrade(tradeInfo, confirmInfo) {
    for (const p of this.providers) {
      if (p.provider === tradeInfo.provider)
        return p.executeTrade(tradeInfo, confirmInfo);
    }
  }
  getMinMaxAmount(tradeInfo) {
    for (const p of this.providers) {
      if (p.provider === tradeInfo.provider)
        return p.getMinMaxAmount(tradeInfo);
    }
  }
  getStatus(statusObj) {
    for (const p of this.providers) {
      if (p.provider === statusObj.provider) return p.getStatus(statusObj);
    }
  }
}

MEWSwap.helpers = {
  hasValidDecimals,
  getSupportedNetworks
};

export default MEWSwap;
