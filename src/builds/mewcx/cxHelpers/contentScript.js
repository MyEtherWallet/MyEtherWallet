import {
  SELECTED_MEW_CX_ACC,
  WEB3_DETECTED,
  WEB3_RECEIVE_ACC,
  WEB3_GET_ACC,
  CX_FETCH_MEW_ACCS,
  CX_CONFIRM_SEND_TX,
  CX_SIGN_MSG,
  WEB3_SEND_TX,
  WEB3_SEND_SIGN_MSG,
  CX_WEB3_DETECTED,
  WEB3_RPC_REQUEST,
  WEB3_CHAIN_CHANGE,
  WEB3_NETWORK_CHANGE
} from './cxEvents';
import {
  csErrors,
  csInjectedWeb3,
  csSelecctedAcc,
  csSignedMsg,
  csTxHash,
  csWebInjectionSuccessful
} from './events';
import helpers from './helpers';
import MiddleWare from '@/wallets/web3-provider/middleware';
const chrome = window.chrome;
const extensionID = chrome.runtime.id;
let getAccountModalIsOPen = false;

chrome.storage.onChanged.addListener(function(res) {
  Object.keys(res).forEach(val => {
    const eventName = val.includes('ChainID')
      ? WEB3_CHAIN_CHANGE.replace('{{id}}', extensionID)
      : val.includes('NetVersion')
      ? WEB3_NETWORK_CHANGE.replace('{{id}}', extensionID)
      : '';

    if (eventName !== '') {
      if (res[val].hasOwnProperty('oldValue')) {
        if (res[val].oldValue !== res[val].newValue) {
          const event = new CustomEvent(eventName, {
            detail: {
              payload: res[val].newValue
            }
          });
          window.dispatchEvent(event, false);
        }
      }
    }
  });
});

chrome.runtime.onMessage.addListener(function(request, _, callback) {
  if (request.event === SELECTED_MEW_CX_ACC) {
    getAccountModalIsOPen = false;
  }
  const obj = {
    event: request.event,
    payload: request.payload,
    id: extensionID
  };
  const middleware = new MiddleWare();
  middleware.use(csErrors);
  middleware.use(csInjectedWeb3);
  middleware.use(csSelecctedAcc);
  middleware.use(csSignedMsg);
  middleware.use(csTxHash);
  middleware.use(csWebInjectionSuccessful);
  middleware.run(obj, callback);
  return true;
});

const events = {};
events[WEB3_DETECTED] = function() {
  chrome.runtime.sendMessage(extensionID, {
    event: CX_WEB3_DETECTED
  });
};

events[WEB3_RPC_REQUEST] = function(e) {
  chrome.runtime.sendMessage(
    extensionID,
    {
      event: WEB3_RPC_REQUEST,
      payload: e.detail
    },
    {},
    data => {
      if (data.error) {
        window.dispatchEvent(
          new CustomEvent(`${WEB3_RPC_REQUEST}-${e.detail.id}-err`, {
            detail: data.error
          })
        );
      } else {
        window.dispatchEvent(
          new CustomEvent(`${WEB3_RPC_REQUEST}-${e.detail.id}-res`, {
            detail: data.response
          })
        );
      }
    }
  );
};

events[WEB3_GET_ACC] = function(e) {
  const url = helpers.extractRootDomain(e.detail.from);
  chrome.storage.sync.get(url, storedAccounts => {
    const meta = {};
    const tags = Array.from(document.getElementsByTagName('meta')).filter(
      meta => {
        if (meta.attributes[0].nodeName === 'property') return meta;
      }
    );
    Array.from(document.getElementsByTagName('link')).forEach(item => {
      if (item.href.includes('favicon.')) meta['favicon'] = item.href;
    });
    tags.forEach(tag => {
      meta[tag.attributes[0].value] = tag.attributes[1].value;
    });
    if (Object.keys(storedAccounts).length > 0) {
      window.dispatchEvent(
        new CustomEvent(WEB3_RECEIVE_ACC.replace('{{id}}', extensionID), {
          detail: {
            payload: [storedAccounts[url]]
          }
        })
      );
    } else {
      if (!getAccountModalIsOPen) {
        chrome.runtime.sendMessage(extensionID, {
          event: CX_FETCH_MEW_ACCS,
          payload: {
            url: window.location.origin,
            meta: meta
          }
        });
        getAccountModalIsOPen = true;
      }
    }
  });
};

events[WEB3_SEND_TX] = function(e) {
  chrome.runtime.sendMessage(extensionID, {
    event: CX_CONFIRM_SEND_TX,
    payload: {
      tx: e.detail.tx,
      url: window.location.origin
    }
  });
};

events[WEB3_SEND_SIGN_MSG] = function(e) {
  chrome.runtime.sendMessage(extensionID, {
    event: CX_SIGN_MSG,
    payload: {
      msgToSign: e.detail.msgToSign,
      address: e.detail.address,
      url: window.location.origin
    }
  });
};

Object.keys(events).forEach(item => {
  window.addEventListener(
    item.replace('{{id}}', extensionID),
    events[item],
    false
  );
});
