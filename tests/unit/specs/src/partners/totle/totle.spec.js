import Totle from '@/partners/totle/totle.js';
import Web3 from 'web3';

const nodeUrl = 'https://api.myetherwallet.com/eth';
const network = 'ETH';
const withNetwork = true;

describe('totle.js', () => {
  let totle;
  beforeEach(done => {
    setTimeout(() => {
      done();
    }, 500);
  });

  beforeAll(async done => {
    const web3 = new Web3(nodeUrl);
    totle = new Totle({
      network,
      web3: web3
    });

    const interval = setInterval(async () => {
      if (totle.ratesRetrieved) {
        clearInterval(interval);
        done();
      }
    }, 100);
  }, 10000);

  it('should have current token list', () => {
    const undef = totle.currencies['THISISADUMMYTOKEN'];
    expect(undef).toBeUndefined();
  });

  it('should instanciate a new instance', () => {
    expect(totle).toBeInstanceOf(Totle);
  });

  it('should return the value in token wei', () => {
    const weiValue = totle.convertToTokenWei('AST', 1);
    // symbol -> base -> wei
    // AST -> 1 -> 10000
    // ENG -> 1 -> 100000000
    // BQX -> 1 - > 100000000
    expect(weiValue).toBe('10000');
  });

  it('should return the value in token units', () => {
    const baseValue = totle.convertToTokenWei('KNC', 1);
    expect(baseValue).toBe('1000000000000000000');
  });

  if (withNetwork) {
    // requires network to function
    it('should retrieve rate for pair in token wei', async () => {
      expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const totle = new Totle({
        network,
        web3: web3
      });
      const rate = await totle.getExpectedRate('ETH', 'BAT', 9);
      expect(rate).toEqual(expect.anything());
    });

    // requires network to function
    it('should retrieve rate for pair ETH/BAT in tokens', async () => {
      expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const totle = new Totle({
        network,
        web3: web3
      });
      const baseValue = await totle.getExpectedRateInTokens('ETH', 'BAT', 9);
      expect(baseValue).toEqual(expect.anything());
    });

    // requires network to function
    it('should retrieve rate for pair BAT/ETH in tokens', async () => {
      expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const totle = new Totle({
        network,
        web3: web3
      });

      const baseValue = await totle.getExpectedRateInTokens('BAT', 'ETH', 9);
      expect(baseValue).toEqual(expect.anything());
    });

    // check other pairs (start)
    // requires network to function
    it('should retrieve rate for pair ADX/KNC in tokens', async () => {
      expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const totle = new Totle({
        network,
        web3: web3
      });
      const baseValue = await totle.getExpectedRateInTokens('ADX', 'KNC', 9);
      expect(baseValue).toEqual(expect.anything());
    });

    // requires network to function
    it('should retrieve rate for pair BAT/MANA in tokens', async () => {
      // expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const totle = new Totle({
        network,
        web3: web3
      });
      const baseValue = await totle.getExpectedRateInTokens('BAT', 'MANA', 9);
      expect(baseValue).toEqual(expect.anything());
    });
    // check other pairs end

    // requires network to function
    it('should throw error if fromValue exceeds user token balance', async () => {
      expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const totle = new Totle({
        network,
        web3: web3
      });

      try {
        await totle.startSwap({
          fromCurrency: 'SNT',
          toCurrency: 'BAT',
          fromValue: 100,
          fromAddress: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          toAddress: '0x69d4a85BA93C96d007Ee138D5DB3cfeB6AbF4e78'
        });
      } catch (e) {
        expect(e.message).toMatch(/balance for swap/);
      }
    });

    // requires network to function
    it('should receive data for each transaction needed to perform a swap', async () => {
      expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const totle = new Totle({
        network,
        web3: web3
      });

      const dataForTxs = await totle.startSwap({
        fromCurrency: 'ETH',
        toCurrency: 'BAT',
        fromValue: 0.382958,
        fromAddress: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
        toAddress: '0x69d4a85BA93C96d007Ee138D5DB3cfeB6AbF4e78'
      });
      expect(dataForTxs.dataForInitialization).toEqual(expect.anything());
    });
  }
});
