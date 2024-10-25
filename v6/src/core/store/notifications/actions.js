const addNotification = ({ commit }, val) => {
  commit('ADD_NOTIFICATION', val);
};
const updateNotification = ({ commit }, val) => {
  commit('UPDATE_NOTIFICATION', val);
};
const deleteNotification = ({ commit }, val) => {
  commit('DELETE_NOTIFICATION', val);
};

export default {
  addNotification,
  updateNotification,
  deleteNotification
};
