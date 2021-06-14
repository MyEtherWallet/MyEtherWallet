/**
 * Module Nft Apollo Mixin
 */
import {
  getOwnersERC721Balances,
  getOwnersERC721Tokens
} from '@/apollo/queries/tokens721/tokens721.graphql';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import BigNumber from 'bignumber.js';

export default {
  name: 'HandlerNft',
  data() {
    return {
      getOwnersERC721Balances: '',
      getOwnersERC721Tokens: '',
      isLoadingNames: true,
      contractNames: [],
      selectedContractHash: ''
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
      update: data => data.getOwnersERC721Balances,
      skip() {
        return !this.address || this.address === null || !this.isEthNetwork;
      },
      async result({ data }) {
        if (data && data.getOwnersERC721Balances) {
          this._getAllNames();
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
      fetchPolicy: 'cache-and-network',
      variables() {
        return {
          owner: this.address,
          contract: this.selectedContractHash,
          nextKey: this.getOwnersERC721Tokens.nextKey
        };
      },
      update: data => data.getOwnersERC721Tokens,
      skip() {
        return (
          !this.address ||
          this.address === null ||
          !this.isEthNetwork ||
          this.selectedContractHash === ''
        );
      },
      result({ data }) {
        if (data) {
          this.tokens = data.getOwnersERC721Tokens.tokens.map(item => {
            return {
              description: item.tokenInfo.name,
              token_id: BigNumber(item.token).toFixed(0),
              name: this._getTokenIdName(BigNumber(item.token).toFixed(0)),
              contract: item.tokenInfo.contract
            };
          });
        }
      },
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    }
  },
  computed: {
    loadingTokens() {
      return this.$apollo.queries.getOwnersERC721Tokens.loading;
    },
    loadingContracts() {
      return (
        this.isLoadingNames ||
        this.$apollo.queries.getOwnersERC721Balances.loading
      );
    },
    contracts() {
      if (!this.loadingContracts) {
        return this.contractNames.map((name, idx) => {
          return {
            contract: this.getOwnersERC721Balances[idx].tokenInfo.contract,
            name: name,
            count: BigNumber(this.getOwnersERC721Balances[idx].balance).toFixed(
              0
            )
          };
        });
      }
      return [];
    }
  },
  methods: {
    _getTokenIdName(tokenId) {
      if (tokenId.length > 30) {
        return `${tokenId.slice(0, 6)}...${tokenId.slice(-6)}`;
      }
      return tokenId;
    },
    async _getAllNames() {
      const promiseNames = [];
      this.getOwnersERC721Balances.forEach(token => {
        try {
          promiseNames.push(this._getName(token.tokenInfo.contract));
        } catch (error) {
          Toast(error.message, {}, ERROR);
        }
      });
      this.contractNames = await Promise.all(promiseNames);
      this.isLoadingNames = false;
    },
    async _getName(contract) {
      return await fetch(`https://nft.mewapi.io/nft?contractHash=${contract}`)
        .then(res => res.json())
        .then(json => {
          return json.tokenContracts
            ? json.tokenContracts[0].name || 'Unknown Nft'
            : json.name;
        });
    }
  }
};
