import Changelly from '@/partners/changelly/changelly.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('changelly.js', () => {
  xit('[INTENTIONALLY SKIPPED] should instanciate a new instance', async () => {
    const changelly = new Changelly();

    const rate = await changelly.getRate('GNT', 'ETH', '100');
    expect(rate).toEqual(expect.anything());
  });
});
