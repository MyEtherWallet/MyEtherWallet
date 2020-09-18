import Swap from '../index';
import Web3 from 'web3';
import fetch from 'jest-fetch-mock';
import { responseSelector } from './ApiResponses/responseSelector';
//
jest.setMock('node-fetch', fetch);

describe('Swap Module - Changelly', () => {
  let swap;
  beforeAll(() => {
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
  test('it should get rates too low', done => {
    swap.updateRateEstimate('ETH', 'BTC', 0.001).then(res => {
      console.log(res); // todo remove dev item
      const changelly = res.find(item => item.provider === 'changelly');
      expect(changelly).toEqual(expect.anything());
      done();
    });
  }, 30000);
  test('it should get rates too low BAT to ETH', done => {
    swap.updateRateEstimate('BAT', 'ETH', 0.001).then(res => {
      console.log(res); // todo remove dev item
      const changelly = res.find(item => item.provider === 'changelly');
      expect(changelly).toEqual(expect.anything());
      done();
    });
  }, 30000);
  test('it should get rates too low MANA to ETH', done => {
    swap.updateRateEstimate('MANA', 'BAT', 0.001).then(res => {
      console.log(res); // todo remove dev item
      const changelly = res.find(item => item.provider === 'changelly');
      expect(changelly).toEqual(expect.anything());
      done();
    });
  }, 30000);
  test('it should build the swap details', done => {
    swap.updateRateEstimate('ETH', 'BAT', 1).then(res => {
      console.log(res); // todo remove dev item
      const selectedProvider = swap.setSelectedProvider('changelly')
      // fetch.resetMocks();
      // fetch.mockResponseOnce(responseSelector(null, 'changellyOneEthToBat'));
      swap.updateEstimateHelper('from', selectedProvider).then(() => {
        // fetch.disableMocks();
        console.log('it should build the swap details'); // todo remove dev item
        // fetch.mockResponseOnce(responseSelector(null, 'changellyOneEthToBat'));
        swap
          .startSwap(
            '0x43689531907482BEE7e650D18411E284A7337A66',
            '0x43689531907482BEE7e650D18411E284A7337A66',
            '0x43689531907482BEE7e650D18411E284A7337A66'
          )
          .then(res => {
            console.log(res); // todo remove dev item
            expect(res.orderId).toEqual(expect.anything());
            done();
          });
      })
    });

  }, 30000);
});
