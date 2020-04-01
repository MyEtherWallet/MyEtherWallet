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
  WEB3_NETWORK_CHANGE,
  WEB3_SUBSCRIBE,
  CX_SUBSCRIBE,
  WEB3_UNSUBSCRIBE,
  CX_UNSUBSCRIBE,
  WEB3_REJECT,
  WEB3_UNSUBSCRIBE_RES,
  WEB3_QUERY_GASPRICE,
  CX_GET_GASPRICE,
  WEB3_RECEIVE_GASPRICE,
  WEB3_GET_TX_COUNT,
  WEB3_RECEIVE_TX_COUNT,
  CX_GET_TX_COUNT,
  WEB3_GET_GAS,
  WEB3_RECEIVE_GAS,
  CX_GET_GAS,
  REJECT_MEW_CX_ACC
} from './cxEvents';

import xss from 'xss';

import {
  csErrors,
  csInjectedWeb3,
  csSelecctedAcc,
  csSignedMsg,
  csTxHash,
  csWebInjectionSuccessful,
  csWeb3SubscriptionError,
  csWeb3SubscribeSuccess,
  csWeb3SubscriptionSuccess
} from './contentScriptEvents';
import { extractRootDomain } from './extractRootDomain';
import MiddleWare from '@/wallets/web3-provider/middleware';

const varType = variable => {
  const isArray =
    variable && variable instanceof Array && typeof variable === 'object';
  const isObject =
    variable && variable instanceof Object && typeof variable === 'object';
  const isBoolean = variable && typeof x === 'boolean';
  const isNumber = variable && typeof x === 'number';
  const isString = variable && typeof x === 'string';

  if (isArray) return 'array';
  if (isObject) return 'object';
  if (isBoolean) return 'boolean';
  if (isNumber) return 'number';
  if (isString) return 'string';
};

const stripTags = content => {
  const insertToDom = new DOMParser().parseFromString(content, 'text/html');
  insertToDom.body.textContent.replace(/(<([^>]+)>)/gi, '') || '';
  const string = xss(insertToDom.body.textContent, {
    whitelist: [],
    stripIgnoreTag: true,
    stripIgnoreTagBody: '*'
  });
  return string;
};

const recursivePayloadStripper = val => {
  if (varType(val) === 'array') {
    return val.map(item => {
      if (varType(item) === 'object') {
        return recursivePayloadStripper(item);
      }
      return stripTags(item);
    });
  } else if (varType(val) === 'object') {
    const newObj = {};
    Object.keys(val).forEach(item => {
      if (varType(val[item]) === 'object' || varType(val[item]) === 'array') {
        newObj[item] = recursivePayloadStripper(val[item]);
      } else if (varType(val[item]) === 'string') {
        newObj[item] = stripTags(val[item]);
      } else {
        newObj[item] = val[item];
      }
    });
    return newObj;
  } else if (varType(val) === 'string') {
    return stripTags(val);
  }

  return val;
};

const chrome = window.chrome;
const extensionID = chrome.runtime.id;
let getAccountModalIsOPen = false;

chrome.storage.onChanged.addListener(function (res) {
  if (
    res.hasOwnProperty('defNetwork') &&
    res.defNetwork.hasOwnProperty('oldValue') &&
    res.defNetwork.hasOwnProperty('newValue')
  ) {
    const newValKey = JSON.parse(res.defNetwork.newValue).key;
    const oldValKey = JSON.parse(res.defNetwork.oldValue).key;
    const isNew = oldValKey !== newValKey;
    const netVersion = {
      ETH: 1,
      ROP: 3,
      RIN: 4,
      GOERLI: 5,
      KOV: 42
    };
    if (isNew) {
      const newKey = netVersion[newValKey];
      const event = new CustomEvent(
        WEB3_NETWORK_CHANGE.replace('{{id}}', extensionID),
        {
          detail: {
            payload: newKey
          }
        }
      );
      window.dispatchEvent(event, false);
    }
  }
});

chrome.runtime.onMessage.addListener(function (request, _, callback) {
  if (
    request.event === SELECTED_MEW_CX_ACC ||
    request.event === REJECT_MEW_CX_ACC
  ) {
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
  middleware.use(csWeb3SubscriptionError);
  middleware.use(csWeb3SubscribeSuccess);
  middleware.use(csWeb3SubscriptionSuccess);
  middleware.run(obj, callback);
  return true;
});

const events = {};
events[WEB3_SUBSCRIBE] = function (e) {
  const payload = recursivePayloadStripper(e.detail);
  chrome.runtime.sendMessage(
    extensionID,
    {
      event: CX_SUBSCRIBE,
      payload: payload
    },
    {}
  );
};
events[WEB3_GET_TX_COUNT] = function (e) {
  const payload = recursivePayloadStripper(e.detail);
  chrome.runtime.sendMessage(
    extensionID,
    {
      event: CX_GET_TX_COUNT,
      payload: payload
    },
    {},
    data => {
      window.dispatchEvent(
        new CustomEvent(WEB3_RECEIVE_TX_COUNT.replace('{{id}}', extensionID), {
          detail: data
        })
      );
    }
  );
};
events[WEB3_QUERY_GASPRICE] = function () {
  chrome.runtime.sendMessage(
    extensionID,
    {
      event: CX_GET_GASPRICE
    },
    {},
    data => {
      window.dispatchEvent(
        new CustomEvent(WEB3_RECEIVE_GASPRICE.replace('{{id}}', extensionID), {
          detail: data
        })
      );
    }
  );
};
events[WEB3_GET_GAS] = function (e) {
  const payload = recursivePayloadStripper(e.detail);
  chrome.runtime.sendMessage(
    extensionID,
    {
      event: CX_GET_GAS,
      payload: payload
    },
    {},
    data => {
      window.dispatchEvent(
        new CustomEvent(WEB3_RECEIVE_GAS.replace('{{id}}', extensionID), {
          detail: data
        })
      );
    }
  );
};
events[WEB3_UNSUBSCRIBE] = function (e) {
  const payload = recursivePayloadStripper(e.detail);
  chrome.runtime.sendMessage(
    extensionID,
    {
      event: CX_UNSUBSCRIBE,
      payload: payload
    },
    {},
    data => {
      if (data.error) {
        window.dispatchEvent(
          new CustomEvent(WEB3_REJECT.replace('{{id}}', extensionID), {
            detail: data.error
          })
        );
      } else {
        window.dispatchEvent(
          new CustomEvent(WEB3_UNSUBSCRIBE_RES.replace('{{id}}', extensionID), {
            detail: data.response
          })
        );
      }
    }
  );
};

events[WEB3_DETECTED] = function () {
  chrome.runtime.sendMessage(extensionID, {
    event: CX_WEB3_DETECTED
  });
};

events[WEB3_RPC_REQUEST] = function (e) {
  chrome.runtime.sendMessage(
    extensionID,
    {
      event: WEB3_RPC_REQUEST,
      payload: recursivePayloadStripper(e.detail)
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

events[WEB3_GET_ACC] = function (e) {
  const url = extractRootDomain(e.detail.from);
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

    const newPayload = {
      url: stripTags(window.location.origin),
      meta: recursivePayloadStripper(meta)
    };

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
          payload: newPayload
        });
        getAccountModalIsOPen = true;
      }
    }
  });
};

events[WEB3_SEND_TX] = function (e) {
  const newPayload = {
    tx: recursivePayloadStripper(e.detail.tx),
    url: stripTags(window.location.origin)
  };
  chrome.runtime.sendMessage(extensionID, {
    event: CX_CONFIRM_SEND_TX,
    payload: newPayload
  });
};

events[WEB3_SEND_SIGN_MSG] = function (e) {
  const newPayload = {
    msgToSign: recursivePayloadStripper(e.detail.msgToSign),
    address: stripTags(e.detail.address),
    url: stripTags(window.location.origin)
  };
  chrome.runtime.sendMessage(extensionID, {
    event: CX_SIGN_MSG,
    payload: newPayload
  });
};

Object.keys(events).forEach(item => {
  window.addEventListener(
    item.replace('{{id}}', extensionID),
    events[item],
    false
  );
});
