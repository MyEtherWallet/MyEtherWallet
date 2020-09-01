import Swap from '../index';

describe('Swap Module', () => {
  test('it should setup', () => {
    const swap = new Swap({
      network: 'ETH'
    });
    console.log(swap); // todo remove dev item
  });
});
