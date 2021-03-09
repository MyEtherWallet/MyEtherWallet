import {
  getOwnersERC721Balances,
  getOwnersERC721Tokens
} from './tokens721.graphql';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import BigNumber from 'bignumber.js';

export default class Tokenslist {
  constructor(apollo) {
    this.apollo = apollo;
  }
  getOwnersERC721TokensBalances(hash) {
    return this.apollo
      .query({
        query: getOwnersERC721Balances,
        variables: {
          hash: hash
        }
      })
      .then(response => {
        if (response && response.data) {
          return this.formatOwnersERC721TokenCount(response.data, hash);
        }
      })
      .catch(error => {
        return Toast(error.message, {}, ERROR);
      });
  }
  formatOwnersERC721TokenCount(tokens, address) {
    return {
      address: address,
      tokenContracts: tokens.getOwnersERC721Balances.map(item => {
        return {
          contractAddresses: [item.tokenInfo.contract],
          contractIdAddress: item.tokenInfo.contract,
          contracts: [item.tokenInfo.contract],
          name: item.tokenInfo.name,
          owned_asset_count: BigNumber(item.balance).toFixed(0),
          retrievedTo: 0,
          tokens: []
        };
      })
    };
  }
  getOwnersERC721Tokens(owner, contract, details) {
    return this.apollo
      .query({
        query: getOwnersERC721Tokens,
        variables: {
          owner: owner,
          contract: contract
        }
      })
      .then(response => {
        if (response && response.data) {
          // return response.data;
          return this.formatOwnersERC721Tokens(
            response.data,
            contract,
            details
          );
        }
      })
      .catch(error => {
        return Toast(error.message, {}, ERROR);
      });
  }
  formatOwnersERC721Tokens(tokens, contract) {
    try {
      return {
        contractIdAddress: contract,
        tokens: tokens.getOwnersERC721Tokens.tokens.map(item => {
          return {
            description: item.tokenInfo.name,
            token_id: BigNumber(item.token).toFixed(0),
            name: item.tokenInfo.name,
            contract: item.tokenInfo.contract
          };
        })
      };
    } catch (e) {
      return {
        contractIdAddress: contract,
        tokens: []
      };
    }
  }
}
