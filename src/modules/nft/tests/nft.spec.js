import NFT from '../index';
import API from '../src/api';
import configs from '../src/config';
describe('NFT Module', () => {
  describe.each([
    '0x43689531907482bee7e650d18411e284a7337a66',
    '0xab95286ca61b7c94659d853f1fba629508ab4d67'
  ])('NFT API Module', address => {
    let pairsToTest = [];
    let api;
    beforeAll(() => {
      api = new API({ address: address, url: configs.url });
    });
    test('it should get owned contract tokens and counts', done => {
      api.getTokens().then(res => {
        const pairs = res.tokenContracts.reduce((acc, cur) => {
          acc.push([address, cur.contractIdAddress]);
          return acc;
        }, []);
        pairsToTest = [...pairsToTest, ...pairs];
        expect(res).toEqual(expect.anything());
        done();
      });
    });
    test('it should get tokens ids owned by contract', done => {
      const hasContract = pairsToTest.find(item => {
        return item[0] === address;
      });
      const params = {
        address: address,
        contractAddresses: [hasContract[1]]
      };
      api.getNftDetailsApi(hasContract[1], params).then(res => {
        expect(res).toEqual(expect.anything());
        done();
      });
    }, 10000);
  });
  describe('NFT Module Core', () => {
    const pairsToTest = [
      [
        '0x43689531907482bee7e650d18411e284a7337a66',
        '0xd1e5b0ff1287aa9f9a268759062e4ab08b9dacbe'
      ],
      [
        '0x43689531907482bee7e650d18411e284a7337a66',
        '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'
      ],
      [
        '0x43689531907482bee7e650d18411e284a7337a66',
        '0x41a322b28d0ff354040e2cbc676f0320d8c8850d'
      ],
      [
        '0x43689531907482bee7e650d18411e284a7337a66',
        '0x06a6a7af298129e3a2ab396c9c06f91d3c54aba8'
      ],
      [
        '0x43689531907482bee7e650d18411e284a7337a66',
        '0x87d598064c736dd0c712d329afcfaa0ccc1921a1'
      ],
      [
        '0x43689531907482bee7e650d18411e284a7337a66',
        '0xe272fddbd056240149c771f9fd917fa040dceb39'
      ],
      [
        '0x43689531907482bee7e650d18411e284a7337a66',
        '0xb06ece7b0d5399ea0c381985f69585fdc355c5e4'
      ],
      [
        '0x43689531907482bee7e650d18411e284a7337a66',
        '0x06012c8cf97bead5deae237070f9587f8e7a266d'
      ],
      [
        '0x43689531907482bee7e650d18411e284a7337a66',
        '0x4f41d10f7e67fd16bde916b4a6dc3dd101c57394'
      ],
      [
        '0xab95286ca61b7c94659d853f1fba629508ab4d67',
        '0x81dc9934094b65b704ba9388c27089dbe2c5fb6e'
      ],
      [
        '0xab95286ca61b7c94659d853f1fba629508ab4d67',
        '0xd7fbd072cf99146abcffa0ff4acf51b866a70433'
      ],
      [
        '0xab95286ca61b7c94659d853f1fba629508ab4d67',
        '0x564cb55c655f727b61d9baf258b547ca04e9e548'
      ],
      [
        '0xab95286ca61b7c94659d853f1fba629508ab4d67',
        '0xc328520a8b1cead2489d59c16b7752cb60ebb53d'
      ],
      [
        '0xab95286ca61b7c94659d853f1fba629508ab4d67',
        '0xa5e5be69c923c701ae6ac8f1f5936af3ae610c68'
      ]
    ];
    let tokensShown = [];
    describe.each(pairsToTest)(
      'NFT Core Module 1',
      (address, contractAddress) => {
        let nft;
        beforeAll(done => {
          nft = new NFT({
            address
          });
          nft.init(contractAddress).then(() => {
            done();
          });
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
            console.log('no next page'); // todo remove dev item
            done();
          }
        }, 10000);
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
            expect(tokensShown).toEqual(
              expect.arrayContaining(nextTokensShown)
            );
            done();
          });
        }, 10000);
      }, 10000
    );
  })

  describe('NFT Core Module Check with a nft not owned by address', () => {
    let tokensShown = [];
    const address = '0x43689531907482bee7e650d18411e284a7337a66';
    // const contractAddress = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85';
    const contractAddress = '0xc328520a8b1cead2489d59c16b7752cb60ebb53d'
    let nft;
    beforeAll(done => {
      const errorHandler = (err) =>{
        console.log("ERROR HANDLER"); // todo remove dev item
        console.log(err); // todo remove dev item
      }
      nft = new NFT({
        address,
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
        console.log('no next page'); // todo remove dev item
        done();
      }
    }, 1000000);
  });

  describe('NFT Core Module (Manual check)', () => {
    let tokensShown = [];
    const address = '0x43689531907482bee7e650d18411e284a7337a66';
    const contractAddress = '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85';
    // const contractAddress = '0xc328520a8b1cead2489d59c16b7752cb60ebb53d'
    let nft;
    beforeAll(done => {
      const errorHandler = (err) =>{
        console.log("ERROR HANDLER"); // todo remove dev item
        console.log(err); // todo remove dev item
      }
      nft = new NFT({
        address,
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
        console.log('no next page'); // todo remove dev item
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
        expect(tokensShown).toEqual(
          expect.arrayContaining(nextTokensShown)
        );
        done();
      });
    }, 10000);
  });
});
