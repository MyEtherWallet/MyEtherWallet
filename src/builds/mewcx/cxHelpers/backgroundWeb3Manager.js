const chrome = window.chrome;
import cxHelpers from './cxHelpers.js';
function exec(fn) {
  const script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn + ')("' + chrome.runtime.id + '")';
  document.body.appendChild(script); //run the script
  document.body.removeChild(script); //clean up
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.msg === 'injectWeb3') {
    const script = document.createElement('script');
    script.src = chrome.extension.getURL('cxWeb3.js');
    document.body.appendChild(script);
    document.body.removeChild(script);
    exec(function(extensionID) {
      window.extensionID = extensionID;
    });
    sendResponse({
      response: 'REEEEEEEEEEEEE! SUCCESSFULLY ADDED WEB3 MY DUDES'
    });
  }

  return true;
});

window.addEventListener(`web3${window.extensionID}getAccount`, function(e) {
  console.log(`web3${window.extensionID}getAccount`, e);
  chrome.windows.create({
    url: chrome.runtime.getURL(
      `index.html${cxHelpers.buildMode()}/extension-popups/web3-detected`
    ),
    type: 'popup',
    height: 400,
    width: 300,
    focused: true
  });
});
