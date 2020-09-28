import HttpProvider from './providers/http-provider';
import GivenProvider from './providers/given-provider';
import WSProvider from './providers/ws-provider';
import EtherscanProvider from './providers/etherscan-provider';
import { WEB3_WALLET } from '../bip44/walletTypes';
class MEWProvider {
  constructor(host, options, store, eventHub) {
    if (store.state.wallet && store.state.wallet.identifier == WEB3_WALLET) {
      return new GivenProvider(host, options, store, eventHub);
    } else if (host && typeof host === 'string') {
      if (host.includes('etherscan')) {
        return new EtherscanProvider(host, options, store, eventHub);
      } else if (/^http(s)?:\/\//i.test(host)) {
        return new HttpProvider(host, options, store, eventHub);
      } else if (/^ws(s)?:\/\//i.test(host)) {
        return new WSProvider(host, options, store, eventHub);
      } else if (host) {
        throw new Error('Can\'t autodetect provider for "' + host + '"');
      }
    }
  }
}
export default MEWProvider;
