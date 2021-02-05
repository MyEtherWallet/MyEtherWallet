const totalOwnedDomains = function (state) {
  return state.ensDomains ? state.ensDomains.length : 0;
};

export default {
  totalOwnedDomains
};
