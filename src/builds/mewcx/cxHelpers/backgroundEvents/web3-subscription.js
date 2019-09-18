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
    newHeads: 'newBlockHeaders',
    newPendingTransactions: 'pendingTransactions'
  };

  const options = payload.params.length > 1 ? payload.params[1] : null;

  const chrome = window.chrome;
  const web3 = store.state.web3;
  let subscription = null;
  let timer = null;
  const cb = (e, response) => {
    console.log(e, response);
    const obj = {
      error: e ? e.message : e,
      response: response
    };
    if (!e) {
      delete obj['error'];
      chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            event: WEB3_SUBSCRIPTION_RES + 'notification',
            payload: {
              subscription: subscription.id,
              result: response
            }
          });
        });
      });
    } else {
      clearInterval(timer);
    }
    //console.log(obj, subscription);
    //res(obj);
  };

  subscription = options
    ? web3.eth.subscribe(possibleEvents[payload.params[0]], options, cb)
    : web3.eth.subscribe(possibleEvents[payload.params[0]], cb);
  timer = setInterval(() => {
    if (subscription.id) {
      clearInterval(timer);
      console.log(subscription, subscription.id);
      chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            event: WEB3_SUBSCRIPTION_RES,
            payload: subscription.id
          });
        });
      });
    }
  }, 500);
  // web3.currentProvider.send(payload, cb);

  // subscription.on('data', res => {
  //   console.log(res, subscription);
  //   chrome.tabs.query({}, tabs => {
  //     tabs.forEach(tab => {
  //       chrome.tabs.sendMessage(tab.id, {
  //         event: WEB3_SUBSCRIPTION_RES + 'notification',
  //         payload: {
  //           subscription: subscription.id,
  //           result: res
  //         }
  //       });
  //     });
  //   });
  // });

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
