const SET_STATE = function (state, obj) {
  Object.keys(obj).forEach(item => {
    state[item] = obj[item];
  });
};
export default { SET_STATE };
