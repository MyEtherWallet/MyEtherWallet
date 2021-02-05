import GivenProvider from './providers/given-provider';
import WSProvider from './providers/ws-provider';
import { WEB3_WALLET } from '@/modules/wallets/utils/bip44/walletTypes';
import VuexStore from '@/core/store';
class MEWProvider {
  constructor(host, options) {
    if (
      VuexStore.state.wallet &&
      VuexStore.state.wallet.identifier == WEB3_WALLET
    ) {
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
