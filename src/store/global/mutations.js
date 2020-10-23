import store from 'store';
import { Toast, ERROR } from '@/components/toast';
const SET_ONLINE_STATUS = async function (state, status) {
  state.online = status;
  if (state.online) {
    const darkList = await fetch(
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/addresses/addresses-darklist.json'
    )
      .then(res => res.json())
      .catch(e => {
        Toast(e.message, {}, ERROR);
      });
    state.darklist = {
      data: darkList,
      timestamp: Date.now()
    };
  }
};

const SET_LOCALE = function (state, { locale, save }) {
  state.locale = locale;
  if (save) store.set('locale', locale);
};

const SET_LAST_PATH = function (state, val) {
  state.path = val;
};

export default {
  SET_ONLINE_STATUS,
  SET_LOCALE,
  SET_LAST_PATH
};
