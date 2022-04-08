const Url =
  'https://raw.githubusercontent.com/MyEtherWallet/dynamic-data/main/articles.json';
/**
 * Update the articles array
 */
const updateArticles = async function (state) {
  const res = await fetch(Url);
  const articles = await res.json();
  state.commit('SET_ARTICLES', articles);
};

export default { updateArticles };
