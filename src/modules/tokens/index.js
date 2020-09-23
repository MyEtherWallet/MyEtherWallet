import { getLatestPrices, getOwnersERC20Tokens } from './tokens.graphql';

export default class Tokenslist {
  constructor(apollo) {
    this.apollo = apollo;
  }
  getLatestPrices() {
    this.apollo
      .query({
        query: getLatestPrices
      })
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  }
  getOwnersERC20Tokens(hash) {
    return this.apollo
      .query({
        query: getOwnersERC20Tokens,
        variables: {
          hash: hash
        }
      })
      .then(response => {
        console.error('response', response);
        if (response && response.data) {
          return this.formatOwnersERC20Tokens(
            response.data.getOwnersERC20Tokens.owners
          );
        }
      })
      .catch(error => {
        return error;
      });
  }
  formatOwnersERC20Tokens(tokens) {
    const formattedList = [];
    console.error('tokens', tokens);
    tokens.forEach(token => {
      formattedList.push({
        name: token.tokenInfo.symbol,
        subtext: token.tokenInfo.name,
        value: token.tokenInfo.name,
        balance: token.balance,
        contract: token.tokenInfo.contract
      });
    });
    return formattedList;
  }
}
