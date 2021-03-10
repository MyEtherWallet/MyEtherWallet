import fetch from 'node-fetch';
import WalletCalls from '@/apollo/queries/tokens721/index';

export default class API {
  constructor(options) {
    this.openSeaLambdaUrl = options.url;
    this.address = options.address;
    this.retryCount = 0;
    this.wallet = new WalletCalls(options.apollo);
  }

  getContractDetails(contract) {
    return fetch(
      `https://nft.mewapi.io/nft?contractHash=${contract}`
    ).then(res => res.json());
  }

  getTokens() {
    return new Promise((resolve, reject) => {
      this.wallet
        .getOwnersERC721TokensBalances(this.address)
        .then(res => {
          return resolve(res);
        })
        .catch(reject);
    });
  }

  getNftDetailsApi(contract, params) {
    return this.wallet.getOwnersERC721Tokens(params.address, contract);
  }

  getImage(nft) {
    return `${this.openSeaLambdaUrl}/getImage?contract=${nft.contract}&tokenId=${nft.token_id}`;
  }
}
