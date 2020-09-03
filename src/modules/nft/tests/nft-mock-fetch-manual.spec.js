import fetch from 'jest-fetch-mock';
import NFT from '../index';
import mockDataa66 from './mockData-0x43689531907482bee7e650d18411e284a7337a66';
import mockDatad67 from './mockData-0xab95286ca61b7c94659d853f1fba629508ab4d67';
import Web3 from 'web3';

jest.setMock('node-fetch', fetch);
// useful for debugging independent of api call and using only 2 test suits versus the dozen in the ci test

xdescribe('NFT Module (Mock Fetch Manual Test Suite)', () => {
  const web3 = new Web3(
    'https://mainnet.infura.io/v3/7d06294ad2bd432887eada360c5e1986'
  );
  beforeAll(() => {
    fetch.enableMocks();
  });
  afterAll(() => {
    fetch.disableMocks();
  });

  describe('NFT Core Module', () => {
    let tokensShown = [];
    // Dev account and ENS
    // const address = '0x43689531907482bee7e650d18411e284a7337a66';
    // const contractAddress = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85';
    // Random account and token where account has 1K+ tokens
    const address = '0xab95286ca61b7c94659d853f1fba629508ab4d67';
    const contractAddress = '0x564cb55c655f727b61d9baf258b547ca04e9e548';
    let nft;
    beforeAll(done => {
      if (address === '0xab95286ca61b7c94659d853f1fba629508ab4d67') {
        fetch.mockResponse(req => {
          if (req.method === 'POST') {
            return Promise.resolve(JSON.stringify({ result: mockDatad67 }));
          }
          return Promise.resolve(JSON.stringify(mockDatad67));
        });
      } else {
        fetch.mockResponse(req => {
          if (req.method === 'POST') {
            return Promise.resolve(JSON.stringify({ result: mockDataa66 }));
          }
          return Promise.resolve(JSON.stringify(mockDataa66));
        });
      }
      const errorHandler = err => {
        // eslint-disable-next-line
        console.log('ERROR HANDLER');
        // eslint-disable-next-line
        console.log(err);
      };
      nft = new NFT({
        address,
        web3,
        errorHandler
      });
      nft.init(contractAddress).then(() => {
        done();
      });
    }, 10000);
    test('it should activate a contract', done => {
      nft.setActiveContract(contractAddress).then(() => {
        done();
      });
    }, 10000);
    test('it should get available nft contracts', () => {
      const contracts = nft.getAvailableContracts();
      expect(contracts.length).toBeGreaterThan(1);
    }, 10000);
    test('it should get display values for active nft contract', done => {
      nft.getPageValues().then(values => {
        let expected = 9;
        expect(values.name).toEqual(expect.anything());
        expect(values.currentPage).toEqual(1);
        expect(values.count).toBeGreaterThan(0);
        if (values.count <= 9) {
          expected = values.count;
        }
        expect(values.tokens.length).toEqual(expected);

        tokensShown = values.tokens.reduce((acc, val) => {
          acc.push(val.token_id);
          return acc;
        }, []);
        done();
      });
    }, 10000);
    test('it should get display values for next page', done => {
      if (nft.hasNextPage()) {
        nft.nextPage().then(values => {
          let expected = 9;
          expect(values.name).toEqual(expect.anything());
          expect(values.currentPage).toEqual(2);
          expect(values.count).toBeGreaterThan(0);
          if (values.count <= 9) {
            expected = 0;
          } else if (values.count < 18) {
            expected = values.count - 9;
          }
          expect(values.tokens.length).toEqual(expected);
          const nextTokensShown = values.tokens.reduce((acc, val) => {
            acc.push(val.token_id);
            return acc;
          }, []);
          expect(tokensShown).toEqual(
            expect.not.arrayContaining(nextTokensShown)
          );
          done();
        });
      } else {
        // eslint-disable-next-line
        console.log('no next page');
        done();
      }
    }, 1000000);
    test('it should get display values for prior page', done => {
      nft.priorPage().then(values => {
        let expected = 9;
        expect(values.name).toEqual(expect.anything());
        expect(values.currentPage).toEqual(1);
        expect(values.count).toBeGreaterThan(0);
        if (values.count <= 9) {
          expected = 0;
        } else if (values.count < 18) {
          expected = values.count - 9;
        }
        expect(values.tokens.length).toEqual(expected);
        const nextTokensShown = values.tokens.reduce((acc, val) => {
          acc.push(val.token_id);
          return acc;
        }, []);
        expect(tokensShown).toEqual(expect.arrayContaining(nextTokensShown));
        done();
      });
    }, 10000);
  });

  describe('NFT Core Module Check with a nft not owned by address', () => {
    let tokensShown = [];
    const address = '0x43689531907482bee7e650d18411e284a7337a66';
    const contractAddress = '0xc328520a8b1cead2489d59c16b7752cb60ebb53d';
    let nft;
    beforeAll(done => {
      const errorHandler = err => {
        // eslint-disable-next-line
        console.log('ERROR HANDLER');
        // eslint-disable-next-line
        console.log(err);
      };
      nft = new NFT({
        address,
        web3,
        errorHandler
      });
      nft.init(contractAddress).then(() => {
        done();
      });
    }, 10000);
    afterAll(() => {
      fetch.resetMocks();
    });
    test('it should activate a contract', done => {
      nft.setActiveContract(contractAddress).then(() => {
        done();
      });
    }, 10000);
    test('it should get available nft contracts', () => {
      const contracts = nft.getAvailableContracts();
      expect(contracts.length).toBeGreaterThan(1);
    }, 10000);
    test('it should get display values for active nft contract', done => {
      nft.getPageValues().then(values => {
        let expected = 9;
        expect(values.name).toEqual(expect.anything());
        expect(values.currentPage).toEqual(0);
        expect(values.count).toEqual(0);
        if (values.count <= 9) {
          expected = values.count;
        }
        expect(values.tokens.length).toEqual(expected);

        tokensShown = values.tokens.reduce((acc, val) => {
          acc.push(val.token_id);
          return acc;
        }, []);
        done();
      });
    }, 10000);
    test('it should get display values for next page', done => {
      if (nft.hasNextPage()) {
        nft.nextPage().then(values => {
          let expected = 9;
          expect(values.name).toEqual(expect.anything());
          expect(values.currentPage).toEqual(2);
          expect(values.count).toBeGreaterThan(0);
          if (values.count <= 9) {
            expected = 0;
          } else if (values.count < 18) {
            expected = values.count - 9;
          }
          expect(values.tokens.length).toEqual(expected);
          const nextTokensShown = values.tokens.reduce((acc, val) => {
            acc.push(val.token_id);
            return acc;
          }, []);
          expect(tokensShown).toEqual(
            expect.not.arrayContaining(nextTokensShown)
          );
          done();
        });
      } else {
        // eslint-disable-next-line
        console.log('no next page');
        done();
      }
    }, 1000000);
  });
});
