import web3 from 'web3';
import MEWProvider from '@/wallets/web3-provider';
if (
  window.hasOwnProperty('web3') &&
  !window.web3.currentProvider.hasOwnProperty('isMew')
) {
  const event = new CustomEvent(`web3${window.extensionID}web3Detected`);
  window.dispatchEvent(event);
  // chrome.windows.create({
  //   url: chrome.runtime.getURL(
  //     `index.html${cxHelpers.buildMode()}/extension-popups/web3-detected`
  //   ),
  //   type: 'popup',
  //   height: 400,
  //   width: 300,
  //   focused: true
  // });
} else if (!window.hasOwnProperty('web3')) {
  window.web3 = new web3(new MEWProvider('https://mainnet.infura.io/mew'));
  window.web3.currentProvider.isMew = true;
}
