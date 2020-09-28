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
          // this.tokensData = response.data.getLatestPrices;
          this.tokensData = new Map();
          response.data.getLatestPrices.forEach(token => {
            if (token.contract) {
              this.tokensData.set(token.contract.toLowerCase(), token);
            }
          });
        }
        return this.tokensData;
      })
      .catch(error => {
        console.error('error', error);
        return error;
      });
  }
  getOwnersERC20Tokens(hash) {
    if (!this.tokensData || this.tokensData.length === 0) {
      this.getLatestPrices();
    }
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
    console.error('tokens', this.tokensData);
    tokens.forEach(token => {
      let foundToken;
      if (this.tokensData) {
        foundToken = this.tokensData.get(
          token.tokenInfo.contract.toLowerCase()
        );
      }
      console.error('the token', foundToken);
      formattedList.push({
        name: token.tokenInfo.symbol,
        subtext: token.tokenInfo.name,
        value: token.tokenInfo.name,
        balance: token.balance,
        contract: token.tokenInfo.contract,
        img: foundToken ? foundToken.image : null
      });
    });
    return formattedList;
  }
}
