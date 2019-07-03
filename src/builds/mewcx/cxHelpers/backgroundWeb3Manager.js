const chrome = window.chrome;
const extensionID = chrome.runtime.id;
function exec(fn) {
  const script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn + ')("' + extensionID + '")';
  document.body.appendChild(script); //run the script
  document.body.removeChild(script); //clean up
}
/* eslint-disable-next-line */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const script = document.createElement('script');
  script.src = chrome.extension.getURL('cxWeb3.js');
  switch (request.msg) {
    case 'injectWeb3':
      document.body.appendChild(script);
      document.body.removeChild(script);
      exec(function(id) {
        window.extensionID = id;
      });
      break;

    case 'selectedMewCXAccount':
      window.dispatchEvent(
        new CustomEvent(`web3${extensionID}receiveAccount`, {
          detail: {
            account: request.account
          }
        })
      );
      break;
    case 'mewTxHash':
      window.dispatchEvent(
        new CustomEvent(`web3${extensionID}recieveTxHash`, {
          detail: {
            hash: request.hash
          }
        })
      );
      break;
    case 'rejectMewCXAccount':
    case 'rejectMewTxSign':
      window.dispatchEvent(new CustomEvent(`web3${extensionID}reject`));
      break;
  }

  return true;
});

window.addEventListener(
  `web3${extensionID}web3Detected`,
  function() {
    chrome.runtime.sendMessage(extensionID, {
      msg: 'web3Detected'
    });
  },
  false
);

window.addEventListener(`web3${extensionID}getCurrentAccount`, function() {
  chrome.storage.sync.get('selectedAccount', function(res) {
    const event = new CustomEvent(`web3${extensionID}receiveAccount`, {
      detail: {
        account: res['selectedAccount']
      }
    });
    window.dispatchEvent(event);
  });
});

window.addEventListener(
  `web3${extensionID}getAccount`,
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
      msg: 'fetchMewCXAccounts',
      url: window.location.origin,
      meta: meta
    });
  },
  false
);

window.addEventListener(`web3${extensionID}sendTx`, function(e) {
  chrome.runtime.sendMessage(extensionID, {
    msg: 'confirmAndSendTx',
    tx: e.detail.tx,
    url: window.location.origin
  });
});
