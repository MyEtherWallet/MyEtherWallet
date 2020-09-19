import Swap from '../index';
import Web3 from 'web3';
import fetch from 'jest-fetch-mock';
import { responseSelector } from './ApiResponses/responseSelector';

const useMockFetch = false;

jest.setMock('node-fetch', fetch);

describe('Swap Module', () => {
  let swap;

  beforeAll(() => {
    if (useMockFetch) {
      fetch.enableMocks();
      fetch.resetMocks();
      fetch.mockResponse(responseSelector);
    } else {
      fetch.disableMocks();
    }

    const web3 = new Web3(
      'https://mainnet.infura.io/v3/7d06294ad2bd432887eada360c5e1986'
    );

    swap = new Swap({
      network: 'ETH',
      web3
    });
  });
  afterAll(() => {
    fetch.disableMocks();
  });
  test('it should setup', done => {
    const fromArrayCheck = {
      symbol: 'BAT'
    };

    swap.on('ready', () => {
      const res = swap.availableFromCurrencies(fromArrayCheck);
      expect(res).toEqual(expect.anything());
    });

    swap.on('setup-complete', () => {
      done();
    });
  }, 30000);
  describe('Swap Module - Misc methods and functions', () => {
    test('it should call convertToTokenWei', done => {
      const result = swap.callOther('convertToTokenWei', 'BAT', 100);
      expect(result).toEqual('100000000000000000000');
      done();
    }, 30000);
    test('it should call convertToTokenBase', done => {
      const result = swap.callOther(
        'convertToTokenBase',
        'BAT',
        100000000000000000000
      );
      expect(result).toEqual('100');
      done();
    }, 30000);
    test('it should call calculateFromValue', done => {
      const result = swap.callOther('calculateFromValue', 100, 0.012, 'BAT');
      expect(result).toEqual('8333.333333');
      done();
    }, 30000);
    test('it should call calculateToValue', done => {
      const result = swap.callOther('calculateToValue', 100, 0.012, 'BAT');
      expect(result).toEqual('1.200000');
      done();
    }, 30000);
    test('it should call getProvider', done => {
      const result = swap.callOther('getProvider', 'simplex');
      expect(result).toEqual(expect.anything());
      done();
    }, 30000);
    test('it should call isProvider', done => {
      const result = swap.callOther('isProvider', 'simplex');
      expect(result).toBeTruthy();
      done();
    }, 30000);
  });

  describe('Swap Module - DexAg', () => {
    test('it should get rates too low BAT to ETH', done => {
      swap.updateRateEstimate('BAT', 'ETH', 0.001).then(res => {
        const dexag = res.find(item => item.provider === 'dexag');
        expect(dexag).toEqual(expect.anything());
        done();
      });
    }, 30000);
    test('it should get rates too low MANA to ETH', done => {
      swap.updateRateEstimate('MANA', 'BAT', 0.001).then(res => {
        const dexag = res.find(item => item.provider === 'dexag');
        expect(dexag).toEqual(expect.anything());
        done();
      });
    }, 30000);
    test('it should build the swap details', done => {
      swap.updateRateEstimate('ETH', 'BAT', 1).then(res => {
        const dexag = res.find(item => item.provider === 'dexag');
        expect(dexag).toEqual(expect.anything());
        const selectedProvider = swap.setSelectedProvider('dexag');
        swap.updateEstimateHelper('from', selectedProvider).then(() => {
          swap
            .startSwap(
              '0x43689531907482BEE7e650D18411E284A7337A66',
              '0x43689531907482BEE7e650D18411E284A7337A66',
              '0x43689531907482BEE7e650D18411E284A7337A66'
            )
            .then(res => {
              expect(res.dataForInitialization[0].data).toEqual(
                expect.anything()
              );
              done();
            });
        });
      });
    }, 30000);
  });
  describe('Swap Module - Changelly', () => {
    test('it should get rates too low', done => {
      swap.updateRateEstimate('ETH', 'BTC', 0.001).then(res => {
        const changelly = res.find(item => item.provider === 'changelly');
        expect(changelly).toEqual(expect.anything());
        done();
      });
    }, 30000);
    test('it should get rates too low BAT to ETH', done => {
      swap.updateRateEstimate('BAT', 'ETH', 0.001).then(res => {
        const changelly = res.find(item => item.provider === 'changelly');
        expect(changelly).toEqual(expect.anything());
        done();
      });
    }, 30000);
    test('it should get rates too low MANA to ETH', done => {
      swap.updateRateEstimate('MANA', 'BAT', 0.001).then(res => {
        const changelly = res.find(item => item.provider === 'changelly');
        expect(changelly).toEqual(expect.anything());
        done();
      });
    }, 30000);
    test('it should build the swap details', done => {
      swap.updateRateEstimate('ETH', 'BAT', 1).then(res => {
        const changelly = res.find(item => item.provider === 'changelly');
        expect(changelly).toEqual(expect.anything());
        const selectedProvider = swap.setSelectedProvider('changelly');
        swap.updateEstimateHelper('from', selectedProvider).then(() => {
          swap
            .startSwap(
              '0x43689531907482BEE7e650D18411E284A7337A66',
              '0x43689531907482BEE7e650D18411E284A7337A66',
              '0x43689531907482BEE7e650D18411E284A7337A66'
            )
            .then(res => {
              expect(res.orderId).toEqual(expect.anything());
              done();
            });
        });
      });
    }, 30000);
  });
  describe('Swap Module - Simplex', () => {
    test('it should update simplex from estimate', done => {
      swap
        .updateEstimateHelper('simplexfrom', {
          fromCurrency: 'USD',
          toCurrency: 'ETH',
          fromValue: 1,
          toValue: 1
        })
        .then(res => {
          if (useMockFetch) {
            expect(res.fromValue).toEqual(50);
          } else {
            expect(res.fromValue).toEqual(expect.anything());
          }
          done();
        });
    }, 30000);
    test('it should update simplex invalid to estimate', done => {
      swap
        .updateEstimateHelper('simplexto', {
          fromCurrency: 'USD',
          toCurrency: 'ETH',
          fromValue: 1,
          toValue: 0
        })
        .then(res => {
          if (useMockFetch) {
            expect(res.fromValue.toString()).toEqual('50');
          } else {
            expect(res.fromValue).toEqual(expect.anything());
          }

          done();
        });
    }, 30000);
    test('it should update simplex to estimate', done => {
      swap
        .updateEstimateHelper('simplexto', {
          fromCurrency: 'USD',
          toCurrency: 'ETH',
          fromValue: 0,
          toValue: 1
        })
        .then(res => {
          if (useMockFetch) {
            expect(res.fromValue.toString()).toEqual('419.12');
          } else {
            expect(res.fromValue).toEqual(expect.anything());
          }

          done();
        });
    }, 30000);
  });
});
