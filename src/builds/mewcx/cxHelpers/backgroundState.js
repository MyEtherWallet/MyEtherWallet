import { getMode } from '../../configs';
const chrome = window.chrome;
const useHash = getMode() === 'hash' ? '#' : '';

(function() {
  /* eslint no-console: 0 no-unused-vars: 0 */
  const eventsListeners = function(request, _, sendResponse) {
    switch (request.msg) {
      case 'fetchMewCXAccounts':
        chrome.windows.create({
          url: chrome.runtime.getURL(
            `index.html${useHash}/extension-popups/web3-detected`
          ),
          type: 'popup',
          height: 400,
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
          height: 400,
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
    chrome.tabs.sendMessage(tabs[0].id, { msg: 'injectWeb3' }, function(res) {
      console.log(res);
    });
  }
})();
