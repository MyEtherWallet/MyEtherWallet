import Configs from '../configs';

const state = {
  localStore: true,
  addressBookStore: [],
  isMigrated: false,
  stateVersion: Configs.VERSION.addressBook
};

export default state;
