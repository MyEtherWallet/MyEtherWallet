const Url =
  'https://raw.githubusercontent.com/MyEtherWallet/dynamic-data/main/articles.json';
/**
 * Update the articles array
 */
const updateArticles = async function ({ commit }, stateObj) {
  const temp = new Date(stateObj.timestamp);
  temp.setHours(72); // Add 3 days to saved timestamp
  if (
    temp.getTime() <= Date.now() ||
    !Object.keys(stateObj.articleList).length
  ) {
    const res = await fetch(Url);
    const articles = await res.json();
    commit('SET_ARTICLES', articles);
    commit('UPDATE_TIMESTAMP', new Date().getTime());
  }
};

export default { updateArticles };
