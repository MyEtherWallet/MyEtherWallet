import GivenProvider from './providers/given-provider';
import WSProvider from './providers/ws-provider';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { useWalletStore } from '../../core/store/wallet';
class MEWProvider {
  constructor(host, options) {
    const { wallet, identifier } = useWalletStore();
    if (wallet.value && identifier.value === WALLET_TYPES.WEB3_WALLET) {
      return new GivenProvider(host, options);
    } else if (host && typeof host === 'string') {
      if (host.includes('etherscan')) {
        throw new Error('Not supported network type');
      } else if (/^http(s)?:\/\//i.test(host)) {
        throw new Error('Not supported network type');
      } else if (/^ws(s)?:\/\//i.test(host)) {
        return new WSProvider(host, options);
      } else if (host) {
        throw new Error('Can\'t autodetect provider for "' + host + '"');
      }
    }
  }
}
export default MEWProvider;
