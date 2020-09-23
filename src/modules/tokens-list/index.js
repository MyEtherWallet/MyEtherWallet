import TokenBalance from '@myetherwallet/eth-token-balance';

export default class Tokenslist {
  constructor(network) {
    this.network = network;
  }

  // async fetchTokens(web3, account) {
    // let tokens = [];
    // const networkUrls = ['infura'];

    // if ((this.network.type.chainID === 1 || this.network.type.chainID === 3) && !this.network.url.includes(networkUrls[0])) {
    //   const tb = new TokenBalance(web3.currentProvider);
    //   try {
    //     tokens = await tb.getBalance(this.account.address, true, true, true, {
    //       gas: '0x11e1a300'
    //     });
    //     tokens = tokens.map(token => {
    //       token.address = token.addr;
    //       delete token.addr;
    //       return token;
    //     });
    //   } catch(e) {

    //   }
    // }
  // }
}