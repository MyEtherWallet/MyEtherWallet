import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { toHex } from 'web3-utils';
import wallets from '@/modules/access-wallet/common/walletTypes';

/**
 * Attempts to switch metamask network to current mew network.
 * Informs user of pending or unknown networks.
 */

/**
 * @param {Number} chainID - Chain Id for network
 * @param {String} walletType
 */
export default async (chainID, walletType) => {
  const { ethereum } = window;
  if (walletType === wallets.WEB3_WALLET) {
    try {
      if (chainID) {
        const data = { chainId: toHex(chainID) };
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [data]
        });
        return true;
      }
      return false;
    } catch (er) {
      const { message } = er;
      let toastMsg = ' ';
      let toastLink = {};
      if (message) {
        if (message.includes('pending')) {
          toastMsg =
            'There is a pending request to MetaMask, make your selection before continuing';
        } else if (message.includes('adding')) {
          toastLink = {
            title:
              "It seems like you don't have this network set up in MetaMask. Please go here to add the network.",
            url: 'https://chainlist.org/'
          };
        } else if (message.includes('rejected')) return;
        else if (message.includes("hasn't been added")) {
          toastLink = {
            title:
              "It seems like you don't have this network set up in your wallet. Please go here to add the network.",
            url: 'https://chainlist.org/'
          };
        } else {
          toastMsg = 'There was a problem processing your request to MetaMask';
        }
        Toast(toastMsg, toastLink, ERROR, 5000);
      }
      return false;
    }
  }
  return true;
};
