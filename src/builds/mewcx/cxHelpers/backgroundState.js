const chrome = window.chrome;

(function() {
  /* eslint no-undef: 0 no-console:0 */
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
    web3Injector(tabs);
  });

  chrome.tabs.onActivated.addListener(cb);
  chrome.tabs.onUpdated.addListener(cb);

  function cb() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(
      tabs
    ) {
      web3Injector(tabs);
    });
  }

  function web3Injector(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { msg: 'injectWeb3' }, function(res) {
      console.log(res);
    });
  }
})();
