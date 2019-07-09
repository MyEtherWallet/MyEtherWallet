import { getMode } from '../../configs';
const chrome = window.chrome;
const useHash = getMode() === 'hash' ? '#' : '';

(function() {
  /* eslint no-console: 0 no-unused-vars: 0 */
  const eventsListeners = function(request, _, sendResponse) {
    let q;
    if (
      request.hasOwnProperty('meta') &&
      Object.keys(request.meta).length > 0
    ) {
      const arr = [];
      for (const i in request.meta) {
        if (request.meta.hasOwnProperty(i)) {
          arr.push(
            encodeURIComponent(i.replace('og:', '')) +
              '=' +
              encodeURIComponent(request.meta[i])
          );
        }
      }
      q = arr.join('&');
    } else if (
      request.hasOwnProperty('tx') &&
      Object.keys(request.tx).length > 0
    ) {
      const arr = [];
      for (const i in request.tx) {
        if (request.tx.hasOwnProperty(i)) {
          arr.push(
            encodeURIComponent(i) + '=' + encodeURIComponent(request.tx[i])
          );
        }
      }
      q = arr.join('&');
    }
    switch (request.msg) {
      case 'fetchMewCXAccounts':
        chrome.windows.create({
          url: chrome.runtime.getURL(
            `index.html${useHash}/extension-popups/account-access?connectionRequest=${request.url}&${q}`
          ),
          type: 'popup',
          height: 500,
          width: 300,
          focused: true
        });
        break;
      case 'web3Detected':
        chrome.windows.create({
          url: chrome.runtime.getURL(
            `index.html${useHash}/extension-popups/web3-detected`
          ),
          type: 'popup',
          height: 500,
          width: 300,
          focused: true
        });
        break;
      case 'confirmAndSendTx':
        chrome.windows.create({
          url: chrome.runtime.getURL(
            `index.html${useHash}/extension-popups/sign-tx?url=${request.url}&${q}`
          ),
          type: 'popup',
          height: 500,
          width: 300,
          focused: true
        });
        break;
      case 'signMsg':
        chrome.windows.create({
          url: chrome.runtime.getURL(
            `index.html${useHash}/extension-popups/sign-msg?url=${request.url}&msgToSign=${request.msgToSign}&address=${request.address}`
          ),
          type: 'popup',
          height: 500,
          width: 300,
          focused: true
        });
        break;
    }
    return true;
  };
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
    web3Injector(tabs);
  });

  chrome.tabs.onActivated.addListener(cb);
  chrome.tabs.onUpdated.addListener(cb);

  function cb() {
    chrome.runtime.onMessage.removeListener(eventsListeners);
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(
      tabs
    ) {
      web3Injector(tabs);
    });

    chrome.runtime.onMessage.addListener(eventsListeners);
  }

  function web3Injector(tabs) {
    console.log('web3 injector called');
    chrome.tabs.sendMessage(tabs[0].id, { msg: 'injectWeb3' }, function() {});
  }
})();
