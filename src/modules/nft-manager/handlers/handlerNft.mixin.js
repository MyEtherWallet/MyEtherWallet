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
      nextKey: '',
      ownedTokenBasicDetails: []
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
          data.getOwnersERC721Balances.forEach(tkn => {
            console.error('name', name);
            const token = {
              contractAddresses: [tkn.tokenInfo.contract],
              contractIdAddress: tkn.tokenInfo.contract,
              // contracts: [tkn.tokenInfo.contract],
              name: this._getName(tkn.tokenInfo.contract),
              owned_asset_count: BigNumber(tkn.balance).toFixed(0),
              retrievedTo: 0,
              tokens: []
            };
            console.error('tkn', token, this._getName(tkn.tokenInfo.contract));
          });
        }
      },
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    },
    /**
     * Apollo query to owners ERC721 tokens
     */
    getOwnersERC721Tokens: {
      query: getOwnersERC721Tokens,
      variables() {
        return {
          owner: this.address,
          contract: this.contract,
          nextKey: this.nextKey
        };
      },
      skip() {
        return !this.address || this.address === null || !this.isEthNetwork;
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
    _getContractDetails(contract) {
      return fetch(
        `https://nft.mewapi.io/nft?contractHash=${contract}`
      ).then(res => res.json());
    },
    async _getName(contract) {
      const details = await this._getContractDetails(contract);
      if (details.tokenContracts) {
        return details.tokenContracts[0].name || 'Unknown Nft';
      }
      console.error('details', details);
      return details.name;
    }
  }
};
