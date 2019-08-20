import Changelly from '@/partners/changelly/changelly.js';
import changellyCalls from '@/partners/changelly/changelly-calls';
import BigNumber from 'bignumber.js';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('changelly.js', () => {
  let changelly;
  const percentVarianceAllowed = 0.009;
  beforeAll(() => {
    changelly = new Changelly({ network: 'ETH' });
  });
  it('Expect market rate calculated value to be within 1% of exact value (to ETH)', async () => {
    const currency = Object.values(changelly.currencies).find(
      entry => !entry.fixRateEnabled
    );

    const fromCurrency = currency.symbol;
    const toCurrency = 'ETH';
    const fromValue = 100;
    const rate = await changelly.getRate(fromCurrency, toCurrency, fromValue);
    const expected = await changellyCalls.getResultAmount(
      fromCurrency,
      toCurrency,
      fromValue,
      'ETH'
    );
    const value = new BigNumber(rate.rate).times(new BigNumber(fromValue));
    const diff = value
      .div(expected)
      .minus(1)
      .abs()
      .toNumber();
    expect(diff).toBeLessThan(percentVarianceAllowed);
  });
  it('Expect market rate calculated value to be within 1% of exact value (from ETH) ', async () => {
    const currency = Object.values(changelly.currencies).find(
      entry => !entry.fixRateEnabled
    );

    const fromCurrency = 'ETH';
    const toCurrency = currency.symbol;
    const fromValue = 0.9;
    const rate = await changelly.getRate(fromCurrency, toCurrency, fromValue);
    const expected = await changellyCalls.getResultAmount(
      fromCurrency,
      toCurrency,
      fromValue,
      'ETH'
    );
    const value = new BigNumber(rate.rate).times(fromValue);
    const diff = value
      .div(expected)
      .minus(1)
      .abs()
      .toNumber();
    expect(diff).toBeLessThan(percentVarianceAllowed);
  });
  it('Expect fixed rate calculated value to be within 1% of exact value (to ETH)', async () => {
    const fromCurrency = 'BTC';
    const toCurrency = 'ETH';
    const fromValue = 0.9;
    const rate = await changelly.getRate(fromCurrency, toCurrency, fromValue);
    const expected = await changellyCalls.getResultAmount(
      fromCurrency,
      toCurrency,
      fromValue,
      'ETH'
    );
    const value = new BigNumber(rate.rate).times(fromValue);
    // const diff = value.minus(expected);
    const diff = value
      .div(expected)
      .minus(1)
      .abs()
      .toNumber();
    expect(diff).toBeLessThan(percentVarianceAllowed);
  });
  it('Expect fixed rate calculated value to be within 1% of exact value (from ETH) ', async () => {
    const fromCurrency = 'ETH';
    const toCurrency = 'BTC';
    const fromValue = 0.9;
    const rate = await changelly.getRate(fromCurrency, toCurrency, fromValue);
    const expected = await changellyCalls.getResultAmount(
      fromCurrency,
      toCurrency,
      fromValue,
      'ETH'
    );
    const value = new BigNumber(rate.rate).times(fromValue);
    const diff = value
      .div(expected)
      .minus(1)
      .abs()
      .toNumber();
    expect(diff).toBeLessThan(percentVarianceAllowed);
  });
});
