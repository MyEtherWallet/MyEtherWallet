import Kyber from '@/partners/kyber/kyber.js';
import Web3 from 'web3';
import ENS from 'ethereum-ens';

const nodeUrl = 'https://api.myetherwallet.com/eth';
const network = 'ETH';
const withNetwork = false;

xdescribe('kyber.js', () => {
  beforeEach(done => {
    setTimeout(() => {
      done();
    }, 500);
  });
  it('should instanciate a new instance', () => {
    const web3 = new Web3(nodeUrl);
    const ens = new ENS(web3.currentProvider);
    const kyber = new Kyber({
      network,
      web3: web3,
      ens: ens
    });
    expect(kyber).toBeInstanceOf(Kyber);
  });

  it('should return the value in token wei', () => {
    const web3 = new Web3(nodeUrl);
    const ens = new ENS(web3.currentProvider);
    const kyber = new Kyber({
      network,
      web3: web3,
      ens: ens
    });

    const weiValue = kyber.convertToTokenBase('GTO', 100000);
    expect(weiValue).toBe('1');
  });

  it('should return the value in token units', () => {
    const web3 = new Web3(nodeUrl);
    const ens = new ENS(web3.currentProvider);
    const kyber = new Kyber({
      network,
      web3: web3,
      ens: ens
    });

    const baseValue = kyber.convertToTokenWei('GTO', 1);
    expect(baseValue).toBe('100000');
  });

  it('should return data for kyber trade tx', async () => {
    const dataValue = {
      data:
        '0xcb3c28c7000000000000000000000000c5bbae50781be1669306b9e001eff57a2957b09d00000000000000000000000000000000000000000000000000000000000186a00000000000000000000000000d8775f648430679a709e98d2b0cb6250d2887ef000000000000000000000000decaf9cd2367cdbb726e904cd6397edfcae6068d000000000000000000000000000000000000000000000000001fffffffffffff000000000000000000000000000000000000000000000000054ee7e7894c2000000000000000000000000000decaf9cd2367cdbb726e904cd6397edfcae6068d',
      to: '0x818e6fecd516ecc3849daf6845e3ec868087b755',
      value: 0
    };
    const web3 = new Web3(nodeUrl);
    const ens = new ENS(web3.currentProvider);
    const kyber = new Kyber({
      network,
      web3: web3,
      ens: ens
    });

    const baseValue = kyber.convertToTokenWei('GTO', 1);
    const minRate = kyber.convertToTokenWei('BAT', 0.382498);
    const tradeData = await kyber.getTradeData(
      'GTO',
      'BAT',
      baseValue,
      minRate,
      '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
    );
    expect(tradeData).toMatchObject(dataValue);
  });

  it('should return data for kyber approval tx', async () => {
    const dataValue = {
      data:
        '0x095ea7b3000000000000000000000000818e6fecd516ecc3849daf6845e3ec868087b75500000000000000000000000000000000000000000000000000000000000186a0',
      to: '0xC5bBaE50781Be1669306b9e001EFF57a2957b09d',
      value: 0
    };

    const web3 = new Web3(nodeUrl);
    const ens = new ENS(web3.currentProvider);
    const kyber = new Kyber({
      network,
      web3: web3,
      ens: ens
    });
    const baseValue = kyber.convertToTokenWei('GTO', 1);
    const approveData = await kyber.approveKyber('GTO', baseValue);
    expect(approveData).toMatchObject(dataValue);
  });

  if (withNetwork) {
    // requires network to function
    it('should retrieve rate for pair in token wei', async () => {
      expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const ens = new ENS(web3.currentProvider);
      const kyber = new Kyber({
        network,
        web3: web3,
        ens: ens
      });
      const dataForTxs = await kyber.getExpectedRate('ETH', 'BAT', 9);
      expect(dataForTxs).toEqual(expect.anything());
    });

    // requires network to function
    it('should retrieve rate for pair ETH/BAT in tokens', async () => {
      expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const ens = new ENS(web3.currentProvider);
      const kyber = new Kyber({
        network,
        web3: web3,
        ens: ens
      });
      const baseValue = await kyber.getExpactedRateInTokens('ETH', 'BAT', 9);
      expect(baseValue).toEqual(expect.anything());
    });

    // requires network to function
    it('should retrieve rate for pair BAT/ETH in tokens', async () => {
      expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const ens = new ENS(web3.currentProvider);
      const kyber = new Kyber({
        network,
        web3: web3,
        ens: ens
      });

      const baseValue = await kyber.getExpactedRateInTokens('BAT', 'ETH', 9);
      expect(baseValue).toEqual(expect.anything());
    });

    // check other pairs (start)
    // requires network to function
    it('should retrieve rate for pair ADX/KNC in tokens', async () => {
      expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const ens = new ENS(web3.currentProvider);
      const kyber = new Kyber({
        network,
        web3: web3,
        ens: ens
      });
      const baseValue = await kyber.getExpactedRateInTokens('ADX', 'KNC', 9);
      expect(baseValue).toEqual(expect.anything());
    });

    // requires network to function
    it('should retrieve rate for pair BAT/MANA in tokens', async () => {
      // expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const ens = new ENS(web3.currentProvider);
      const kyber = new Kyber({
        network,
        web3: web3,
        ens: ens
      });
      const baseValue = await kyber.getExpactedRateInTokens('BAT', 'MANA', 9);
      expect(baseValue).toEqual(expect.anything());
    });
    // check other pairs end

    // requires network to function
    it('should get users kyber network user cap value', async () => {
      expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const ens = new ENS(web3.currentProvider);
      const kyber = new Kyber({
        network,
        web3: web3,
        ens: ens
      });
      const userCap = await kyber.getUserCapInWei(
        '0x69d4a85BA93C96d007Ee138D5DB3cfeB6AbF4e78'
      );
      expect(userCap).toBe('992063492063492000000');
    });

    // requires network to function
    it('should check if trade does not exceed 95% of users kyber network user cap value', async () => {
      expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const ens = new ENS(web3.currentProvider);
      const kyber = new Kyber({
        network,
        web3: web3,
        ens: ens
      });

      const result = await kyber.checkUserCap(
        92,
        '0x69d4a85BA93C96d007Ee138D5DB3cfeB6AbF4e78'
      );
      expect(result).toBe(true);
    });

    // requires network to function
    it('should check if trade does exceed 95% of users kyber network user cap value', async () => {
      expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const ens = new ENS(web3.currentProvider);
      const kyber = new Kyber({
        network,
        web3: web3,
        ens: ens
      });

      const result = await kyber.checkUserCap(
        92063492000000,
        '0x69d4a85BA93C96d007Ee138D5DB3cfeB6AbF4e78'
      );
      expect(result).toBe(false);
    });

    // requires network to function
    it('should check if user has enough tokes allocated to kyber network', async () => {
      expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const ens = new ENS(web3.currentProvider);
      const kyber = new Kyber({
        network,
        web3: web3,
        ens: ens
      });

      const result = await kyber.allowance(
        'GTO',
        '0x69d4a85BA93C96d007Ee138D5DB3cfeB6AbF4e78'
      );
      expect(result).toBe('0');
    });

    // requires network to function
    it('should check if user has enough tokes allocated to kyber network', async () => {
      expect.assertions(2);
      const web3 = new Web3(nodeUrl);
      const ens = new ENS(web3.currentProvider);
      const kyber = new Kyber({
        network,
        web3: web3,
        ens: ens
      });

      const result = await kyber.isTokenApprovalNeeded(
        'GTO',
        'BAT',
        1000,
        '0x69d4a85BA93C96d007Ee138D5DB3cfeB6AbF4e78'
      );
      expect(result.approve).toBe(true);
      expect(result.reset).toBe(false);
    });

    // requires network to function
    it('should throw error if fromValue exceeds user token balance', async () => {
      expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const ens = new ENS(web3.currentProvider);
      const kyber = new Kyber({
        network,
        web3: web3,
        ens: ens
      });

      try {
        await kyber.canUserSwap(
          'GTO',
          'BAT',
          1,
          0.382958,
          '0x69d4a85BA93C96d007Ee138D5DB3cfeB6AbF4e78'
        );
      } catch (e) {
        expect(e.message).toMatch(/current token balance/);
      }
    });

    // requires network to function
    it('should throw error if fromValue is in ETH and above user cap', async () => {
      expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const ens = new ENS(web3.currentProvider);
      const kyber = new Kyber({
        network,
        web3: web3,
        ens: ens
      });

      try {
        await kyber.canUserSwap(
          'ETH',
          'BAT',
          92063492000000,
          116810651600000000,
          '0x69d4a85BA93C96d007Ee138D5DB3cfeB6AbF4e78'
        );
      } catch (e) {
        expect(e.message).toMatch(/user cap value/);
      }
    });

    // requires network to function
    it('should throw error if toValue is in ETH and above user cap', async () => {
      expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const ens = new ENS(web3.currentProvider);
      const kyber = new Kyber({
        network,
        web3: web3,
        ens: ens
      });

      // 1 BAT
      // 0.000778 ETH
      try {
        await kyber.canUserSwap(
          'BAT',
          'ETH',
          7162539678000,
          9206349200000000,
          '0x69d4a85BA93C96d007Ee138D5DB3cfeB6AbF4e78'
        );
      } catch (e) {
        expect(e.message).toMatch(/user cap value/);
      }
    });

    // requires network to function
    it('should throw an error if a swap is not allowed for the user or supplied details', async () => {
      expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const ens = new ENS(web3.currentProvider);
      const kyber = new Kyber({
        network,
        web3: web3,
        ens: ens
      });

      try {
        await kyber.generateDataForTransactions(
          'ETH',
          'BAT',
          92063492,
          35256450.769336,
          0.382958,
          '0x69d4a85BA93C96d007Ee138D5DB3cfeB6AbF4e78'
        );
      } catch (e) {
        expect(e.message).toMatch(/user cap value/);
      }
    });

    // requires network to function
    it('Failing - should generate data for each transaction needed to perform a swap', async () => {
      expect.assertions(1);
      const web3 = new Web3(nodeUrl);
      const ens = new ENS(web3.currentProvider);
      const kyber = new Kyber({
        network,
        web3: web3,
        ens: ens
      });

      const dataForTxs = await kyber.generateDataForTransactions(
        'ETH',
        'BAT',
        9,
        11419.248186,
        0.382958,
        '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
      );
      console.log(dataForTxs); // todo remove dev item
      expect(dataForTxs).toEqual(expect.anything());
    });
  }

  // generateDataForTransactions
});
