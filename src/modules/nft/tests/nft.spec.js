import NFT from '../index';
const nft = new NFT({
  address: '0x7676E10eefc7311970A12387518442136ea14D81'
});
describe('Ethereum Name Resolver', () => {
  beforeAll(done => {
    nft.init().then(() => {
      done();
    });
  });
  test('it should ens name: myetherwallet.eth', () => {
    const res = nft.selectNftsToShow();
    console.log(res); // todo remove dev item
    expect(res).toEqual(expect.anything());
  });
  // test('it should cns name: myetherwallet.crypto', () => {
  //   return nameResolver.resolveName('myetherwallet.crypto').then(addr => {
  //     expect(addr).toBe('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D');
  //   });
  // });
  // test('it should cns name: cofounding.zil', () => {
  //   return nameResolver.resolveName('cofounding.zil').then(addr => {
  //     expect(addr).toBe('0xaA91734f90795e80751C96e682A321bB3C1A4186');
  //   });
  // });
});
