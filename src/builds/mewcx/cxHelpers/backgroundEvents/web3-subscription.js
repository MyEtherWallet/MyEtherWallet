import { CX_SUBSCRIPTION } from '../cxEvents';
import store from '@/store';
export default async ({ event, payload }, res, next) => {
  if (event !== CX_SUBSCRIPTION) return next();
  const chrome = window.chrome;
  const web3 = store.state.web3;
  const cb = (e, response) => {
    const obj = {
      error: e ? e.message : e,
      response: response
    };
    if (!e) {
      delete obj['error'];
    }

    res(obj);
  };
  // web3.currentProvider.send(payload, cb);
  const subscription = web3.eth.subscribe(payload.type, payload.params, cb);
  subscription.on('data', res => {
    chrome.tabs.query({}, tabs => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          message: '',
          payload: res
        });
      });
    });
  });
};
