import ens from 'ethereum-ens';
import Web3 from 'web3';
import url from 'url';

export default class ENS {
  constructor(network) {
    const hostUrl = url.parse(network.url);
    const options = {};
    const parsedUrl = `${hostUrl.protocol}//${hostUrl.host}${
      network.port ? ':' + network.port : ''
    }${hostUrl.pathname}`;
    if (network.username !== '' && network.password !== '') {
      options['headers'] = {
        authorization: `Basic: ${btoa(
          network.username + ':' + network.password
        )}`
      };
    }
    const _web3 = new Web3(parsedUrl, options);
    this.resolver = new ens(_web3.currentProvider, network.type.ens.registry);
  }
  resolveName(name) {
    return this.resolver.resolver(name).addr();
  }
}
