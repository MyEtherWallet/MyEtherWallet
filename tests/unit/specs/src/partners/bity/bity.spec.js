import Bity from '@/partners/bity/bity.js';
import { getEstimate } from '@/partners/bity/bity-calls';
import BigNumber from 'bignumber.js';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('bity.js', () => {
  let bity;
  const percentVarianceAllowed = 0.01;
  beforeAll(() => {
    bity = new Bity({ network: 'ETH' });
  });
  xit('Expect market rate calculated value to be within 1% of exact value (to ETH)', async () => {
    const fromCurrency = 'BTC';
    const toCurrency = 'ETH';
    const fromValue = 1;
    const rate = await bity.getRate(fromCurrency, toCurrency, fromValue);
    const reqInfo = {
      pair: fromCurrency + toCurrency,
      fromValue: fromValue.toString(),
      toCurrency: toCurrency,
      fromCurrency: fromCurrency
    };
    const expected = await getEstimate(reqInfo);
    const expectedAmount = expected.output.amount;
    const value = new BigNumber(rate.rate).times(fromValue);
    const diff = value.minus(expectedAmount);
    expect(diff.abs().lte(percentVarianceAllowed)).toBe(true);
  });
  it('Expect market rate calculated value to be within 1% of exact value (to ETH)', async () => {
    const fromCurrency = 'BTC';
    const toCurrency = 'ETH';
    const fromValue = 0.5;
    const rate = await bity.getRate(fromCurrency, toCurrency, fromValue);
    const reqInfo = {
      pair: fromCurrency + toCurrency,
      fromValue: fromValue.toString(),
      toCurrency: toCurrency,
      fromCurrency: fromCurrency
    };
    const expected = await getEstimate(reqInfo);
    const expectedAmount = expected.output.amount;
    const value = new BigNumber(rate.rate).times(fromValue);
    const diff = value.minus(expectedAmount);
    expect(diff.abs().lte(percentVarianceAllowed)).toBe(true);
  });
  it('Expect market rate calculated value to be within 1% of exact value (to ETH)', async () => {
    const fromCurrency = 'ETH';
    const toCurrency = 'BTC';
    const fromValue = 0.5;
    const rate = await bity.getRate(fromCurrency, toCurrency, fromValue);
    const reqInfo = {
      pair: fromCurrency + toCurrency,
      fromValue: fromValue.toString(),
      toCurrency: toCurrency,
      fromCurrency: fromCurrency
    };
    const expected = await getEstimate(reqInfo);
    const expectedAmount = expected.output.amount;
    const value = new BigNumber(rate.rate).times(fromValue);
    const diff = value.minus(expectedAmount);
    expect(diff.abs().lte(percentVarianceAllowed)).toBe(true);
  });
});
