import NameResolver from '../index';
const nameResolver = new NameResolver({
  type: {
    ens: {
      registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
    }
  },
  url: 'https://eth.getblock.io/mainnet/',
  port: 443
});

describe('Ethereum Name Resolver', () => {
  xtest('it should ens name: myetherwallet.eth', () => {
    return nameResolver.resolveName('myetherwallet.eth').then(addr => {
      expect(addr).toBe('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D');
    });
  });
  xtest('it should cns name: myetherwallet.crypto', () => {
    return nameResolver.resolveName('myetherwallet.crypto').then(addr => {
      expect(addr).toBe('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D');
    });
  });
  xtest('it should cns name: cofounding.zil', () => {
    return nameResolver.resolveName('cofounding.zil').then(addr => {
      expect(addr).toBe('0xaA91734f90795e80751C96e682A321bB3C1A4186');
    });
  });
});
