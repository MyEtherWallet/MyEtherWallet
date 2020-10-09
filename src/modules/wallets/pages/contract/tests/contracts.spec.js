import Contracts from '../contracts';
import Web3 from 'web3';
import erc20ABI from './contractsForDeploy/Type_Demo_ABI.json';
import erc20Bytecode from './contractsForDeploy/Type_Demo_Bytecode';
import ganache from 'ganache-core';

describe('Contracts Module', () => {
  let contract, web3, addresses;

  beforeAll(done => {
    // empower between barrel artist either fantasy typical drop finish surprise million derive
    const providerOptions = {
      accounts: [
        {
          secretKey:
            '0x46f2cdf993a4f4d66d06545dd72b4d4e1e75c5a28efd00106fcd519f9912e7e3',
          balance: 1000000000000000000000000
        },
        {
          secretKey:
            '0x63df18ebe53051bf85188aa661abfd265300dc6706ce9076a3ccfc6c79b81de3',
          balance: 1000000000000000000000000
        },
        {
          secretKey:
            '0xfb90885e8156614879f911bc3efcbf484809b90ff7f9a01b47e07c40bd3a6a67',
          balance: 100000000000000000000000
        }
      ]
    };
    const provider = ganache.provider(providerOptions);
    provider.send(
      {
        jsonrpc: '2.0',
        method: 'eth_accounts',
        params: [],
        id: 0
      },
      (err, res) => {
        addresses = res.result;
        web3 = new Web3(provider, null, {
          transactionConfirmationBlocks: 1
        });
        contract = new Contracts(addresses[0], web3, 60);
        done();
      }
    );
  });
  // afterAll(() => {});
  test('it should setup', done => {
    const contractAddress = value => {
      expect(value).toBeTruthy();
    };
    contract.setStoreHandler(contractAddress);
    contract.setAbi(erc20ABI);
    contract.setByteCode(erc20Bytecode);
    contract.setDeployArg('name', 'demo');
    contract.setDeployArg('symbol', 'symbol');
    contract.setDeployArg('decimals', 10);
    const res = contract.deploy(null, true);
    res.then(() => {
      contract.setContractAddress(contract.deployedContractAddress);
      done();
    });
  });
  test('it should interact with contract - constant', done => {
    contract.selectedFunction('decimals').then(res => {
      expect(res.outputs['0'].value).toBe('10');
      done();
    });
  });
  test('it should interact with contract - write', done => {
    contract.selectedFunction('transfer').then(() => {
      contract.setSelectedMethodInputValue('value', 100);
      contract.setSelectedMethodInputValue('to', addresses[1]);
      contract.write().then(() => {
        done();
      });
    });
  });
  test('it should interact with contract - call', done => {
    contract.selectedFunction('balanceOf').then(() => {
      contract.setSelectedMethodInputValue('owner', addresses[1]);
      contract.write().then(ers => {
        expect(ers.outputs['0'].value).toBe('100');
        done();
      });
    });
  });
  test('it should interact with contract - multi-output', done => {
    contract.selectedFunction('twoOutCall').then(() => {
      contract.write().then(ers => {
        expect(Object.keys(ers.outputs).length).toBe(2);
        done();
      });
    });
  });
});
