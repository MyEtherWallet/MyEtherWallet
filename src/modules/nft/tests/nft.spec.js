import NFT from '../index';
import API from '../src/api';
import configs from '../src/config';
const address = '0x43689531907482bee7e650d18411e284a7337a66';
const contractAddress = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85';
const nft = new NFT({
  address
});
describe('NFT Module', () => {
  describe('NFT API Module', () => {
    let api;
    beforeAll(() => {
      api = new API({ address: address, url: configs.url });
    });
    test('it should get owned contract tokens and counts', done => {
      api.getTokens().then(res => {
        console.log(res); // todo remove dev item
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
        console.log(res); // todo remove dev item
        expect(res).toEqual(expect.anything());
        done();
      });
    }, 10000);
  });
  describe('NFT Core Module', () => {
    beforeAll(done => {
      nft.init(contractAddress).then(() => {
        done();
      });
    });
    test('it should get nfts to show', done => {
      console.log(nft); // todo remove dev item
      nft.setSelectedContract(contractAddress);
      const res = nft.selectNftsToShow();
      console.log(res); // todo remove dev item
      expect(res).toEqual(expect.anything());
      done();
    });
    test('it should get next set of nfts to show', done => {
      nft.incrementPage().then(res => {
        console.log(res); // todo remove dev item
        expect(res).toEqual(expect.anything());
        done();
      });
    }, 10000);
    test('it should report the number of tokens returned', done => {
     const tokenSet =  nft.getActiveContract(contractAddress);
      console.log(tokenSet.count); // todo remove dev item
      console.log('tokenSet.getRetrievedCount()', tokenSet.getRetrievedCount()); // todo remove dev item
      tokenSet.getNext().then(res => {
        console.log('tokenSet.getRetrievedCount()', tokenSet.getRetrievedCount()); // todo remove dev item
        expect(res).toEqual(expect.anything());
        done();
      });
    }, 10000);
    test('it should retrieve the next set of tokens', done => {
      const tokenSet =  nft.getActiveContract(contractAddress);
      console.log(tokenSet.currentPage); // todo remove dev item
      tokenSet.getNext().then(() => {
        console.log(tokenSet.currentPage); // todo remove dev item
        tokenSet.getNext().then(res => {
          console.log(tokenSet.currentPage); // todo remove dev item
          // console.log(res); // todo remove dev item
          expect(res).toEqual(expect.anything());
          done();
        });
      });
    }, 10000);



    // getActiveTokenSet
  });
});
