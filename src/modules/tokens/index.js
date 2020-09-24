import { getLatestPrices, getOwnersERC20Tokens } from './tokens.graphql';

export default class Tokenslist {
  constructor(apollo) {
    this.apollo = apollo;
    // this.getLatestPrices();
    // console.error("tokens", apolloClient)
  }
  getLatestPrices() {
    console.error('in here');
    return this.apollo
      .query({
        query: getLatestPrices,
        fetchPolicy: 'cache-first'
      })
      .then(response => {
        console.error('get latet prices', response);
        if (response && response.data) {
          // this.tokensInfo = response.data.getLatestPrices;
          this.tokensInfo = new Map();
          response.data.getLatestPrices.forEach(token => {
            if (token.contract) {
              this.tokensInfo.set(token.contract.toLowerCase(), token);
            }
          });
        }
        return this.tokensInfo;
      })
      .catch(error => {
        console.error('error', error);
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
    // console.error('tokens', this.tokensInfo);
    tokens.forEach(token => {
      let foundToken;
      if (this.tokensInfo) {
        foundToken = this.tokensInfo.get(token.tokenInfo.contract);
      }
      // console.error("the token", theToken)
      formattedList.push({
        name: token.tokenInfo.symbol,
        subtext: token.tokenInfo.name,
        value: token.tokenInfo.name,
        balance: token.balance,
        contract: token.tokenInfo.contract,
        image: foundToken ? foundToken.image : null
      });
    });
    return formattedList;
  }
}
