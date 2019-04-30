import Wallet from 'ethereumjs-wallet';
import ThirdPartyWallets from 'ethereumjs-wallet/thirdparty';
import parseTokensHex from './parseTokensHex';
import Configs from './configs';
import Blockies from './blockies';
import Misc from './misc';
import CreateJsonWallet from './createJsonWallet';
import Toast from './responseHandler';

Wallet.ThirdParty = ThirdPartyWallets;
export {
  Wallet,
  Configs,
  parseTokensHex,
  Blockies,
  Misc,
  CreateJsonWallet,
  Toast
};
