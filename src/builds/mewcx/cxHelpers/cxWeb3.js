// eslint-disable-next-line
// import MewCxProvider from '@/wallets/web3-provider/providers/mew-cx-web3';
// import { WEB3_DETECTED } from './cxEvents';
// const ethereumProvider = new MewCxProvider().setMaxListeners(0); // setting to 0 to remove listener warning
// if (
//   (window.hasOwnProperty('web3') && window.web3) ||
//   (window.hasOwnProperty('ethereum') && window.ethereum)
// ) {
//   if (
//     (window.web3 &&
//       window.web3.currentProvider &&
//       window.web3.currentProvider.isMew) ||
//     (window.ethereum && window.ethereum.isMew)
//   ) {
//     window.dispatchEvent(event);
//   }
// } else {
//   // eslint-disable-next-line
//   console.info('MEWCX Web3 provider injected');
//   window.ethereum = ethereumProvider;
// }

console.log(`
MEW CX will no longer be supported on October 4th, 2022

Hello user! MEW will be sunsetting MEW CX in favor of our new browser extension wallet Enkrypt. We highly recommend downloading Enkrypt from the Chrome Store and migrating your assets.

Enkrypt is taking the lessons learned from MEW CX, improving upon them, as well as embracing the multichain future. 

Again, after October 4th, 2022, MEW CX will no longer be maintained or updated by our developers.

Download Enkrypt here: https://www.enkrypt.com

We have also creat guide for migrating your assets into Enkrypt: https://help.myetherwallet.com/en/articles/6434663-migrating-from-mew-cx-to-enkrypt
`);
