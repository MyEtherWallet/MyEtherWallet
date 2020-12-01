import {
  CX_SUBSCRIBE,
  WEB3_SUBSCRIBE_RES,
  WEB3_SUBSCRIBTION_RES,
  WEB3_SUBSCRIPTION_ERR
} from '../cxEvents';
import store from '@/store';

export default async ({ event, payload }, res, next) => {
  if (event !== CX_SUBSCRIBE) return next();
  const possibleEvents = {
    syncing: 'syncing',
    logs: 'logs',
    newHeads: 'newBlockHeaders',
    newPendingTransactions: 'pendingTransactions'
  };

  const options = payload.params.length > 1 ? payload.params[1] : null;

  const chrome = window.chrome;
  const web3 = store.state.main.web3;
  let subscription = null;
  let timer = null;
  const cb = (e, response) => {
    const obj = {
      error: e ? e.message : e,
      response: response
    };
    if (!e) {
      delete obj['error'];
      chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            event: WEB3_SUBSCRIBTION_RES,
            payload: {
              jsonrpc: '2.0',
              method: 'eth_subscription',
              params: {
                subscription: subscription.id,
                result: response
              }
            }
          });
        });
      });
    } else {
      clearInterval(timer);
    }
  };

  subscription = options
    ? web3.eth.subscribe(possibleEvents[payload.params[0]], options, cb)
    : web3.eth.subscribe(possibleEvents[payload.params[0]], cb);
  timer = setInterval(() => {
    if (subscription.id) {
      clearInterval(timer);
      chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            event: WEB3_SUBSCRIBE_RES,
            payload: subscription.id
          });
        });
      });
    }
  }, 500);

  subscription.on('error', res => {
    chrome.tabs.query({}, tabs => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          event: WEB3_SUBSCRIPTION_ERR,
          payload: res
        });
      });
    });
  });
};
