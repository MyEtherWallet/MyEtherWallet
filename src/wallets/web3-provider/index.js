import HttpProvider from './providers/http-provider';
import GivenProvider from './providers/given-provider';
import { WEB3_WALLET } from '../bip44/walletTypes';
class MEWProvider {
  constructor(host, options, store, eventHub) {
    if (store.state.wallet.identifier == WEB3_WALLET) {
      return new GivenProvider(host, options, store, eventHub);
    } else if (host && typeof host === 'string') {
      if (/^http(s)?:\/\//i.test(host)) {
        return new HttpProvider(host, options, store, eventHub);
        // WS
        // } else if (/^ws(s)?:\/\//i.test(p)) {
        //   p = new this.providers.WebsocketProvider(p);
      } else if (host) {
        throw new Error('Can\'t autodetect provider for "' + host + '"');
      }
    }
  }
}
export default MEWProvider;
