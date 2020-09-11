import Swap from '../index';
import Web3 from 'web3';
import fetch from 'jest-fetch-mock';
import { responseSelector } from './ApiResponses/responseSelector';

// jest.setMock('node-fetch', fetch);

describe('Swap Module', () => {
  let swap;
  beforeAll(() => {
    // fetch.enableMocks();
    // fetch.resetMocks();
    // fetch.mockResponse(responseSelector);
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
  test('it should get rates', done => {
    swap.updateRateEstimate('ETH', 'BAT', 10).then(res => {
      console.log(res); // todo remove dev item
      const dexag = res.find(item => item.provider === 'dexag');
      expect(dexag).toEqual(expect.anything());
      const changelly = res.find(item => item.provider === 'changelly');
      expect(changelly).toEqual(expect.anything());
      done();
    });
  }, 30000);
  xtest('it should update to amount', done => {
    swap
      .updateEstimateHelper('to', {
        fromCurrency: 'ETH',
        toCurrency: 'BAT',
        fromValue: 10,
        toValue: 20
      })
      .then(res => {
        console.log(res); // todo remove dev item
        expect(res.fromValue).toEqual('0.014871');
        done();
      });
  }, 30000);
  xtest('it should update from amount', done => {
    swap
      .updateEstimateHelper('from', {
        fromCurrency: 'ETH',
        toCurrency: 'BAT',
        fromValue: 10,
        toValue: 20
      })
      .then(res => {
        console.log(res); // todo remove dev item
        expect(res.toValue).toEqual('13448.877725');
        done();
      });
  }, 30000);
  xtest('it should get rates 2', done => {
    swap.updateRateEstimate('ETH', 'BTC', 1).then(res => {
      console.log(res); // todo remove dev item
      const changelly = res.find(item => item.provider === 'changelly');
      expect(changelly).toEqual(expect.anything());
      done();
    });
  }, 30000);
  xtest('it should get rates 3', done => {
    swap.updateRateEstimate('BTC', 'ETH', 1).then(res => {
      console.log(res); // todo remove dev item
      const bity = res.find(item => item.provider === 'bity');
      expect(bity).toEqual(expect.anything());
      const changelly = res.find(item => item.provider === 'changelly');
      expect(changelly).toEqual(expect.anything());
      done();
    });
  }, 30000);
  xtest('it should get rates 4', done => {
    swap.updateRateEstimate('ETH', 'EUR', 1).then(res => {
      console.log(res); // todo remove dev item
      const bity = res.find(item => item.provider === 'bity');
      expect(bity).toEqual(expect.anything());
      const changelly = res.find(item => item.provider === 'changelly');
      expect(changelly).toEqual(expect.anything());
      done();
    });
  }, 30000);
  test('it should get rates 5', done => {
    swap.updateRateEstimate('USD', 'ETH', 1, 1).then(res => {
      // console.log(res); // todo remove dev item
      // const bity = res.find(item => item.provider === 'bity');
      // expect(bity).toEqual(expect.anything());
      // const changelly = res.find(item => item.provider === 'changelly');
      // expect(changelly).toEqual(expect.anything());
      // done();
      swap
        .updateEstimateHelper('simplexfrom', {
          fromCurrency: 'USD',
          toCurrency: 'ETH',
          fromValue: 1,
          toValue: 1
        })
        .then(res => {
          console.log(res); // todo remove dev item
          expect(res.fromValue).toEqual('0.014871');
          done();
        });
    });
  }, 30000);
});
