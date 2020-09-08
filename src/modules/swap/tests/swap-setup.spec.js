import Swap from '../index';
import Web3 from 'web3';

describe('Swap Module', () => {
  let swap;
  beforeAll(() => {
    const web3 = new Web3(
      'https://mainnet.infura.io/v3/7d06294ad2bd432887eada360c5e1986'
    );
    swap = new Swap({
      network: 'ETH',
      web3
    });
  });
  test('it should setup', done => {
    const fromArrayCheck = {
      symbol: 'BAT'
    };

    swap.on('ready', () => {
      // console.log(swap.currencyArraySet); // todo remove dev item
      const res = swap.availableFromCurrencies(fromArrayCheck);
      expect(res).toEqual(expect.anything());
    });

    swap.on('setup-complete', () => {
      // console.log(swap.setUpMap); // todo remove dev item
      // console.log(swap.setUpMap['dexag']); // todo remove dev item
      done();
    });

    //   setTimeout(() => {
    //   //   console.log(swap.setUpMap); // todo remove dev item
    //   //   console.log(swap.setUpMap['dexag']); // todo remove dev item
    //   //   done();
    //   // }, 2000)
    //   // console.log(swap); // todo remove dev item
  }, 30000);
  test('it should get rates', done => {
    swap.updateRateEstimate('ETH', 'BAT', 10).then(res => {
      console.log(res); // todo remove dev item
      done();
    });
  }, 30000);
});
