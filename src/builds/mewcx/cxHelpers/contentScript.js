import {
  CX_INJECT_WEB3,
  SELECTED_MEW_CX_ACC,
  MEW_TX_HASH,
  MEW_SIGNED_MSG,
  REJECT_MEW_CX_ACC,
  REJECT_MEW_TX_SIGN,
  REJECT_MEW_SIGN_MSG,
  WEB3_DETECTED,
  WEB3_RECEIVE_ACC,
  WEB3_GET_ACC,
  CX_FETCH_MEW_ACCS,
  CX_GO_TO_MAIN_PAGE,
  CX_CONFIRM_SEND_TX,
  CX_SIGN_MSG,
  WEB3_SEND_TX,
  WEB3_SEND_SIGN_MSG,
  WEB3_RECEIVE_TX_HASH,
  WEB3_RECEIVE_SIGNED_MSG,
  WEB3_REJECT,
  CX_WEB3_DETECTED
} from './cxEvents';
import cxHelpers from './cxHelpers';
import { ExtensionHelpers } from '@/helpers';
import { isAddress } from '@/helpers/addressUtils';
let getAccountModalIsOPen = false;
const chrome = window.chrome;
const extensionID = chrome.runtime.id;

const inject = fn => {
  const script = document.createElement('script');
  const vendorsScript = document.createElement('script');
  vendorsScript.src = chrome.extension.getURL(
    `${process.env.NODE_ENV === 'production' ? 'js/' : ''}vendors.js`
  );
  vendorsScript.setAttribute('id', 'mew-vendor');
  vendorsScript.onload = () => {
    script.src = chrome.extension.getURL(
      `${process.env.NODE_ENV === 'production' ? 'js/' : ''}cxWeb3.js`
    );
    script.setAttribute('id', 'mew-web3script');
    document.head.appendChild(script);
  };
  if (!elementExists('mew-vendor')) document.head.appendChild(vendorsScript);
  const idScript = document.createElement('script');
  idScript.setAttribute('type', 'application/javascript');
  idScript.setAttribute('id', 'mew-extensionId');
  idScript.textContent = '(' + fn + ')("' + extensionID + '")';
  if (!elementExists('mew-extensionId')) document.body.appendChild(idScript);
};
const elementExists = eleId => {
  return document.getElementById(eleId) !== null;
};
chrome.runtime.onMessage.addListener(function(request) {
  switch (request.event) {
    case CX_INJECT_WEB3:
      inject(function(id) {
        window.extensionID = id;
      });
      break;

    case SELECTED_MEW_CX_ACC:
      getAccountModalIsOPen = false;
      window.dispatchEvent(
        new CustomEvent(WEB3_RECEIVE_ACC.replace('{{id}}', extensionID), {
          detail: {
            payload: request.payload
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
      event: CX_WEB3_DETECTED
    });
  },
  false
);
window.addEventListener(
  WEB3_GET_ACC.replace('{{id}}', extensionID),
  // function(e) {
  //   const url = cxHelpers.extractRootDomain(e.detail.from);
  //   chrome.storage.sync.get(url, items => {
  //     const meta = {};
  //     const tags = Array.from(document.getElementsByTagName('meta')).filter(
  //       meta => {
  //         if (meta.attributes[0].nodeName === 'property') return meta;
  //       }
  //     );
  //     Array.from(document.getElementsByTagName('link')).forEach(item => {
  //       if (item.href.includes('favicon.')) meta['favicon'] = item.href;
  //     });
  //     tags.forEach(tag => {
  //       meta[tag.attributes[0].value] = tag.attributes[1].value;
  //     });
  //     if (Object.keys(items).length > 0) {
  //       window.dispatchEvent(
  //         new CustomEvent(WEB3_RECEIVE_ACC.replace('{{id}}', extensionID), {
  //           detail: {
  //             account: items[url]
  //           }
  //         })
  //       );
  //     } else {
  //       if (!getAccountModalIsOPen) {
  //         ExtensionHelpers.getAccounts(item => {
  //           const addresses = {};
  //           Object.keys(item).forEach(key => {
  //             if (isAddress(key)) {
  //               addresses[key] = item[key];
  //             }
  //           });
  //           if (Object.keys(addresses).length > 0) {
  //             chrome.runtime.sendMessage(extensionID, {
  //               event: CX_FETCH_MEW_ACCS,
  //               url: window.location.origin,
  //               meta: meta
  //             });
  //           } else {
  //             chrome.runtime.sendMessage(extensionID, {
  //               event: CX_GO_TO_MAIN_PAGE
  //             });
  //           }
  //         });
  //         getAccountModalIsOPen = true;
  //       }
  //     }
  //   });
  // },
  function(e) {
    console.log(e);
    const url = cxHelpers.extractRootDomain(e.detail.from);
    chrome.storage.sync.get(url, items => {
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
        event: CX_FETCH_MEW_ACCS,
        payload: {
          url: window.location.origin,
          meta: meta
        }
      });
    });
  },
  false
);

window.addEventListener(WEB3_SEND_TX.replace('{{id}}', extensionID), function(
  e
) {
  chrome.runtime.sendMessage(extensionID, {
    event: CX_CONFIRM_SEND_TX,
    payload: {
      tx: e.detail.tx,
      url: window.location.origin
    }
  });
});

window.addEventListener(
  WEB3_SEND_SIGN_MSG.replace('{{id}}', extensionID),
  function(e) {
    chrome.runtime.sendMessage(extensionID, {
      event: CX_SIGN_MSG,
      payload: {
        msgToSign: e.detail.msgToSign,
        address: e.detail.address,
        url: window.location.origin
      }
    });
  }
);
