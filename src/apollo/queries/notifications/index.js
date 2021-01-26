import { getEthTransfersV2 } from './transfers.graphql';
// import ethImg from '@/assets/images/networks/eth.svg';
import { Toast, ERROR } from '@/components/toast';
// import BigNumber from 'bignumber.js';

// const ETH_ID = 'ethereum';
export default class Transfers {
  constructor(apollo) {
    this.apollo = apollo;
  }
  getEthTransfers(owner, limit = 0, nextKey = '') {
    return this.apollo
      .query({
        query: getEthTransfersV2,
        variables: {
          owner,
          limit,
          nextKey
        }
      })
      .then(response => {
        if (response && response.data) {
          console.log(response.data.getEthTransfersV2); // todo remove dev item
          return response.data.getEthTransfersV2
        }
        return response;
      })
      .catch(error => {
        return Toast(error.message, {}, ERROR);
      });
  }
  // getOwnersERC20Tokens(hash) {
  //   if (!this.tokensData || this.tokensData.length === 0) {
  //     this.getLatestPrices();
  //   }
  //   return this.apollo
  //     .query({
  //       query: getOwnersERC20Tokens,
  //       variables: {
  //         hash: hash
  //       }
  //     })
  //     .then(response => {
  //       if (response && response.data) {
  //         return this.formatOwnersERC20Tokens(
  //           response.data.getOwnersERC20Tokens.owners
  //         );
  //       }
  //     })
  //     .catch(error => {
  //       return Toast(error.message, {}, ERROR);
  //     });
  // }
  // formatOwnersERC20Tokens(tokens) {
  //   const formattedList = [];
  //   tokens.forEach(token => {
  //     let foundToken;
  //     if (this.tokensData) {
  //       foundToken = this.tokensData.get(
  //         token.tokenInfo.contract.toLowerCase()
  //       );
  //     }
  //     const usdBalance = foundToken
  //       ? BigNumber(foundToken.balance)
  //           .times(foundToken.current_price)
  //           .toFixed(0)
  //       : 0;
  //     // need to eventually change image to check tokens network rather than just use eth network (if theres no image from coingecko)
  //     formattedList.push({
  //       name: token.tokenInfo.symbol,
  //       symbol: token.tokenInfo.symbol,
  //       subtext: token.tokenInfo.name,
  //       value: token.tokenInfo.name,
  //       balance: token.balance,
  //       contract: token.tokenInfo.contract,
  //       img: foundToken ? foundToken.image : ethImg,
  //       decimals: token.tokenInfo.decimals,
  //       market_cap: foundToken ? foundToken.market_cap : null,
  //       price_change_24h: foundToken ? foundToken.price_change_24h : null,
  //       usdBalance: usdBalance
  //     });
  //   });
  //   return formattedList;
  // }
}
