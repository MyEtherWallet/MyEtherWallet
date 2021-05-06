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
      result({ data }) {
        if (data && data.getOwnersERC721Balances) {
          this.contracts = data.getOwnersERC721Balances.map(tkn => {
            const tokenContract = tkn.tokenInfo.contract;
            const name = this._getName(tokenContract);
            console.error('name', name);
            return {
              count: BigNumber(tkn.balance).toFixed(0),
              name: name,
              contract: tokenContract
            };
          });
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
    async _getName(contract) {
      return await fetch(`https://nft.mewapi.io/nft?contractHash=${contract}`)
        .then(res => res.json())
        .then(json => {
          if (json.tokenContracts) {
            return json.tokenContracts[0].name || 'Unknown Nft';
          }
          return json.name;
        });
    }
  }
};
