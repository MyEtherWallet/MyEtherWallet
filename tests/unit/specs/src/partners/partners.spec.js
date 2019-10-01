import { SwapProviders, providers, providerNames } from '@/partners';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('partners', () => {
  const percentVarianceAllowed = 0.009;
  let web3, swap;
  beforeAll(async done => {
    web3 = new Web3('https://api.myetherwallet.com/eth');
    swap = new SwapProviders(
      providers,
      {
        network: 'ETH',
        getRateForUnit: false,
        web3: web3
      },
      { tokensWithBalance: [] }
    );

    const interval = setInterval(async () => {
      if (swap.haveProviderRates) {
        clearInterval(interval);
        done();
      }
    }, 100);
  }, 10000);
  it('should return rates for all but simplex', async done => {
    const fromCurrency = 'ETH';
    const toCurrency = 'REP';
    const fromValue = 1;
    const toValue = 0.5;

    const reault = await swap.updateRateEstimate(
      fromCurrency,
      toCurrency,
      fromValue,
      'to'
    );
    const results = await Promise.all(
      reault.callsToMake.map(func =>
        func(fromCurrency, toCurrency, fromValue, toValue)
      )
    );
    const shouldContain = Object.values(providerNames).filter(
      entry => entry !== providerNames.simplex
    );
    const doesItHaveAll = results.every(entry =>
      shouldContain.includes(entry.provider)
    );
    expect(results.length).toBe(3);
    expect(doesItHaveAll).toBe(true);
    done();
  }, 10000);
  it('should return rates for bity and changelly', async done => {
    const fromCurrency = 'BTC';
    const toCurrency = 'ETH';
    const fromValue = 1;
    const toValue = 0.5;
    const reault = await swap.updateRateEstimate(
      fromCurrency,
      toCurrency,
      fromValue,
      'to'
    );
    const results = await Promise.all(
      reault.callsToMake.map(func =>
        func(fromCurrency, toCurrency, fromValue, toValue)
      )
    );
    expect(results.length).toBe(2);
    done();
  });
  it('should return rates only from simplex', async done => {
    const fromCurrency = 'USD';
    const toCurrency = 'ETH';
    const fromValue = 100;
    const toValue = 0.5;
    const reault = await swap.updateRateEstimate(
      fromCurrency,
      toCurrency,
      fromValue,
      'to'
    );
    const results = await Promise.all(
      reault.callsToMake.map(func =>
        func(fromCurrency, toCurrency, fromValue, toValue)
      )
    );
    expect(results.length).toBe(1);
    done();
  });
  xit('Expect changelly market rate calculated value to be within 1% of exact value (to ETH)', async done => {
    const changelly = swap.getProvider(providerNames.changelly);
    const changellyCalls = changelly.getApiConnector();
    const currency = Object.values(changelly.currencies).find(
      entry => !entry.fixRateEnabled
    );

    const fromCurrency = currency.symbol;
    const toCurrency = 'ETH';
    const fromValue = 100;
    const toValue = 0.5;
    const reault = await swap.updateRateEstimate(
      fromCurrency,
      toCurrency,
      fromValue,
      'to'
    );
    const results = await Promise.all(
      reault.callsToMake.map(func =>
        func(fromCurrency, toCurrency, fromValue, toValue)
      )
    );

    const providerEntry = results.find(
      entry => entry.provider === providerNames.changelly
    );

    const expected = await changellyCalls.getResultAmount(
      fromCurrency,
      toCurrency,
      fromValue,
      'ETH'
    );
    const value = new BigNumber(providerEntry.rate).times(
      new BigNumber(fromValue)
    );
    const diff = value
      .div(expected)
      .minus(1)
      .abs()
      .toNumber();
    expect(diff).toBeLessThan(percentVarianceAllowed);
    done();
  });
  xit('Expect market rate calculated value to be within 1% of exact value (from ETH) ', async () => {
    const changelly = swap.getProvider(providerNames.changelly);
    const changellyCalls = changelly.getApiConnector();
    const currency = Object.values(changelly.currencies).find(
      entry => !entry.fixRateEnabled
    );

    const fromCurrency = 'ETH';
    const toCurrency = currency.symbol;
    const fromValue = 0.9;
    const toValue = 0.5;

    const reault = await swap.updateRateEstimate(
      fromCurrency,
      toCurrency,
      fromValue,
      'to'
    );
    const results = await Promise.all(
      reault.callsToMake.map(func =>
        func(fromCurrency, toCurrency, fromValue, toValue)
      )
    );

    const providerEntry = results.find(
      entry => entry.provider === providerNames.changelly
    );

    const expected = await changellyCalls.getResultAmount(
      fromCurrency,
      toCurrency,
      fromValue,
      'ETH'
    );
    const value = new BigNumber(providerEntry.rate).times(fromValue);
    const diff = value
      .div(expected)
      .minus(1)
      .abs()
      .toNumber();
    expect(diff).toBeLessThan(percentVarianceAllowed);
  });
});
