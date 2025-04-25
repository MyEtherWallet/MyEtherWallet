const TOP_TOKEN_INFO_LIST =
  'https://raw.githubusercontent.com/enkryptcom/dynamic-data/main/swaplists/top-tokens.json';
const TOKEN_ID_TO_CHAIN =
  'https://api.coingecko.com/api/v3/coins/list?include_platform=true';

class TrendingTokens {
  constructor() {
    this.isLoadingList = true;
    this.topTokenData = [];
    this.tokenIdToChain = [];
    this.hasError = false;
  }

  async init() {
    try {
      this.isLoadingList = true;
      const promiseResults = [
        fetch(TOKEN_ID_TO_CHAIN).then(res => res.json()),
        fetch(TOP_TOKEN_INFO_LIST).then(res => res.json())
      ];
      const results = await Promise.all(promiseResults);
      this.tokenIdToChain = results[0];
      this.topTokenData = results[1];
      this.isLoadingList = false;
    } catch (error) {
      this.hasError = true;
      console.error('Error fetching top token info:', error);
      this.isLoadingList = false;
    }
  }
  getData() {
    return {
      topTokenData: this.topTokenData,
      tokenIdToChain: this.tokenIdToChain
    };
  }
}

export default TrendingTokens;
