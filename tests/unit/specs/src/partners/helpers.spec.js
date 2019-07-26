import { bestRateForQuantity, bestProviderForQuantity } from '@/partners';

describe('simplex.js', () => {
  const exampleData;

  beforeEach(() => {
    exampleData = [
      {
        fromToken1: 'ADX',
        fromValue1: 1,
        maxValue: 0,
        minValue: 10,
        provider: 'provider1',
        rate: 0.01,
        rate2: 493.34285,
        toToken1: 'ETH',
        toToken2: 'REP'
      },
      {
        fromToken1: 'ADX',
        fromValue1: 1,
        maxValue: 0,
        minValue: 0.0001,
        provider: 'provider2',
        rate: 0.001,
        rate2: 493.34285,
        toToken1: 'ETH',
        toToken2: 'REP'
      },
      {
        fromToken1: 'ADX',
        fromValue1: 1,
        maxValue: 0,
        minValue: 50,
        provider: 'provider3',
        rate: 0.08,
        rate2: 493.34285,
        toToken1: 'ETH',
        toToken2: 'REP'
      },
      {
        fromToken1: 'ADX',
        fromValue1: 1,
        maxValue: 0,
        minValue: 100,
        provider: 'provider4',
        rate: 0.7,
        rate2: 493.34285,
        toToken1: 'ETH',
        toToken2: 'REP'
      },
      {
        fromToken1: 'ADX',
        fromValue1: 1,
        maxValue: 0,
        minValue: 100,
        provider: 'provider5',
        rate: 0.0007,
        rate2: 493.34285,
        toToken1: 'ETH',
        toToken2: 'REP'
      }
    ];
  });

  it('should return -1 if no qualifying rate is found', () => {
    const result = bestRateForQuantity(exampleData, 0.000000000001);
    expect(result).toEqual(-1);
  });

  it('should find the best rate for any quantity', () => {
    const result = bestRateForQuantity(exampleData, 0.001);
    expect(result).toEqual(0.001);
  });

  it('should find the best rate for a quantity of 10', () => {
    const result = bestRateForQuantity(exampleData, 10);
    expect(result).toEqual(0.01);
  });

  it('should find the best rate for a quantity of 50', () => {
    const result = bestRateForQuantity(exampleData, 50);
    expect(result).toEqual(0.08);
  });

  it('should find the best rate for a quantity of 100', () => {
    const result = bestRateForQuantity(exampleData, 100);
    expect(result).toEqual(0.7);
  });
  // provider ordering when calculating from to to
  it('should sort in order of best provider for any quantity', () => {
    const result = bestProviderForQuantity(exampleData, 0.001);
    expect(result[0].provider).toEqual('provider2');
  });

  it('should sort in order of best provider for a quantity of 10', () => {
    const result = bestProviderForQuantity(exampleData, 10);
    expect(result[0].provider).toEqual('provider1');
    expect(result[1].provider).toEqual('provider2');
  });

  it('should sort in order of best provider for a quantity of 50', () => {
    const result = bestProviderForQuantity(exampleData, 50);
    expect(result[0].provider).toEqual('provider3');
    expect(result[1].provider).toEqual('provider1');
    expect(result[2].provider).toEqual('provider2');
  });

  it('should sort in order of best provider for a quantity of 100', () => {
    const result = bestProviderForQuantity(exampleData, 100);
    expect(result[0].provider).toEqual('provider4');
    expect(result[1].provider).toEqual('provider3');
    expect(result[2].provider).toEqual('provider1');
    expect(result[3].provider).toEqual('provider2');
  });

  it('should sort in order of best provider for over all minimums (using a quantity of 10000000)', () => {
    const result = bestProviderForQuantity(exampleData, 10000000);
    expect(result[0].provider).toEqual('provider4');
    expect(result[1].provider).toEqual('provider3');
    expect(result[2].provider).toEqual('provider1');
    expect(result[3].provider).toEqual('provider2');
  });
});
