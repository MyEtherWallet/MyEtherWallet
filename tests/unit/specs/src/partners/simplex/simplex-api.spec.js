import { getQuote } from '@/partners/simplex/simplex-api.js';

describe('simplex.js', () => {
  xit('[INTENTIONALLY SKIPPED] should instanciate a new instance', async () => {
    const quote = await getQuote({
      digital_currency: 'ETH',
      fiat_currency: 'USD',
      requested_currency: 'ETH',
      requested_amount: 1
    });
    expect(quote).toEqual(expect.anything());
  });
});
