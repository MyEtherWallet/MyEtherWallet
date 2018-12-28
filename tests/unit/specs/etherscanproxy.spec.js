import EtherscanProxy from '@/wallets/web3-provider/etherscan-proxy';
const SERVERURL = 'https://api.etherscan.io/api';
const API_KEY = 'DSH5B24BQYKD1AD8KUCDY3SAQSS6ZAU175';

describe('EtherScan Proxy', () => {
  it('should respond correct json rpc', async () => {
    // eslint-disable-next-line no-undef
    if (WITH_NETWORK) {
      expect.assertions(3);
      const ethProxy = new EtherscanProxy(SERVERURL, API_KEY);
      await ethProxy
        .request({
          method: 'eth_blockNumber',
          id: 5,
          jsonrpc: '2.0'
        })
        .then(resp => {
          expect(resp.id).toEqual(5);
          expect(resp.jsonrpc).toEqual('2.0');
          expect(resp.result.substr(0, 2)).toEqual('0x');
        });
    } else {
      expect.assertions(0);
    }
  });
});
