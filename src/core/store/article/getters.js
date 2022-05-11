const articleList = state => {
  return state.articleStore;
};

const getArticle = state => article => {
  return state.articleStore[article];
};

export default { articleList, getArticle };
