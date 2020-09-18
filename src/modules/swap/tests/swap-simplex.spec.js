import Swap from '../index';
import Web3 from 'web3';
import fetch from 'jest-fetch-mock';
import { responseSelector } from './ApiResponses/responseSelector';

jest.setMock('node-fetch', fetch);

describe('Swap Module - Simplex', () => {
  let swap;
  beforeAll(done => {
    fetch.enableMocks();
    fetch.resetMocks();
    fetch.mockResponse(responseSelector);
    const web3 = new Web3(
      'https://mainnet.infura.io/v3/7d06294ad2bd432887eada360c5e1986'
    );

    swap = new Swap({
      network: 'ETH',
      web3
    });
    swap.on('setup-complete', () => {
      done();
    });
  });
  afterAll(() => {
    fetch.disableMocks();
  });
  // test('it should setup', done => {
  //   const fromArrayCheck = {
  //     symbol: 'BAT'
  //   };
  //
  //   swap.on('ready', () => {
  //     const res = swap.availableFromCurrencies(fromArrayCheck);
  //     expect(res).toEqual(expect.anything());
  //   });
  //
  //   swap.on('setup-complete', () => {
  //     done();
  //   });
  // }, 30000);
  xtest('it should get rates', done => {
    swap.updateRateEstimate('USD', 'ETH', 10).then(res => {
      console.log(res); // todo remove dev item
      const simplex = res.find(item => item.provider === 'simplex');
      expect(simplex).toEqual(expect.anything());
      expect(res.length).toEqual(1)
      done();
    });
  }, 30000);
  xtest('it should get rates 5', done => {
    swap.updateRateEstimate('USD', 'ETH', 1, 1).then(res => {
      console.log(res); // todo remove dev item
      done();
    });
  }, 30000);
  test('it should update simplex from estimate', done => {
    swap
      .updateEstimateHelper('simplexfrom', {
        fromCurrency: 'USD',
        toCurrency: 'ETH',
        fromValue: 1,
        toValue: 1
      })
      .then(res => {
        console.log(res); // todo remove dev item
        expect(res.fromValue).toEqual(50);
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
        console.log(res); // todo remove dev item
        expect(res.fromValue.toString()).toEqual('50');
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
        console.log(res); // todo remove dev item
        expect(res.fromValue.toString()).toEqual('419.12');
        done();
      });
  }, 30000);
});
