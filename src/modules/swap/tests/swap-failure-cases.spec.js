import Swap from '../index';
import Web3 from 'web3';
import fetch from 'jest-fetch-mock';
import { responseSelector } from './ApiResponses/responseSelector';
import bityGetFiatRate from '@/modules/swap/tests/ApiResponses/bityGetFiatRate';
import bityGetCryptoRates from '@/modules/swap/tests/ApiResponses/bityGetCryptoRates';
import bityGetEstimateBtcEth from '@/modules/swap/tests/ApiResponses/bityGetEstimateBtcEth';
import bityGetEstimateEthEur from '@/modules/swap/tests/ApiResponses/bityGetEstimateEthEur';

const useMockFetch = true;

jest.setMock('node-fetch', fetch);

describe('Swap Module - Failure Cases', () => {
  describe('Swap Module - Failure Case failure to retrieve initial list', () => {
    let swap;
    beforeAll(() => {
      if (useMockFetch) {
        fetch.enableMocks();
      } else {
        fetch.disableMocks();
      }
    });
    afterAll(() => {
      fetch.disableMocks();
    });
    test('it should setup without dexag', done => {
      fetch.resetMocks();
      fetch.mockResponse(req => {
        if (req.body) {
          const body = JSON.parse(req.body.toString());
          console.log(body); // todo remove dev item
          if (req.url.includes('dexag')) {
            return Promise.reject(JSON.stringify({error: {message: 'error1'}}));
          }
          return responseSelector(req);
        }
        return responseSelector(req);
      });

      const web3 = new Web3(
        'https://mainnet.infura.io/v3/7d06294ad2bd432887eada360c5e1986'
      );

      swap = new Swap({
        network: 'ETH',
        web3
      });

      const fromArrayCheck = {
        symbol: 'BAT'
      };

      swap.on('ready', () => {
        const res = swap.availableFromCurrencies(fromArrayCheck);
        expect(res).toEqual(expect.anything());
      });

      swap.on('setup-complete', () => {
        const res = swap.availableFromCurrencies(fromArrayCheck);
        console.log(res); // todo remove dev item
        expect(res).toEqual(expect.anything());
        done();
      });
    }, 10000);

    test('it should setup without changelly', done => {
      fetch.resetMocks();
      fetch.mockResponse(req => {
        if (req.body) {
          const body = JSON.parse(req.body.toString());
          console.log(body); // todo remove dev item
          if (req.url.includes('changelly')) {
            return Promise.resolve(JSON.stringify({error: {message: 'error1'}}));
          }
          return responseSelector(req);
        }
        return responseSelector(req);
      });

      const web3 = new Web3(
        'https://mainnet.infura.io/v3/7d06294ad2bd432887eada360c5e1986'
      );

      swap = new Swap({
        network: 'ETH',
        web3
      });

      const fromArrayCheck = {
        symbol: 'BAT'
      };

      swap.on('ready', () => {
        const res = swap.availableFromCurrencies(fromArrayCheck);
        expect(res).toEqual(expect.anything());
      });

      swap.on('setup-complete', () => {
        const res = swap.availableFromCurrencies(fromArrayCheck);
        console.log(res); // todo remove dev item
        const present = res.find(item => item.symbol === 'GAS')
        expect(present).toBeFalsy()
        done();
      });
    }, 10000);

    test('it should setup without bity', done => {
      fetch.resetMocks();
      fetch.mockResponse(req => {
        if (req.body) {
          const body = JSON.parse(req.body.toString());
          console.log(body); // todo remove dev item
          if (req.url.includes('bity')) {
            return Promise.reject(JSON.stringify({error: {message: 'error1'}}));
          }
          return responseSelector(req);
        }
        return responseSelector(req);
      });

      const web3 = new Web3(
        'https://mainnet.infura.io/v3/7d06294ad2bd432887eada360c5e1986'
      );

      swap = new Swap({
        network: 'ETH',
        web3
      });

      const fromArrayCheck = {
        symbol: 'BAT'
      };

      swap.on('ready', () => {
        const res = swap.availableFromCurrencies(fromArrayCheck);
        expect(res).toEqual(expect.anything());
      });

      swap.on('setup-complete', () => {
        console.log('setup-complete'); // todo remove dev item
        console.log(swap.callOther('convertToTokenWei', 'BAT', 100)); // todo remove dev item
        done();
      });
    }, 10000);
  })
  describe('Swap Module - Failure Case failure to retrieve rate for pair', () => {
    let swap;
    beforeAll(done => {
      if (useMockFetch) {
        fetch.enableMocks();
        fetch.resetMocks();
        fetch.mockResponse(req => {
          if (req.body) {
            const body = JSON.parse(req.body.toString());
            console.log(body); // todo remove dev item
            if (req.url.includes('bity')) {
              return Promise.reject(JSON.stringify(bityGetFiatRate));
            }
            return responseSelector(req);
          }
          return responseSelector(req);
        });

        const web3 = new Web3(
          'https://mainnet.infura.io/v3/7d06294ad2bd432887eada360c5e1986'
        );

        swap = new Swap({
          network: 'ETH',
          web3
        });

        const fromArrayCheck = {
          symbol: 'BAT'
        };

        swap.on('ready', () => {
          const res = swap.availableFromCurrencies(fromArrayCheck);
          expect(res).toEqual(expect.anything());
        });

        swap.on('setup-complete', () => {
          console.log('setup-complete'); // todo remove dev item
          console.log(swap.callOther('convertToTokenWei', 'BAT', 100)); // todo remove dev item
          done();
        });
      } else {
        fetch.disableMocks();
      }
    });
    afterAll(() => {
      fetch.disableMocks();
    });
    // test('it should get rates too low BAT to ETH', done => {
    //   swap
    //     .updateRateEstimate('BAT', 'ETH', 0.001)
    //     .then(res => {
    //       const dexag = res.find(item => item.provider === 'dexag');
    //       expect(dexag).toEqual(expect.anything());
    //       done();
    //     })
    //     .catch(console.log);
    // }, 5000);
    // test('it should fail fetch for dexag BAT to ETH', done => {
    //   fetch.resetMocks();
    //   fetch.mockResponse(req => {
    //     if (req.url.includes('dexag')) {
    //       return Promise.reject(JSON.stringify(bityGetCryptoRates));
    //     }
    //     return responseSelector(req);
    //   });
    //   swap.updateRateEstimate('BAT', 'ETH', 0.001).then(res => {
    //     console.log(res); // todo remove dev item
    //     const dexag = res.find(item => item.provider === 'dexag');
    //     expect(dexag).toBeFalsy()
    //     done();
    //   });
    // }, 5000);
    test('it should fail fetch for changelly BAT to ETH', done => {
      fetch.mockResponse(req => {
        if (req.url.includes('changelly')) {
          return Promise.reject(
            JSON.stringify({ error: { message: 'error' } })
          );
        }
        return responseSelector(req);
      });
      swap.updateRateEstimate('BAT', 'ETH', 0.001).then(res => {
        const dexag = res.find(item => item.provider === 'dexag');
        expect(dexag).toEqual(expect.anything());
        done();
      });
    }, 5000);
    test('it should get rates too low MANA to ETH', done => {
      swap.updateRateEstimate('MANA', 'BAT', 0.001).then(res => {
        const dexag = res.find(item => item.provider === 'dexag');
        expect(dexag).toEqual(expect.anything());
        done();
      });
    }, 5000);
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
    }, 5000);
  });
});
