import SendTransaction from '../index';
import web3Instance from '../web3-delete';

const sendTransaction = new SendTransaction(
  // account
  {
    balance: '1000000000000000000',
    address: '0x43689531907482BEE7e650D18411E284A7337A66'
  },
  // web3
  web3Instance,
  // gasPrice
  '90',
  // network
  {
    type: {
      name: 'ETH',
      name_long: 'Ethereum',
      currencyName: 'ETH'
    }
  }
);

describe('Send Transaction', () => {
  test('it should validate address', () => {
    const response = sendTransaction.isValidAddress(
      '0x43d29d6dc3346a812b10b572ffb52fc7668bf8ba'
    );
    expect(response).toBe(true);
  });
  test('it should validate data', () => {
    const response = sendTransaction.isValidData('0x00');
    expect(response).toBe(true);
  });
  test('it should validate gas limit', () => {
    const response = sendTransaction.isValidGasLimit('21000');
    expect(response).toBe('21000');
  });
  test('it should get fixed gas', () => {
    const response = sendTransaction.getFixedGas('1.2345645');
    expect(response).toBe('1.23');
  });
  test('it should get fixed balance', () => {
    const response = sendTransaction.getBalETH();
    expect(response).toBe('1');
  });
  test('it should get entire balance', () => {
    const response = sendTransaction.getEntireBal(
      { symbol: 'ETH', balance: '1' },
      1,
      21000
    );
    expect(response).toBe('0.99811');
  });
  test('it should get final gas price', () => {
    const response = sendTransaction.finalGasPrice();
    expect(response).toBe('90.000000000');
  });
  test('it should show warning', () => {
    const response = sendTransaction.showWarning('20');
    expect(response).toBe(true);
  });
  test('it should show warning', () => {
    const response = sendTransaction.showWarning('20');
    expect(response).toBe(true);
  });
  test('it should return tx fee', () => {
    const response = sendTransaction.txFee('21000');
    expect(response).toEqual('1890000000000000');
  });
  test('it should return tx fee in eth', () => {
    const response = sendTransaction.txFeeETH('21000');
    expect(response).toBe('0.00189');
  });
  test('it should return tx fee in usd', () => {
    const response = sendTransaction.txFeeUSD('21000', '300');
    expect(response).toBe('0.57');
  });
  test('it should return balance in eth', () => {
    const response = sendTransaction.balanceEth();
    expect(response).toEqual('1');
  });
  test('it should estimate gas', () => {
    const response = sendTransaction.estimateGas(
      '200',
      '0x43d29d6dc3346a812b10b572ffb52fc7668bf8ba',
      '90',
      '0x00'
    );
    expect(response).toBe(21000);
  });
  test('it should check if its a token', () => {
    const response = sendTransaction.isToken({ symbol: 'BAT' });
    expect(response).toBe(true);
  });
  test('it should check amount', () => {
    const response = sendTransaction.checkAmount(200, { symbol: 'BAT' });
    expect(response).toBe({});
  });
  test('it should check if have enough amount', () => {
    const response = sendTransaction.hasAmount(1);
    expect(response).toBe(false);
  });
  test('it should check if it has valid decimals', () => {
    const response = sendTransaction.hasValidDecimals(20, { decimals: '18' });
    expect(response).toBe(true);
  });
  test('it should get token transfer abi', () => {
    const response = sendTransaction.getTokenTransferABI(
      20,
      1,
      18,
      '0x43d29d6dc3346a812b10b572ffb52fc7668bf8ba'
    );
    expect(response).toBe(true);
  });
});
