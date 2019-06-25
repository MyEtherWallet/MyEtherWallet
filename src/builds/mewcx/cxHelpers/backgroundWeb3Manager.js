const chrome = window.chrome;
const extensionID = chrome.runtime.id;
// import cxHelpers from './cxHelpers.js';
function exec(fn) {
  console.log('injecting web3');
  const script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn + ')("' + extensionID + '")';
  document.body.appendChild(script); //run the script
  document.body.removeChild(script); //clean up
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.msg === 'injectWeb3') {
    const script = document.createElement('script');
    script.src = chrome.extension.getURL('cxWeb3.js');
    document.body.appendChild(script);
    document.body.removeChild(script);
    exec(function(id) {
      window.extensionID = id;
    });
    sendResponse({
      response: 'REEEEEEEEEEEEE! SUCCESSFULLY ADDED WEB3 MY DUDES'
    });
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

window.addEventListener(
  `web3${extensionID}getAccount`,
  function() {
    chrome.runtime.sendMessage(extensionID, {
      msg: 'fetchMewCXAccounts'
    });
  },
  false
);
