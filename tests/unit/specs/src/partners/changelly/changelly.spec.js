import Changelly from '@/partners/changelly/changelly.js';
import changellyCalls from '@/partners/changelly/changelly-calls';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('changelly.js', () => {
  xit('[INTENTIONALLY SKIPPED] should instanciate a new instance', async done => {
    const changelly = new Changelly({
      network: 'ETH',
      getRateForUnit: false
    });
    await changelly.getSupportedCurrencies();
    const rate = await changelly.getRate('BRD', 'ETH', '100');
    const check = await changellyCalls.getRate('BRD', 'ETH', '100', 'ETH');

    console.log(rate); // todo remove dev item
    console.log(check); // todo remove dev item
    expect(rate).toEqual(expect.anything());
    done();
  });
});
