import { SwapProviders, providers } from '@/partners';
import Web3 from 'web3';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('partners', () => {
  let web3, swap;
  beforeAll(() => {
    web3 = new Web3('https://api.myetherwallet.com/eth');
    swap = new SwapProviders(
      providers, // providers.filter(part => !part.isDex())
      {
        network: 'ETH',
        getRateForUnit: false,
        web3: web3
      },
      { tokensWithBalance: [] }
    );
  });
  it('should return rates for all but simplex', async done => {
    const fromCurrency = 'ETH';
    const toCurrency = 'REP';
    const fromValue = 1;
    const toValue = 0.5;

    const interval = setInterval(async () => {
      if (swap.haveProviderRates) {
        clearInterval(interval);
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
        expect(results.length).toBe(3);
        done();
      }
    }, 500);
  }, 10000);
  it('should return rates for bity and changelly', async done => {
    const fromCurrency = 'BTC';
    const toCurrency = 'ETH';
    const fromValue = 1;
    const toValue = 0.5;
    const interval = setInterval(async () => {
      if (swap.haveProviderRates) {
        clearInterval(interval);
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
      }
    }, 500);
  });
  it('should return rates only from simplex', async done => {
    const fromCurrency = 'USD';
    const toCurrency = 'ETH';
    const fromValue = 100;
    const toValue = 0.5;
    const interval = setInterval(async () => {
      if (swap.haveProviderRates) {
        clearInterval(interval);
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
      }
    }, 500);
  });
});
