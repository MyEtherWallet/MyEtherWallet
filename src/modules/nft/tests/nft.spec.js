import NFT from '../index';
import API from '../src/api';
import configs from '../src/config';
// const address = '0x43689531907482bee7e650d18411e284a7337a66';
const address = '0xab95286ca61b7c94659d853f1fba629508ab4d67';
// const contractAddress = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85';
// const contractAddress = '0x564cb55c655f727b61d9baf258b547ca04e9e548';
// const contractAddress2 = '0x06012c8cf97bead5deae237070f9587f8e7a266d';
// const contractAddress2 = '0xa5e5be69c923c701ae6ac8f1f5936af3ae610c68';
// const nft = new NFT({
//   address
// });
describe('NFT Module', () => {
  describe('NFT API Module', () => {
    // const contractAddress = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85';
    const contractAddress = '0x564cb55c655f727b61d9baf258b547ca04e9e548';
    // const contractAddress2 = '0x06012c8cf97bead5deae237070f9587f8e7a266d';
    const contractAddress2 = '0xa5e5be69c923c701ae6ac8f1f5936af3ae610c68';
    let api;
    beforeAll(() => {
      api = new API({ address: address, url: configs.url });
    });
    test('it should get owned contract tokens and counts', done => {
      api.getTokens().then(res => {
        // console.log(res); // todo remove dev item
        expect(res).toEqual(expect.anything());
        done();
      });
    });
    test('it should get tokens ids owned by contract', done => {
      const params = {
        address: address,
        contractAddresses: [contractAddress]
      };
      api.getNftDetailsApi(contractAddress, params).then(res => {
        // console.log(res); // todo remove dev item
        expect(res).toEqual(expect.anything());
        done();
      });
    }, 10000);
  });
  describe('NFT Core Module', () => {
    describe('NFT Core Module 1', () => {
      const address = '0xab95286ca61b7c94659d853f1fba629508ab4d67';
      const contractAddress = '0x564cb55c655f727b61d9baf258b547ca04e9e548';
      let nft;
      beforeAll(done => {
        nft = new NFT({
          address
        });
        nft.init(contractAddress).then(() => {
          done();
        });
      });
      test('it should get available nft contracts', () => {
        const contracts = nft.getAvailableContracts();
        expect(contracts.length).toBeGreaterThan(1);
      }, 10000);
      test('it should set the active contract', done => {
        nft.setActiveContract(contractAddress).then(() => {
          done();
        });
      }, 10000);
      let tokensShown = [];
      test('it should get display values for active nft contract', done => {
        const values = nft.getPageValues();
        expect(values.name).toEqual(expect.anything());
        expect(values.currentPage).toEqual(1);
        expect(values.totalTokens).toBeGreaterThan(0);
        expect(values.tokens.length).toEqual(9);

        tokensShown = values.tokens.reduce((acc, val) => {
          acc.push(val.token_id);
          return acc;
        }, []);
        done();
      }, 10000);
      test('it should get display values for next page', done => {
        nft.nextPage().then(values => {
          expect(values.name).toEqual(expect.anything());
          expect(values.currentPage).toEqual(2);
          expect(values.totalTokens).toBeGreaterThan(0);
          const nextTokensShown = values.tokens.reduce((acc, val) => {
            acc.push(val.token_id);
            return acc;
          }, []);
          expect(tokensShown).toEqual(
            expect.not.arrayContaining(nextTokensShown)
          );
          done();
        });
      }, 10000);
    });
    describe('NFT Core Module 1-2', () => {
      const address = '0x43689531907482bee7e650d18411e284a7337a66';
      const contractAddress = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85';
      // const contractAddress = '0x564cb55c655f727b61d9baf258b547ca04e9e548';
      let nft;
      beforeAll(done => {
        nft = new NFT({
          address
        });
        nft.init(contractAddress).then(() => {
          done();
        });
      });
      test('it should get available nft contracts', () => {
        const contracts = nft.getAvailableContracts();
        expect(contracts.length).toBeGreaterThan(1);
      }, 10000);
      test('it should set the active contract', done => {
        nft.setActiveContract(contractAddress).then(() => {
          done();
        });
      }, 10000);
      let tokensShown = [];
      test('it should get display values for active nft contract', done => {
        const values = nft.getPageValues();
        expect(values.name).toEqual(expect.anything());
        expect(values.currentPage).toEqual(1);
        expect(values.totalTokens).toBeGreaterThan(0);
        expect(values.tokens.length).toEqual(9);

        tokensShown = values.tokens.reduce((acc, val) => {
          acc.push(val.token_id);
          return acc;
        }, []);
        done();
      }, 10000);
      test('it should get display values for next page', done => {
        nft.nextPage().then(values => {
          expect(values.name).toEqual(expect.anything());
          expect(values.currentPage).toEqual(2);
          expect(values.totalTokens).toBeGreaterThan(0);
          const nextTokensShown = values.tokens.reduce((acc, val) => {
            acc.push(val.token_id);
            return acc;
          }, []);
          expect(tokensShown).toEqual(
            expect.not.arrayContaining(nextTokensShown)
          );
          done();
        });
      }, 10000);
    });
  });

  xdescribe('NFT Core Module 2', () => {
    // const contractAddress = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85';
    const contractAddress = '0x564cb55c655f727b61d9baf258b547ca04e9e548';
    // const contractAddress2 = '0x06012c8cf97bead5deae237070f9587f8e7a266d';
    const contractAddress2 = '0xa5e5be69c923c701ae6ac8f1f5936af3ae610c68';
    let nft;
    beforeAll(done => {
      nft = new NFT({
        address
      });
      nft.init(contractAddress).then(() => {
        done();
      });
    });
    test('it should get nfts to show', done => {
      console.log(nft); // todo remove dev item
      nft.setSelectedContract(contractAddress);
      const res = nft.selectNftsToShow();
      // console.log(res); // todo remove dev item
      expect(res).toEqual(expect.anything());
      done();
    });
    test('it should get next set of nfts to show', done => {
      nft.incrementPage().then(res => {
        // console.log(res); // todo remove dev item
        expect(res).toEqual(expect.anything());
        done();
      });
    }, 10000);
    test('it should report the number of tokens returned', done => {
      nft.getActiveContract(contractAddress).then(tokenSet => {
        console.log(tokenSet.count); // todo remove dev item
        console.log(
          'tokenSet.getRetrievedCount()',
          tokenSet.getRetrievedCount()
        ); // todo remove dev item
        expect(tokenSet.getRetrievedCount()).toEqual(expect.anything());
        tokenSet.getPrevious();
        done();
      });
    }, 10000);
    test('it should increment the set of tokens', done => {
      nft.getActiveContract(contractAddress).then(tokenSet => {
        expect(tokenSet.currentPage).toEqual(0);
        tokenSet.getNext().then(() => {
          expect(tokenSet.currentPage).toEqual(1);
          tokenSet.getNext().then(() => {
            expect(tokenSet.currentPage).toEqual(2);
            done();
          });
        });
      });
    }, 10000);
    test('it should retrieve the set of tokens', done => {
      nft.getActiveContract(contractAddress).then(tokenSet => {
        tokenSet.getNext().then(tokens => {
          expect(tokens.length).toEqual(9);
          done();
        });
      });
    }, 10000);
    test('it should retrieve a different set of tokens', done => {
      let expected = 9;
      nft.getActiveContract(contractAddress2).then(tokenSet => {
        if (tokenSet.count < 9) {
          expected = tokenSet.count;
        }
        tokenSet.getNext().then(tokens => {
          expect(tokens.length).toEqual(expected);
          done();
        });
      });
    }, 10000);
    // getActiveTokenSet
  });
});
