const SET_DARK_LIST = async function (state, darkList) {
  state.darkList = darkList;
};
const SET_LAST_PATH = function (state, val) {
  state.path = val;
};

export default {
  SET_DARK_LIST,
  SET_LAST_PATH
};
