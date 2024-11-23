import axios from 'axios';
import BigNumber from 'bignumber.js';
import { v4 as uuidv4 } from 'uuid';
import erc20Abi from '../abi/erc20';
import Configs from '../configs/providersConfigs';
import { toBN, toHex, toWei } from 'web3-utils';
import { isValidAddress } from 'ethereumjs-util';

import Web3Contract from 'web3-eth-contract';
import {
  ETH,
  ROOTSTOCK,
  ETC,
  XDC,
  MOONBEAM,
  MOONRIVER,
  POL,
  AURORA,
  ARB,
  FTM,
  OP,
  COTI
} from '@/utils/networks/types';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { EventBus } from '@/core/plugins/eventBus';
import EventNames from '@/utils/web3-provider/events.js';
import { fromBase } from '@/core/helpers/unit';
import { isArray } from 'lodash';

/**
 * key is our list name
 * value is changelly name
 */
const knownChains = {
  [XDC.name]: 'xinfin network',
  [ETH.name]: ETH.name_long.toLowerCase(),
  [ROOTSTOCK.name]: ROOTSTOCK.name_long.toLowerCase(),
  [ETC.name]: 'ethereum_classic',
  [MOONBEAM.name]: MOONBEAM.currencyName.toLowerCase(),
  [MOONRIVER.name]: MOONRIVER.currencyName.toLowerCase(),
  [POL.name]: POL.name_long.toLowerCase(),
  [AURORA.name]: AURORA.name_long.toLowerCase(),
  [ARB.name]: ARB.name_long.toLowerCase(),
  [FTM.name]: FTM.name_long.toLowerCase(),
  [OP.name]: OP.name_long.toLowerCase()
};

const HOST_URL = 'https://partners.mewapi.io/changelly-v2';

const headers = {
  headers: {
    'Accept-Language': 'en-US,en;q=0.9',
    'Content-Type': 'application/json'
  }
};

const CHANGELLY_METHODS = {
  validateAddress: 'validateAddress',
  getFixRate: 'getFixRate',
  getFixRateForAmount: 'getFixRateForAmount',
  createFixTransaction: 'createFixTransaction',
  getStatus: 'getStatus'
};

const changellyCallConstructor = (id, method, params) => {
  return axios.post(
    `${HOST_URL}`,
    {
      id: id,
      jsonrpc: '2.0',
      method: method,
      params: params
    },
    headers
  );
};

class Changelly {
  constructor(web3, chain) {
    this.web3 = web3;
    this.provider = 'changelly';
    this.supportednetworks = [
      ETH.name,
      ROOTSTOCK.name,
      ETC.name,
      XDC.name,
      MOONBEAM.name,
      MOONRIVER.name,
      POL.name,
      AURORA.name,
      ARB.name,
      FTM.name,
      OP.name,
      COTI.name
    ];
    this.chain = chain;
    this.changellyTokens = [];
  }
  isSupportedNetwork(chain) {
    return this.supportednetworks.includes(chain);
  }
  getSupportedTokens() {
    return changellyCallConstructor('1', 'getCurrenciesFull', {})
      .then(response => {
        if (response.data.error) {
          Toast(response.data.error, {}, ERROR);
          return;
        }
        const data = response.data.result.filter(d => d.fixRateEnabled);
        this.changellyTokens = data.map(d => {
          const contract = d.contractAddress
            ? d.contractAddress.toLowerCase()
            : '0x' + d.ticker;

          return {
            contract,
            decimals: d.blockchainPrecision,
            img: `https://img.mewapi.io/?image=${d.image}`,
            name: d.fullName,
            symbol: d.ticker.toUpperCase(),
            isEth: d.blockchain === knownChains[this.chain],
            cgid: d.fullName.toLowerCase()
          };
        });
        return this.changellyTokens;
      })
      .catch(err => {
        Toast(err, {}, ERROR);
      });
  }
  isValidToAddress({ toT, address }) {
    const type = toT.symbol.toLowerCase();
    return changellyCallConstructor(
      uuidv4(),
      CHANGELLY_METHODS.validateAddress,
      {
        currency: type,
        address: address
      }
    )
      .then(response => {
        if (response.data.error) {
          Toast(response.data.error, {}, ERROR);
          return;
        }
        return response.data.result.result;
      })
      .catch(err => {
        Toast(err, {}, ERROR);
      });
  }
  getMinMaxAmount({ fromT, toT }) {
    return changellyCallConstructor(uuidv4(), CHANGELLY_METHODS.getFixRate, [
      {
        from: fromT.symbol.toLowerCase(),
        to: toT.symbol.toLowerCase()
      }
    ])
      .then(response => {
        if (response.data.error) {
          return { minFrom: 0, maxFrom: 0 };
        }
        const result = response?.data?.result[0];
        return {
          minFrom: result?.minFrom,
          maxFrom: result?.maxFrom
        };
      })
      .catch(err => {
        Toast(err, {}, ERROR);
      });
  }

  getQuote({ fromT, toT, fromAmount }) {
    /**
     * check chain and convert to
     * actual changelly ticker
     */
    const parsedToken = Object.assign({}, fromT, {
      symbol: this._getChangellyTicker(fromT, this.chain)
    });
    const queryAmount = fromBase(fromAmount, fromT.decimals);
    return this.getMinMaxAmount({ fromT: parsedToken, toT }).then(minmax => {
      if (!minmax || (minmax && (!minmax.minFrom || !minmax.maxFrom))) {
        return [];
      }
      if (BigNumber(queryAmount).lt(minmax.minFrom)) {
        return [
          {
            exchange: this.provider,
            provider: this.provider,
            amount: '0',
            rateId: '0',
            minFrom: minmax.minFrom,
            maxFrom: minmax.maxFrom
          }
        ];
      }
      return changellyCallConstructor(
        uuidv4,
        CHANGELLY_METHODS.getFixRateForAmount,
        [
          {
            from: parsedToken.symbol.toLowerCase(),
            to: toT.symbol.toLowerCase(),
            amountFrom: queryAmount
          }
        ]
      )
        .then(response => {
          const newResponse = response.data
            ? isArray(response.data.result)
              ? response.data.result[0]
              : response.data.result
            : null;
          // return formatted response and let ui handle error
          if (response.error || !newResponse || !newResponse.id) {
            return [
              {
                exchange: this.provider,
                provider: this.provider,
                amount: '0',
                rateId: '0',
                minFrom: minmax?.minFrom ? minmax.minFrom : 0,
                maxFrom: minmax?.maxFrom ? minmax.maxFrom : 0
              }
            ];
          }
          return [
            {
              exchange: this.provider,
              provider: this.provider,
              amount:
                newResponse.result === 0
                  ? '0'
                  : BigNumber(newResponse.amountTo)
                      .minus(newResponse.networkFee)
                      .toString(),
              rateId: newResponse.result === 0 ? '' : newResponse.id,
              minFrom: minmax?.minFrom ? minmax.minFrom : 0,
              maxFrom: minmax?.maxFrom ? minmax.maxFrom : 0
            }
          ];
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
    });
  }
  getTrade({
    fromAddress,
    toAddress,
    quote,
    fromT,
    toT,
    fromAmount,
    refundAddress
  }) {
    /**
     * check chain and convert to
     * actual changelly ticker
     */
    const actualNativeTokenSymbol = this._getChangellyTicker(fromT, this.chain);
    const queryAmount = fromBase(fromAmount, fromT.decimals);
    const providedRefundAddress = refundAddress ? refundAddress : fromAddress;
    return changellyCallConstructor(
      uuidv4(),
      CHANGELLY_METHODS.createFixTransaction,
      {
        from: actualNativeTokenSymbol.toLowerCase(),
        to: toT.symbol.toLowerCase(),
        refundAddress: providedRefundAddress,
        address: toAddress,
        amountFrom: queryAmount.toString(),
        rateId: quote.rateId
      }
    )
      .then(async response => {
        if (response.data.error) {
          Toast(response.data.error, {}, ERROR);
          return;
        }
        if (Array.isArray(response.data.result)) {
          return new Error('Invalid input');
        }
        /**
         * Differentiate between
         * in network swap vs cross chain
         * if refundAddress is truthy,
         * swap is crosschain
         */
        if (!refundAddress) {
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
            let amountBN = fromBase(
              response.data.result.amountExpectedFrom,
              fromT.decimals
            );
            amountBN = toBN(amountBN);
            const erc20contract = new Web3Contract(erc20Abi);
            txObj.data = erc20contract.methods
              .transfer(response.data.result.payinAddress, amountBN)
              .encodeABI();
            txObj.to = fromT.contract;
          }
          return this.web3.eth.estimateGas(txObj).then(gas => {
            txObj.gas = gas;
            return {
              provider: this.provider,
              response: response.data.result,
              transactions: [txObj]
            };
          });
        }
        return {
          provider: this.provider,
          response: response.data.result
        };
      })
      .catch(err => {
        Toast(err, {}, ERROR);
      });
  }
  async executeTrade(tradeObj, confirmInfo) {
    const from = await this.web3.eth.getCoinbase();
    const gasPrice = tradeObj.gasPrice ? tradeObj.gasPrice : null;
    return new Promise((resolve, reject) => {
      /**
       * directly send mainnet currency and
       * erc 20 for swap
       */
      if (
        confirmInfo.fromTokenType.symbol === ETH.currencyName ||
        confirmInfo.fromTokenType.isEth ||
        isValidAddress(confirmInfo.fromTokenType.contract)
      ) {
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
          .catch(e => reject(e));
      } else {
        // resolver for when user does non chain transaction
        const resolver = val => {
          if (val) {
            resolve({
              hashes: [confirmInfo.actualTrade],
              provider: this.provider,
              statusObj: { id: tradeObj.response.id }
            });
          } else {
            reject(new Error('User cancelled transaction!'));
          }
        };

        EventBus.$emit(
          EventNames.SHOW_CROSS_CHAIN_MODAL,
          confirmInfo,
          resolver
        );
      }
    });
  }
  getStatus(statusObj) {
    statusObj = statusObj.statusObj;
    return changellyCallConstructor(uuidv4(), CHANGELLY_METHODS.getStatus, {
      id: statusObj.id
    })
      .then(async response => {
        const pendingStatuses = [
          'confirming',
          'exchanging',
          'sending',
          'waiting',
          'new'
        ];
        if (response.data.error) {
          Toast(response.data.error, {}, ERROR);
          return;
        }
        const completedStatuses = ['finished'];
        const failedStatuses = ['failed', 'refunded', 'hold', 'expired'];
        const status = response.data.result;
        if (pendingStatuses.includes(status)) return Configs.status.PENDING;
        if (completedStatuses.includes(status)) return Configs.status.COMPLETED;
        if (failedStatuses.includes(status)) return Configs.status.FAILED;
        return Configs.status.FAILED;
      })
      .catch(err => {
        Toast(err, {}, ERROR);
      });
  }
  /**
   *
   * @param {*} token
   * {
   *  "balance": string
   *  "balancef": string
   *  "usdBalance": string
   *  "usdBalancef": string
   *  "name": string
   *  "symbol": string
   *  "subtext": string
   *  "value": string
   *  "img": string
   *  "market_cap": number
   *  "market_capf": string
   *  "price_change_percentage_24h": number
   *  "price_change_percentage_24hf": sring
   *  "price": string
   *  "pricef": string
   *  "contract": string
   *  "decimals": number
   *  "logo_url": string
   *  "isHidden": boolean,
   *  "totalBalance": string
   *  "tokenBalance": string
   * }
   * @param chain: string
   */
  _getChangellyTicker(token, chain) {
    // const knownChangellyTicker = {
    //   ETH: {
    //     ARB: 'etharb',
    //     AURORA: 'ethaurora',
    //     OP: 'ethop'
    //   },
    //   DAI: {
    //     Polygon: 'daipolygon'
    //   },
    //   USDC: {
    //     ARB: 'usdcarb',
    //     Polygon: 'usdcmatic',

    //   }
    // }
    console.log(this.changellyTokens, token);
    const findNativeToken = this.changellyTokens.find(itm => {
      if (itm.symbol === `${token.symbol}${chain}`) {
        return itm;
      }
    });
    const findViaContract = this.changellyTokens.find(item => {
      if (item.contract.toLowerCase() === token.contract.toLowerCase()) {
        return item;
      }
    });

    if (findNativeToken) {
      return findNativeToken.symbol;
    }
    if (findViaContract) {
      return findViaContract.symbol;
    }
    return token.symbol;
  }
}
export default Changelly;
