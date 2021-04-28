import BigNumber from 'bignumber.js';

import { ERC20, networkSymbols, EthereumTokens } from '../partnersConfig';

import {
  ChangellyCurrencies,
  TIME_SWAP_VALID,
  PROVIDER_NAME,
  PROXY_CONTRACT_ADDRESS,
  MARKET_IMPACT_CUTOFF
} from './config';
import oneInchCalls from './oneInch-calls';
import { Toast } from '@/helpers';

import debug from 'debug';
import { utils } from '@/partners';

const HOST_URL = 'https://qa.mewwallet.dev/v2';
const GET_LIST = '/swap/list';
const GET_QUOTE = '/swap/quote';
const GET_TRADE = '/swap/trade';
const errorLogger = debug('v5:partners-dexag');

export default class OneInch {
  constructor(props = {}) {
    this.name = OneInch.getName();
    this.baseCurrency = 'ETH';
    this.network = props.network || networkSymbols.ETH;
    this.EthereumTokens = EthereumTokens;
    this.getRateForUnit =
      typeof props.getRateForUnit === 'boolean' ? props.getRateForUnit : false;
    this.hasRates = 0;
    this.currencyDetails = props.currencies || ChangellyCurrencies;
    this.useFixed = true;
    this.tokenDetails = {};
    this.web3 = props.web3;
    this.tokenUpdate = props.tokenUpdate;
    this.approvalGasLimit = 100000;
    this.tradeGasLimitBase = 1000000;
    this.getSupportedDexes();
    this.getSupportedCurrencies(this.network);
    this.getFee();
    this.platformGasPrice = props.gasPrice || -1;
  }

  static getName() {
    return PROVIDER_NAME;
  }

  static isDex() {
    return true;
  }

  updateGasPrice(price) {
    this.platformGasPrice = price;
  }

  async getFee() {
    try {
      const contract = new this.web3.eth.Contract(
        [
          {
            constant: true,
            inputs: [],
            name: 'basisPoints',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
              }
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function'
          }
        ],
        '0xB76c291871b92A7c9e020b2511a3402A3bf0499d'
      );

      const feeAmount = await contract.methods.basisPoints().call();
      this.feeAmount = feeAmount / 10000;
    } catch (e) {
      this.feeAmount = 0.02;
    }
  }

  async getSupportedDexes() {
    this.EXCLUDED_DEXES = ['DEX_AG'];
  }

  async getSupportedCurrencies() {
    try {
      const {
        currencyDetails,
        tokenDetails
      } = await oneInchCalls.getSupportedCurrencies(this.network);
      this.currencyDetails = currencyDetails;
      this.tokenDetails = tokenDetails;
      this.tokenUpdate(tokenDetails);
      this.hasRates =
        Object.keys(this.tokenDetails).length > 0 ? this.hasRates + 1 : 0;
    } catch (e) {
      errorLogger(e);
    }
  }

  get ratesRetrieved() {
    return Object.keys(this.tokenDetails).length > 0 && this.hasRates > 0;
  }

  get isValidNetwork() {
    return this.network === networkSymbols.ETH;
  }

  setNetwork(network) {
    this.network = network;
  }

  get currencies() {
    if (this.isValidNetwork) {
      return this.currencyDetails;
    }
    return {};
  }

  validSwap(fromCurrency, toCurrency) {
    if (this.isValidNetwork) {
      return this.currencies[fromCurrency] && this.currencies[toCurrency];
    }
    return false;
  }

  calculateRate(inVal, outVal) {
    return new BigNumber(outVal).div(inVal);
  }

  async getRate(fromCurrency, toCurrency, fromValue) {
    return new Promise(resolve => {
      // // if (!isAddress(fromT.contract_address) || !isAddress(toT.contract_address))
      //   return Promise.resolve([]);
      // // const fromAmountBN = new BigNumber(fromAmount);
      // // const queryAmount = fromAmountBN.div(
      // //   new BigNumber(10).pow(new BigNumber(fromT.decimals))
      // // );
      // return axios
      //   .get(`${HOST_URL}${GET_QUOTE}`, {
      //     params: {
      //       fromContractAddress: this.getTokenAddress(),
      //       toContractAddress: this.getTokenAddress(),
      //       amount: queryAmount.toFixed(fromT.decimals),
      //       exexcludeDexes:
      //         this.provider === MEWPClass.supportedDexes.DEX_AG
      //           ? MEWPClass.supportedDexes.ONE_INCH
      //           : MEWPClass.supportedDexes.DEX_AG
      //     }
      //   })
      //   .then(response => {
      //     const quotes = response.data.quotes.filter(
      //       q => q.dex === this.provider
      //     );
      //     return quotes.map(q => {
      //       return {
      //         exchange: q.exchange,
      //         provider: this.provider,
      //         amount: q.amount
      //       };
      //     });
      //   })
      //   .catch(e => {
      //     if (e.response.data.msg === 'No matching swap pairs found') return [];
      //     return e;
      //   });
      const wrapGetRate = async () => {
        try {
          const vals = await oneInchCalls.getPrice(
            this.getTokenAddress(fromCurrency),
            this.getTokenAddress(toCurrency),
            this.convertToTokenWei(fromCurrency, fromValue)
          );
          console.log(vals); // todo remove dev item
          resolve(
            vals.quotes.map(val => {
              const notExcluded = !this.EXCLUDED_DEXES.includes(val.dex);
              const bnRate = new BigNumber(val.amount).div(fromValue).toNumber();

              console.log(bnRate.toString()); // todo remove dev item
              return {
                fromCurrency,
                toCurrency,
                provider: val.exchange,
                rate: notExcluded
                  ? bnRate
                  : 0,
                additional: { source: 'dexag' }
              };
            })
          );
        } catch (e) {
          console.log(e); // todo remove dev item
          resolve({
            fromCurrency,
            toCurrency,
            provider: this.name,
            rate: -1
          });
        }
      };
      wrapGetRate();
    });
  }

  async getRateUpdate(fromCurrency, toCurrency, fromValue, toValue, isFiat) {
    return this.getRate(fromCurrency, toCurrency, fromValue, toValue, isFiat);
  }

  getInitialCurrencyEntries(collectMapFrom, collectMapTo) {
    for (const prop in this.currencies) {
      if (this.currencies[prop])
        collectMapTo.set(prop, {
          symbol: prop,
          name: this.currencies[prop].name
        });
      collectMapFrom.set(prop, {
        symbol: prop,
        name: this.currencies[prop].name
      });
    }
  }

  getUpdatedFromCurrencyEntries(value, collectMap) {
    if (this.currencies[value.symbol]) {
      for (const prop in this.currencies) {
        if (this.currencies[prop])
          collectMap.set(prop, {
            symbol: prop,
            name: this.currencies[prop].name
          });
      }
    }
  }

  getUpdatedToCurrencyEntries(value, collectMap) {
    if (this.currencies[value.symbol]) {
      for (const prop in this.currencies) {
        if (this.currencies[prop])
          collectMap.set(prop, {
            symbol: prop,
            name: this.currencies[prop].name
          });
      }
    }
  }

  async approve(tokenAddress, spender, fromValueWei, higherGasLimit = false) {
    try {
      const methodObject = new this.web3.eth.Contract(
        ERC20,
        tokenAddress
      ).methods.approve(spender, fromValueWei);
      const values = {
        to: tokenAddress,
        value: 0,
        data: methodObject.encodeABI()
      };
      if (higherGasLimit) {
        values.gas = this.approvalGasLimit;
      }
      return values;
    } catch (e) {
      errorLogger(e);
    }
  }

  async prepareApprovals(fromAddress, proxyAddress, fromCurrency, metadata) {
    const contract = new this.web3.eth.Contract(
      [
        {
          constant: true,
          inputs: [],
          name: 'approvalHandler',
          outputs: [
            {
              name: '',
              type: 'address'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        }
      ],
      PROXY_CONTRACT_ADDRESS
    );
    const providerAddress = await contract.methods.approvalHandler().call();
    const isTokenApprovalNeeded = async (fromToken, fromAddress) => {
      if (fromToken === this.baseCurrency)
        return { approve: false, reset: false };

      const currentAllowance = await new this.web3.eth.Contract(
        ERC20,
        metadata.input.address
      ).methods
        .allowance(fromAddress, providerAddress)
        .call();

      if (new BigNumber(currentAllowance).gt(new BigNumber(0))) {
        if (
          new BigNumber(currentAllowance)
            .minus(new BigNumber(metadata.input.amount))
            .lt(new BigNumber(0))
        ) {
          return { approve: true, reset: true };
        }
        return { approve: false, reset: false };
      }
      return { approve: true, reset: false };
    };

    const { approve, reset } = await isTokenApprovalNeeded(
      fromCurrency,
      fromAddress
    );
    if (approve && reset) {
      return new Set(
        await Promise.all([
          await this.approve(metadata.input.address, providerAddress, 0),
          await this.approve(
            metadata.input.address,
            providerAddress,
            metadata.input.amount,
            true
          )
        ])
      );
    } else if (approve) {
      return new Set([
        await this.approve(
          metadata.input.address,
          providerAddress,
          metadata.input.amount
        )
      ]);
    }
    return new Set();
  }

  async generateDataForTransactions(
    providerAddress,
    swapDetails,
    tradeDetails
  ) {
    try {
      const preparedTradeTxs = await this.prepareApprovals(
        swapDetails.fromAddress,
        providerAddress,
        swapDetails.fromCurrency,
        tradeDetails.metadata
      );

      const tx = {
        to: tradeDetails.trade.to,
        data: tradeDetails.trade.data,
        value: tradeDetails.trade.value
      };

      const checkGas =
        tradeDetails.metadata.gasPrice && this.platformGasPrice > 0;

      if (checkGas) {
        const gasPrice = new BigNumber(tradeDetails.metadata.gasPrice);
        const platformGasPrice = this.web3.utils.toWei(
          this.platformGasPrice.toString(),
          'gwei'
        );

        if (gasPrice.lte(platformGasPrice)) {
          Toast.responseHandler(`gas-too-high`, 1, true);
          throw Error('abort');
        }
      }

      preparedTradeTxs.add(tx);

      if (preparedTradeTxs.size > 0) {
        const preparedAry = Array.from(preparedTradeTxs);
        const result = await oneInchCalls.estimateGas(
          preparedAry,
          swapDetails.fromAddress
        );

        if (!result) {
          throw Error('abort');
        }
        const swapTransactions = preparedAry.map((entry, index) => {
          entry.gas = result[index];
          return entry;
        });

        return [...swapTransactions];
      }

      const swapTransactions = Array.from(preparedTradeTxs);
      return [...swapTransactions];
    } catch (e) {
      errorLogger(e);
      throw e;
    }
  }

  async startSwap(swapDetails) {
    swapDetails.maybeToken = true;
    const dexToUse =
      swapDetails.provider !== 'dexag' ? swapDetails.provider : 'ag';

    const tradeDetails = await this.createTransaction(swapDetails, dexToUse);

    if (!tradeDetails) {
      throw Error('abort');
    } else if (tradeDetails.error) {
      Toast.responseHandler(tradeDetails.error, 1);
      throw Error('abort');
    }

    const marketImpact = tradeDetails.metadata.marketImpact
      ? tradeDetails.metadata.marketImpact
        ? tradeDetails.metadata.marketImpact
        : 0
      : 0;

    if (new BigNumber(marketImpact).gte(MARKET_IMPACT_CUTOFF)) {
      swapDetails.dataForInitialization = [];
      swapDetails.marketImpact = true;
      return swapDetails;
    }

    const providerAddress = tradeDetails.metadata.input
      ? tradeDetails.metadata.input.spender
        ? tradeDetails.metadata.input.spender
        : tradeDetails.trade.to
      : tradeDetails.trade.to;

    swapDetails.dataForInitialization = await this.generateDataForTransactions(
      providerAddress,
      { ...swapDetails },
      tradeDetails
    );

    swapDetails.isExitToFiat = false;
    swapDetails.providerReceives = swapDetails.fromValue;
    swapDetails.providerSends = tradeDetails.metadata.query.toAmount;
    swapDetails.providerAddress = providerAddress;

    swapDetails.parsed = {
      sendToAddress: swapDetails.providerAddress,
      status: 'pending',
      validFor: TIME_SWAP_VALID,
      timestamp: new Date(Date.now()).toISOString()
    };
    swapDetails.isDex = OneInch.isDex();
    return swapDetails;
  }

  static async getOrderStatus() {
    return 'pending';
  }

  async createTransaction(swapDetails, dexToUse) {
    return oneInchCalls.createTransaction({ dex: dexToUse, ...swapDetails });
  }

  getTokenAddress(token) {
    try {
      if (utils.stringEqual(networkSymbols.ETH, token)) {
        return this.EthereumTokens[token].contractAddress
          ? this.EthereumTokens[token].contractAddress
          : this.tokenDetails[token].address;
      }
      return this.web3.utils.toChecksumAddress(
        this.EthereumTokens[token].contractAddress
      );
    } catch (e) {
      errorLogger(e);
      throw Error(`Token [${token}] not included in dex.ag list of tokens`);
    }
  }

  getTokenDecimals(token) {
    try {
      return new BigNumber(
        this.EthereumTokens[token].decimals
          ? this.EthereumTokens[token].decimals
          : this.tokenDetails[token].decimals
      ).toNumber();
    } catch (e) {
      errorLogger(e);
      throw Error(
        `Token [${token}] not included in dex.ag network list of tokens`
      );
    }
  }

  convertToTokenBase(token, value) {
    const decimals = this.getTokenDecimals(token);
    const denominator = new BigNumber(10).pow(decimals);
    return new BigNumber(value).div(denominator).toString(10);
  }

  convertToTokenWei(token, value) {
    const decimals = this.getTokenDecimals(token);
    const denominator = new BigNumber(10).pow(decimals);
    return new BigNumber(value)
      .times(denominator)
      .integerValue(BigNumber.ROUND_DOWN)
      .toString(10);
  }
}
