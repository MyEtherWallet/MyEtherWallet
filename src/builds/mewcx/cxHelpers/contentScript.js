import {
  CX_INJECT_WEB3,
  SELECTED_MEW_CX_ACC,
  MEW_TX_HASH,
  MEW_SIGNED_MSG,
  REJECT_MEW_CX_ACC,
  REJECT_MEW_TX_SIGN,
  REJECT_MEW_SIGN_MSG,
  WEB3_DETECTED,
  WEB3_GET_CURRENT_ACC,
  WEB3_RECEIVE_ACC,
  WEB3_GET_ACC,
  CX_FETCH_MEW_ACCS,
  CX_CONFIRM_SEND_TX,
  CX_SIGN_MSG,
  WEB3_SEND_TX,
  WEB3_SEND_SIGN_MSG,
  WEB3_RECEIVE_TX_HASH,
  WEB3_RECEIVE_SIGNED_MSG,
  WEB3_REJECT,
  CX_WEB3_DETECTED
} from './cxEvents';
const chrome = window.chrome;
const extensionID = chrome.runtime.id;
function exec(fn) {
  const script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn + ')("' + extensionID + '")';
  document.body.appendChild(script);
  document.body.removeChild(script);
}
/* eslint-disable-next-line */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const script = document.createElement('script');
  script.src = chrome.extension.getURL('cxWeb3.js');
  switch (request.msg) {
    case CX_INJECT_WEB3:
      document.body.appendChild(script);
      document.body.removeChild(script);
      exec(function(id) {
        window.extensionID = id;
      });
      break;

    case SELECTED_MEW_CX_ACC:
      window.dispatchEvent(
        new CustomEvent(WEB3_RECEIVE_ACC.replace('{{id}}', extensionID), {
          detail: {
            account: request.account
          }
        })
      );
      break;
    case MEW_TX_HASH:
      window.dispatchEvent(
        new CustomEvent(WEB3_RECEIVE_TX_HASH.replace('{{id}}', extensionID), {
          detail: {
            hash: request.hash
          }
        })
      );
      break;
    case MEW_SIGNED_MSG:
      window.dispatchEvent(
        new CustomEvent(
          WEB3_RECEIVE_SIGNED_MSG.replace('{{id}}', extensionID),
          {
            detail: {
              signedMsg: request.signedMsg
            }
          }
        )
      );
      break;
    case REJECT_MEW_CX_ACC:
    case REJECT_MEW_TX_SIGN:
    case REJECT_MEW_SIGN_MSG:
      window.dispatchEvent(
        new CustomEvent(WEB3_REJECT.replace('{{id}}', extensionID), {})
      );
      break;
  }

  return true;
});

window.addEventListener(
  WEB3_DETECTED.replace('{{id}}', extensionID),
  function() {
    chrome.runtime.sendMessage(extensionID, {
      msg: CX_WEB3_DETECTED
    });
  },
  false
);

window.addEventListener(
  WEB3_GET_CURRENT_ACC.replace('{{id}}', extensionID),
  function() {
    chrome.storage.sync.get('selectedAccount', function(res) {
      const event = new CustomEvent(
        WEB3_RECEIVE_ACC.replace('{{id}}', extensionID),
        {
          detail: {
            account: res['selectedAccount']
          }
        }
      );
      window.dispatchEvent(event);
    });
  }
);

window.addEventListener(
  WEB3_GET_ACC.replace('{{id}}', extensionID),
  function() {
    chrome.storage.sync.set({ selectedAccount: '' }, function() {});
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
    chrome.runtime.sendMessage(extensionID, {
      msg: CX_FETCH_MEW_ACCS,
      url: window.location.origin,
      meta: meta
    });
  },
  false
);

window.addEventListener(WEB3_SEND_TX.replace('{{id}}', extensionID), function(
  e
) {
  chrome.runtime.sendMessage(extensionID, {
    msg: CX_CONFIRM_SEND_TX,
    tx: e.detail.tx,
    url: window.location.origin
  });
});

window.addEventListener(
  WEB3_SEND_SIGN_MSG.replace('{{id}}', extensionID),
  function(e) {
    chrome.runtime.sendMessage(extensionID, {
      msg: CX_SIGN_MSG,
      msgToSign: e.detail.msgToSign,
      address: e.detail.address,
      url: window.location.origin
    });
  }
);
