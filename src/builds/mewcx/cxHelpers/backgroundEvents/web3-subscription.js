import {
  CX_SUBSCRIPTION,
  WEB3_SUBSCRIPTION_RES,
  WEB3_SUBSCRIPTION_ERR
} from '../cxEvents';
import store from '@/store';
export default async ({ event, payload }, res, next) => {
  if (event !== CX_SUBSCRIPTION) return next();
  const possibleEvents = {
    syncing: 'syncing',
    logs: 'logs',
    newHeads: 'newBlockHeaders'
  };

  const options = payload.params.length > 1 ? payload.params[1] : null;

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
  const subscription = options
    ? web3.eth.subscribe(possibleEvents[payload.params[0]], options, cb)
    : web3.eth.subscribe(possibleEvents[payload.params[0]], cb);
  subscription.on('data', res => {
    console.log(res);
    chrome.tabs.query({}, tabs => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          message: WEB3_SUBSCRIPTION_RES,
          payload: res
        });
      });
    });
  });

  subscription.on('error', res => {
    console.log(res);
    chrome.tabs.query({}, tabs => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          message: WEB3_SUBSCRIPTION_ERR,
          payload: res
        });
      });
    });
  });
};
