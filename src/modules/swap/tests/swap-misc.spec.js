import Swap from '../index';
import Web3 from 'web3';
import fetch from 'jest-fetch-mock';
// import { responseSelector } from './ApiResponses/responseSelector';
//
// jest.setMock('node-fetch', fetch);

describe('Swap Module - Misc methods and functions', () => {
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
  test('it should call convertToTokenWei', done => {
    const result = swap.callOther('convertToTokenWei', 'BAT', 100);
    expect(result).toEqual('100000000000000000000');
    done();
  }, 30000);
  test('it should call convertToTokenBase', done => {
    const result = swap.callOther(
      'convertToTokenBase',
      'BAT',
      100000000000000000000
    );
    expect(result).toEqual('100');
    done();
  }, 30000);
  test('it should call calculateFromValue', done => {
    const result = swap.callOther(
      'calculateFromValue',
      100,
      0.012,
      'BAT'
    );
    expect(result).toEqual('8333.333333');
    done();
  }, 30000);
  test('it should call calculateToValue', done => {
    const result = swap.callOther(
      'calculateToValue',
      100,
      0.012,
      'BAT'
    );
    expect(result).toEqual('1.200000');
    done();
  }, 30000);
  test('it should call getProvider', done => {
    const result = swap.callOther(
      'getProvider',
      'simplex'
    );
    console.log(result); // todo remove dev item
    expect(result).toEqual(expect.anything());
    done();
  }, 30000);
  test('it should call isProvider', done => {
    const result = swap.callOther(
      'isProvider',
      'simplex'
    );
    console.log(result); // todo remove dev item
    expect(result).toBeTruthy();
    done();
  }, 30000);
});
