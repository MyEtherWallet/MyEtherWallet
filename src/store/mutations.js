const SET_URL_QUERY = (state, newQuery) => {
  state.queryVal = newQuery;
};

const LAST_PATH = (state, lastPath) => {
  state.lastPath = lastPath;
};
export default {
  SET_URL_QUERY,
  LAST_PATH
};
