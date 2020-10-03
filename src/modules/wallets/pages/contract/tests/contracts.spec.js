import Contracts from '../contracts';
import Web3 from 'web3';
import tempDevAbi from './tempDevAbi';
import erc20ABI from './contractsForDeploy/ERC20_ABI.json';
import erc20Bytecode from './contractsForDeploy/ERC20_Bytecode';
// import fetch from 'jest-fetch-mock';
import ganache from 'ganache-core';
// const useMockFetch = false;

// console.log(ganache); // todo remove dev item
// jest.setMock('node-fetch', fetch);

describe('Contracts Module', () => {
  let contract, web3, addresses;

  beforeAll(done => {
    const testKeyPath = __dirname + '/testkeys.json';
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
      // account_keys_path: testKeyPath
      // total_accounts: 10
    };
    const provider = ganache.provider(providerOptions);
    // const keys = fs.readFileSync(testKeyPath, 'utf8');
    // console.log(keys.addresses); // todo remove dev item
    // console.log(Object.keys(keys)); // todo remove dev item
    provider.send(
      {
        jsonrpc: '2.0',
        method: 'eth_accounts',
        params: [],
        id: 0
      },
      (err, res) => {
        console.log(res); // todo remove dev item
        console.log(err); // todo remove dev item
        addresses = res.result;
        web3 = new Web3(provider, null, {
          transactionConfirmationBlocks: 1
        });
        // console.log(web3.eth.personal.listAccounts); // todo remove dev item
        // console.log(web3.eth.accounts); // todo remove dev item
        contract = new Contracts(addresses[0], web3, 60);
        done();
      }
    );
    // console.log(provider.listAccounts()); // todo remove dev item

    // fetch.enableMocks();
    // fetch.resetMocks();
    // fetch.mockResponse(responseSelector);
  });
  // afterAll(() => {});
  test('it should setup', done => {
    const contractAddress = value => {
      expect(value).toBeTruthy();
      console.log(value); // todo remove dev item
    };
    contract.setStoreHandler(contractAddress);
    contract.setAbi(erc20ABI);
    contract.setByteCode(erc20Bytecode);
    console.log(contract.abiConstructor); // todo remove dev item
    console.log(contract.deployArgs); // todo remove dev item
    contract.setDeployArg('name', 'demo');
    contract.setDeployArg('symbol', 'symbol');
    contract.setDeployArg('decimals', 10);
    console.log(Object.values(contract.constructorInputs)); // todo remove dev item
    console.log(contract.constructorInputs); // todo remove dev item
    console.log(contract.hasABI); // todo remove dev item
    console.log(contract.hasConstructorABI); // todo remove dev item
    console.log(contract.canDeploy); // todo remove dev item
    // Object.values(contract.constructorInputs).every(item => {
    //   console.log(item); // todo remove dev item
    //   return item.value !== null && item.valid;
    // })
    const res = contract.deploy()
    console.log(res); // todo remove dev item
    res.then(promiEvent => {
      console.log(promiEvent); // todo remove dev item
      done();
    });
    // done();
  });
  test('it should deploy contract', done => {
    contract.selectedFunction('transfer');
    contract.setSelectedMethodInputValue('from', addresses[0], 'to', addresses[1]);
    contract.write()
      .then(ers => {
        console.log(ers); // todo remove dev item
        done()
      })
    // contract.setSelectedMethodInputValue();




    // done();
  });
});
