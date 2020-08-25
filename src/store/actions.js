const saveQueryVal = ({ commit }, val) => {
  commit('SET_URL_QUERY', val);
};
const setLastPath = ({ commit }, val) => {
  commit('LAST_PATH', val);
};

export default { saveQueryVal, setLastPath };
