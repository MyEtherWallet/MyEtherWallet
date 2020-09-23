import { getLatestPrices } from './getLatestPrices.graphql';

export default class Tokenslist {
  constructor(network) {
    this.network = network;
    console.error("this", this.$apollo)
    this.getLatestPrices();
  }

  getLatestPrices() {
    this.$apollo
      .query({
        query: getLatestPrices
      })
      .then(response => {
        console.error('response', response)
      })
      .catch(error => {
        throw error;
      });
  }
}
