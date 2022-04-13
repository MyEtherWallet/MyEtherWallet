const Url =
  'https://raw.githubusercontent.com/MyEtherWallet/dynamic-data/main/articles.json';
/**
 * Update the articles array
 */
const updateArticles = async function ({ commit }, timestamp, articleList) {
  const temp = new Date(timestamp);
  temp.setHours(72);
  if (temp.getTime() <= Date.now() || articleList.length == 0) {
    const res = await fetch(Url);
    const articles = await res.json();
    commit('SET_ARTICLES', articles);
    commit('UPDATE_TIMESTAMP', new Date().getTime());
  }
};

export default { updateArticles };
