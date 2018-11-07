import Simplex from '@/partners/simplex/simplex.js';

describe('simplex.js', () => {
  xit('[INTENTIONALLY SKIPPED] should instanciate a new instance', async () => {
    const simplex = new Simplex();

    const rate = await simplex.getRate('USD', 'ETH', '100', '1');
    expect(rate).toEqual(expect.anything());
  });
});
