import { defaultTrendingList } from '@/modules/swap/handlers/configs/defaultTrendingList.js';
const SET_STATE = function (state, data) {
  const _tokenIdsToChain = data.tokenIdToChain;
  const _topTokenData = data.topTokenData;
  if (_topTokenData?.topTokens && _tokenIdsToChain) {
    const ids = Object.keys(_topTokenData.topTokens);
    const trending = [];
    const ranks = [];
    const defaultTokens = [];

    ids.forEach(id => {
      const topToken = _topTokenData.topTokens[id];
      const tokenIdToChain = _tokenIdsToChain.find(
        token => token.id.toLowerCase() === id.toLowerCase()
      );
      //Set Ethereum Tokens
      if (
        !defaultTrendingList.includes(id) &&
        tokenIdToChain &&
        tokenIdToChain.platforms &&
        tokenIdToChain.platforms['ethereum']
      ) {
        const trendingScore =
          _topTokenData?.trendingTokens && _topTokenData?.trendingTokens[id]
            ? _topTokenData?.trendingTokens[id]
            : -1;

        const _data = {
          ...topToken,
          contract: tokenIdToChain.platforms['ethereum'],
          symbol: tokenIdToChain.symbol,
          name: tokenIdToChain.name,
          trendingScore: trendingScore
        };

        if (trendingScore > -1) {
          trending.push({
            id: id,
            ..._data
          });
        }
        ranks.push({
          id: id,
          ..._data,
          trendingScore: -1
        });
      }
      //Set Default List
      else {
        const isDefaultToken = defaultTrendingList.find(
          token => token.toLowerCase() === id.toLowerCase()
        );

        if (isDefaultToken) {
          const trendingScore =
            _topTokenData?.trendingTokens && _topTokenData?.trendingTokens[id]
              ? _topTokenData?.trendingTokens[id]
              : -1;

          const _data = {
            ...topToken,
            contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            symbol: tokenIdToChain.symbol,
            name: tokenIdToChain.name
          };
          defaultTokens.push({
            id: id,
            ..._data
          });
          ranks.push({
            id: id,
            ..._data,
            trendingScore: trendingScore
          });
        }
      }
    });
    //Sort by trending score accending
    state.ethereumTrendingTokens = trending.sort((a, b) => {
      if (a.trendingScore > b.trendingScore) return 1;
      return -1;
    });
    state.ethereumTokensRank = ranks;
    state.defaultList = defaultTokens;
    state.lastLoadedTimestamp = Date.now();
  }
};

export default {
  SET_STATE
};
