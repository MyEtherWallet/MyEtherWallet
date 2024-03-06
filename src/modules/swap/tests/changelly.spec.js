import Changelly from '../handlers/providers/changelly';
const changelly = new Changelly();
describe('Changelly Swap', () => {
  test('it should return supported tokens including ETH', () => {
    return changelly.getSupportedTokens().then(tokens => {
      expect(tokens).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            contract: '0xeth',
            decimals: 18,
            img: 'https://img.mewapi.io/?image=https://cdn.changelly.com/icons/eth.png',
            isEth: false,
            name: 'Ethereum',
            symbol: 'ETH'
          })
        ])
      );
    });
  });
  test('it should return valid ETH address', () => {
    return changelly
      .isValidToAddress({
        toT: { symbol: 'ETH' },
        address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
      })
      .then(isValid => {
        expect(isValid).toBe(true);
      });
  });
  test('it should return inValid ETH address', () => {
    return changelly
      .isValidToAddress({
        toT: { symbol: 'ETH' },
        address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068'
      })
      .then(isValid => {
        expect(isValid).toBe(false);
      });
  });
  test('it should return valid BTC address', () => {
    return changelly
      .isValidToAddress({
        toT: { symbol: 'BTC' },
        address: '1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9'
      })
      .then(isValid => {
        expect(isValid).toBe(true);
      });
  });
  test('it should return a quote', () => {
    return changelly
      .getQuote({
        toT: { symbol: 'BTC' },
        fromT: { symbol: 'ETH', decimals: 18 },
        fromAmount: '100000000000000000'
      })
      .then(quotes => {
        expect(quotes.length).toBe(1);
        expect(quotes[0].exchange).toBe('changelly');
      });
  });
});
