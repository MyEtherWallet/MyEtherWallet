import Simplex from '@/partners/simplex/simplex.js';
import { getQuote } from '@/partners/simplex/simplex-api';
import BigNumber from 'bignumber.js';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('simplex.js', () => {
  let simplex;
  const percentVarianceAllowed = 0.01;
  beforeAll(() => {
    simplex = new Simplex({ network: 'ETH' });
  });
  it('Expect market rate calculated value to be within 1% of exact value (fiat changed)', async done => {
    // get an amount of eth for a set amount of USD

    const fromCurrency = 'USD';
    const toCurrency = 'ETH';
    const fromValue = 200;
    const toValue = 0.5;
    const rate = await simplex.getRate(
      fromCurrency,
      toCurrency,
      fromValue,
      toValue,
      true // usd value changed.  calculate amount of eth it will buy
    );
    const expected = await getQuote({
      digital_currency: toCurrency,
      fiat_currency: fromCurrency,
      requested_currency: fromCurrency,
      requested_amount: +fromValue
    });
    const expectedAmount = expected.result.digital_money.amount;
    const value = new BigNumber(rate.rate).times(fromValue);
    const diff = value.minus(expectedAmount);

    expect(diff.abs().lte(expectedAmount * percentVarianceAllowed)).toBe(true);
    done();
  });
  it('Expect market rate calculated value to be within 1% of exact value (digital changed)', async done => {
    // get a set amount of eth for an amount of USD

    const fromCurrency = 'USD';
    const toCurrency = 'ETH';
    const fromValue = 200;
    const toValue = 0.5;
    const rate = await simplex.getRate(
      fromCurrency,
      toCurrency,
      fromValue,
      toValue,
      false // eth value changed. calculate the cost of that amount of eth
    );
    const expected = await getQuote({
      digital_currency: toCurrency,
      fiat_currency: fromCurrency,
      requested_currency: toCurrency,
      requested_amount: +toValue
    });
    const expectedInput = expected.result.fiat_money.total_amount;
    const value = new BigNumber(rate.rate).times(expectedInput);
    const diff = value.minus(toValue);
    expect(diff.abs().lte(toValue * percentVarianceAllowed)).toBe(true);
    done();
  });
});
