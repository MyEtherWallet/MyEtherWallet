/**
 * Module Nft Apollo Mixin
 */
 import {
  getOwnersERC721Balances,
  getOwnersERC721Tokens
} from '@/apollo/queries/tokens721/tokens721.graphql';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import BigNumber from 'bignumber.js';
// import NftCollection from './handlerNftCollection';

export default {
  name: 'HandlerNft',
  data() {
    return {
      getOwnersERC721Balances: '',
      erc721Tokens: {},
      getOwnersERC721Tokens: '',
      contract: '',
      nextKey: ''
    };
  },
  apollo: {
    /**
     * Apollo query to get owners ERC721 balances
     */
    getOwnersERC721Balances: {
      query: getOwnersERC721Balances,
      variables() {
        return {
          hash: this.address
        };
      },
      skip() {
        return !this.address || this.address === null || !this.isEthNetwork;
      },
      async result({ data }) {
        if (data && data.getOwnersERC721Balances) {
          const promiseContracts = data.getOwnersERC721Balances.map(tkn => {
            return {
              count: BigNumber(tkn.balance).toFixed(0),
              name: this._getName(tkn),
              contract: tkn.tokenInfo.contract
            };
          });
          const resolveContracts = await Promise.all(promiseContracts);
          console.errro("resolveContracts", resolveContracts)
          this.contracts = resolveContracts;
          this.selectedContract = this.contracts[0].contract;
        }
      },
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    },
    /**
     * Apollo query to get owners ERC721 tokens
     */
    getOwnersERC721Tokens: {
      query: getOwnersERC721Tokens,
      variables() {
        return {
          owner: this.address,
          contract: this.selectedContract,
          nextKey: this.nextKey
        };
      },
      skip() {
        return (
          !this.address ||
          this.address === null ||
          !this.isEthNetwork ||
          !this.selectedContract
        );
      },
      result({ data }) {
        console.error('erc721 token', data);
      },
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    }
  },
  methods: {
    async _getName(tkn) {
      return await fetch(`https://nft.mewapi.io/nft?contractHash=${tkn.tokenInfo.contract}`)
        .then(res => res.json())
        .then(json => {
          if (json.tokenContracts) {
            tkn.tokenInfo.name = json.tokenContracts[0].name || 'Unknown Nft';
          } else {
            tkn.tokenInfo.name = json.name;
          }
          return tkn;
        });
    }
  }
};
