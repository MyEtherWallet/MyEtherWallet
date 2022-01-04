/**
 * Sets address book
 * @param Array addressBook
 */
const setAddressBook = function ({ commit }, addressBook) {
  commit('SET_ADDRESS_BOOK', addressBook);
};

const setMigrated = function ({ commit }, isMigrated) {
  commit('SET_MIGRATED', isMigrated);
};

export default { setAddressBook, setMigrated };
