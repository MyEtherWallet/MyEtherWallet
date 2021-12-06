import ZeroX from '../handlers/providers/zerox';
jest.setTimeout(10000);
const zeroX = new ZeroX();
describe('Zerox Swap', () => {
  xtest('it should return supported tokens including ETH', () => {
    return zeroX.getSupportedTokens().then(tokens => {
      expect(tokens).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            img: 'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/ETH-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg',
            decimals: 18,
            name: 'Ethereum',
            symbol: 'ETH'
          })
        ])
      );
    });
  });
  test('it should return valid ETH address', () => {
    return zeroX
      .isValidToAddress({
        toT: { symbol: 'ETH' },
        address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
      })
      .then(isValid => {
        expect(isValid).toBe(true);
      });
  });
  test('it should return inValid ETH address', () => {
    return zeroX
      .isValidToAddress({
        toT: { symbol: 'ETH' },
        address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068'
      })
      .then(isValid => {
        expect(isValid).toBe(false);
      });
  });
  test('it should return a quote', () => {
    return zeroX
      .getQuote({
        toT: {
          symbol: 'DAI',
          contract: '0x6b175474e89094c44da98b954eedeac495271d0f'
        },
        fromT: {
          symbol: 'ETH',
          decimals: 18,
          contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        },
        fromAmount: '100000000000000000'
      })
      .then(quotes => {
        expect(quotes.length).toBeGreaterThanOrEqual(1);
        expect(quotes[0].provider).toBe('ZERO_X');
      });
  });
});
