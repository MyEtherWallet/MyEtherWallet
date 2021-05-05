/**
 * Module Nft Apollo Mixin
 */
import {
  getOwnersERC721Balances,
  getOwnersERC721Tokens
} from '@/apollo/queries/tokens721/tokens721.graphql';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import BigNumber from 'bignumber.js';
import NftCollection from './handlerNftCollection';

export default {
  name: 'HandlerNft',
  data() {
    return {
      getOwnersERC721Balances: '',
      erc721Tokens: {},
      getOwnersERC721Tokens: '',
      contract: '',
      nextKey: '',
      ownedTokensDetails: []
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
          this.ownedTokensDetails = data.getOwnersERC721Balances.map(tkn => {
            const nftData = {};
            let name;
            this._getName(tkn.tokenInfo.contract).then((resp) => {
              console.error('resp', resp)
              return resp;
            })
            nftData[tkn.tokenInfo.contract] = new NftCollection({
              details: {
                contractAddresses: [tkn.tokenInfo.contract],
                contractIdAddress: tkn.tokenInfo.contract,
                contracts: [tkn.tokenInfo.contract],
                name: name,
                owned_asset_count: BigNumber(tkn.balance).toFixed(0),
                retrievedTo: 0,
                tokens: []
              },
              api: this.api,
              address: this.activeAddress,
              web3: this.web3,
              apollo: this.apollo
            });
            console.error('tkn', this._getName(tkn.tokenInfo.contract));
            return nftData[tkn.tokenInfo.contract].getPanelDetails();
          });
          setTimeout(() => {
            console.error('hello', this.ownedTokensDetails);
          }, 5000)
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
