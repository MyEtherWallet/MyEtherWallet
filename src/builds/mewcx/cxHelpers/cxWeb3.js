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
// eslint-disable-next-line
console.log(`
MEW CX is no longer being maintained by the MEW team.

While it will continue to work, eventually it may develop errors and security issues since it's not being updated.

We recommend downloading our new multichain browser wallet Enkrypt here: https://www.enkrypt.com

and migrating your wallet using this guide: https://help.myetherwallet.com/en/articles/6434663-migrating-from-mew-cx-to-enkrypt
`);
