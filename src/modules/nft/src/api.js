import fetch from 'node-fetch';

export default class API {
  constructor(options) {
    this.openSeaLambdaUrl = options.url;
    this.address = options.address;
    this.retryCount = 0;
  }

  async getTokens() {
    return new Promise((resolve, reject) => {
      console.log(`${this.openSeaLambdaUrl}/nft?address=${this.address}`); // todo remove dev item
      fetch(`${this.openSeaLambdaUrl}/nft?address=${this.address}`, {
        mode: 'cors',
        cache: 'no-cache',
        method: 'GET',
        'Cache-Control': 'no-cache'
      })
        .then(data => data.json())
        .then(newData => {
          if (newData.message) {
            throw Error(newData.message);
          }
          // console.log(newData); // todo remove dev item
          resolve(newData);
        })
        .catch(error => {
          // eslint-disable-next-line
          console.error(error);
          this.retryCount++;
          if (this.retryCount < 3) {
            setTimeout(() => {
              resolve(this.getTokens());
            }, 1000);
          } else {
            reject(error);
          }
        });
    });
  }

  async getNftDetailsApi(contract, params) {
    console.log({
      jsonrpc: '2.0',
      method: '',
      params,
      id: 83
    }); // todo remove dev item
    return await fetch(`${this.openSeaLambdaUrl}/nft`, {
      mode: 'cors',
      cache: 'no-cache',
      method: 'POST',
      'Cache-Control': 'no-cache',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: '',
        params,
        id: 83
      })
    })
      .then(data => data.json())
      .then(data => {
        // console.log(data); // todo remove dev item
        return data.result.tokenContracts.find(item => {
          return item.contractIdAddress === contract;
        });
      });
  }

  getImage(nft) {
    return `${this.openSeaLambdaUrl}/getImage?contract=${nft.contract}&tokenId=${nft.token_id}`;
  }
}
