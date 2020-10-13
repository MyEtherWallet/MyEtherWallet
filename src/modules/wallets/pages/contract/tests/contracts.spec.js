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



  test('it should check static methods', done => {
    const res = Contracts.isContractArgValid(1,
      Contracts.getType('int').solidityType)
    expect(res).toBe(true);
    done();
  });


  test('it should be empty and statuses are false', done => {
    expect(contract.hasABI).toBe(false);
    expect(contract.abiValid).toBe(false);
    expect(contract.byteCodeValid).toBe(false);
    expect(contract.payableConstructor).toBe(false);
    expect(contract.hasConstructorABI).toBe(false);
    expect(contract.canDeploy).toBe(false);
    expect(contract.hasContractAddress).toBe(false);
    expect(contract.hasOutputs).toBe(false);
    expect(contract.contractActive).toBe(false);
    expect(contract.isMethodConstant).toBe(false);
    expect(contract.deployedContractAddress).toBe('');
    expect(contract.constructorInputs).toStrictEqual({});
    expect(contract.contractMethodNames).toStrictEqual([]);

    done();
  });
  test('it should note invalid ABI - 1', done => {
    contract.setAbi(undefined);
    expect(contract.hasABI).toBe(false);
    expect(contract.abiValid).toBe(false);
    done();
  });
  test('it should note invalid ABI - 2', done => {
    contract.setAbi([{inputs: [], name: 'name', outputs: []}]);
    expect(contract.hasABI).toBe(true);
    expect(contract.abiValid).toBe(false);
    done();
  });
  test('it should set ABI', done => {
    contract.setAbi(erc20ABI);
    expect(contract.hasABI).toBe(true);
    expect(contract.abiValid).toBe(true);

    expect(contract.byteCodeValid).toBe(false);
    expect(contract.payableConstructor).toBe(false);
    expect(contract.hasConstructorABI).toBe(false);
    expect(contract.canDeploy).toBe(false);
    expect(contract.constructorInputs).toStrictEqual({});
    done();
  });
  test('it should note invalid bytecode - 1', done => {
    contract.setByteCode(undefined);
    expect(contract.byteCodeValid).toBe(false);
    expect(contract.payableConstructor).toBe(false);
    expect(contract.hasConstructorABI).toBe(false);
    expect(contract.canDeploy).toBe(false);
    // expect(contract.constructorInputs).toStrictEqual({});
    done();
  });
  test('it should note invalid bytecode - 2', done => {
    contract.setByteCode('lkjlkjlkjlkjlkjlkj');
    expect(contract.byteCodeValid).toBe(false);
    expect(contract.payableConstructor).toBe(false);
    expect(contract.hasConstructorABI).toBe(false);
    expect(contract.canDeploy).toBe(false);
    done();
  });
  test('it should set bytecode', done => {
    contract.setByteCode(erc20Bytecode);
    expect(contract.byteCodeValid).toBe(true);
    expect(contract.payableConstructor).toBe(false);
    expect(contract.hasConstructorABI).toBe(true);
    expect(contract.canDeploy).toBe(false);
    done();
  });
  test('it should setup', done => {
    contract.setDeployArg('name', 'demo');
    expect(contract.canDeploy).toBe(false);
    contract.setDeployArg('symbol', 'symbol');
    expect(contract.canDeploy).toBe(false);
    contract.setDeployArg('decimals', 10);
    expect(contract.canDeploy).toBe(true);
    const saveName = 'test with token';
    contract.updateGasPrice(20);
    expect(contract.deployer.gasPrice).toBe(20);
    expect(contract.gasPrice).toBe(20);
    const res = contract.deploy(null, saveName);
    res.then(() => {
      const itemIndex = JSON.parse(
        window.localStorage.getItem('customContracts')
      ).findIndex(item => {
        return item.name.toLowerCase() === saveName.toLowerCase();
      });
      expect(itemIndex).not.toEqual(-1);
      done();
    });
  });
  test('it should report proper statuses ', done => {
    expect(contract.hasABI).toBe(false);
    expect(contract.abiValid).toBe(false);
    expect(contract.byteCodeValid).toBe(false);
    expect(contract.payableConstructor).toBe(false);
    expect(contract.hasConstructorABI).toBe(false);
    expect(contract.canDeploy).toBe(false);
    expect(contract.hasContractAddress).toBe(false);
    expect(contract.hasOutputs).toBe(false);
    expect(contract.contractActive).toBe(false);
    expect(contract.isMethodConstant).toBe(false);
    expect(contract.deployedContractAddress).not.toBe('');
    expect(contract.constructorInputs).toStrictEqual({});
    expect(contract.contractMethodNames).toStrictEqual([]);
    done();
  });
  test('it should setup interact with contract', done => {
    contract.setContractAddress('');
    contract.setContractAddress(contract.deployedContractAddress);
    contract.setAbi(erc20ABI);
    expect(contract.contractMethodNames).toStrictEqual([
      'DECIMALS',
      'INITIAL_SUPPLY',
      'allowance',
      'approve',
      'balanceOf',
      'bar',
      'decimals',
      'decreaseAllowance',
      'getbar',
      'increaseAllowance',
      'name',
      'symbol',
      'totalSupply',
      'transfer',
      'transferFrom',
      'twoOut',
      'twoOutCall',
      'twoOutCallTwo'
    ]);
    contract.selectedFunction('decimals').then(res => {
      expect(res.outputs['0'].value).toBe('10');
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
      expect(contract.inputsValid).toBe(false);
      expect(contract.selectedMethodInputs).toStrictEqual({
        to: {
          internalType: 'address',
          name: 'to',
          type: 'address',
          valid: false,
          value: null,
          result: null
        },
        value: {
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
          valid: false,
          value: null,
          result: null
        }
      });
      contract.setSelectedMethodInputValue('value', 100);
      expect(contract.selectedMethodInputs).toStrictEqual({
        to: {
          internalType: 'address',
          name: 'to',
          type: 'address',
          valid: false,
          value: null,
          result: null
        },
        value: {
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
          valid: true,
          value: 100,
          result: null
        }
      });
      contract.setSelectedMethodInputValue('to', 'sdfsdfsdf');
      expect(contract.selectedMethodInputs).toStrictEqual({
        to: {
          internalType: 'address',
          name: 'to',
          type: 'address',
          valid: false,
          value: 'sdfsdfsdf',
          result: null
        },
        value: {
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
          valid: true,
          value: 100,
          result: null
        }
      });
      expect(contract.inputsValid).toBe(false);
      contract.setSelectedMethodInputValue('to', addresses[1]);
      expect(contract.selectedMethodInputs).toStrictEqual({
        to: {
          internalType: 'address',
          name: 'to',
          type: 'address',
          valid: true,
          value: '0x09b5ff19ad6636f0f3fcc13cd9cd5176565bf9e4',
          result: null
        },
        value: {
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
          valid: true,
          value: 100,
          result: null
        }
      });
      expect(contract.inputsValid).toBe(true);
      contract.write().then(() => {
        done();
      });
    });
  });
  test('it should interact with contract - call', done => {
    contract.selectedFunction('balanceOf').then(() => {
      expect(contract.inputsValid).toBe(false);
      contract.setSelectedMethodInputValue('owner', addresses[1]);
      expect(contract.inputsValid).toBe(true);
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
  test('it should reset values', done => {
    contract.reset();
    expect(contract.hasABI).toBe(false);
    expect(contract.abiValid).toBe(false);
    expect(contract.byteCodeValid).toBe(false);
    expect(contract.payableConstructor).toBe(false);
    expect(contract.hasConstructorABI).toBe(false);
    expect(contract.canDeploy).toBe(false);
    expect(contract.hasContractAddress).toBe(false);
    expect(contract.hasOutputs).toBe(false);
    expect(contract.contractActive).toBe(false);
    expect(contract.isMethodConstant).toBe(false);
    expect(contract.deployedContractAddress).toBe('');
    expect(contract.constructorInputs).toStrictEqual({});
    expect(contract.contractMethodNames).toStrictEqual([]);

    done();
  });
});
