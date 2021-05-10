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
// First Fetch Balances -->
// Fetch All Names(on results) -->

// Computed:
// isLoading = {
// return isLoadingNames || fetchBalance
// }

// nftdata = {
// if(!isLoading) {
// return fetchBalanceGraphqlResult

// }
// }

// Methods:
// Fetch All Names = {
// const promiseNames = [];
// fetchBalanceGraphqlResult.forEach (item => {
//         try {
//            promiseNames.push(_ameget(etchBalanceGraphqlResult.contract));
//         } catch (err) {
//            soem error
//         }
// })

//   thicontractsNames = await Promise.all(promiseNames);
// set isLoadingNames = false
// }

export default {
  name: 'HandlerNft',
  data() {
    return {
      getOwnersERC721Balances: '',
      erc721Tokens: {},
      getOwnersERC721Tokens: '',
      contract: '',
      nextKey: '',
      isLoadingNames: true,
      contractNames: []
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
          data.getOwnersERC721Balances.map(tkn => {
            this._getContractInfo(tkn);
          });
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
  computed: {
    isLoading() {
      return (
        this.isLoadingNames ||
        this.$apollo.queries.getOwnersERC721Balances.loading
      );
    }
  },
  methods: {
    async _getContractInfo(tkn) {
      console.error('tkn', tkn);
      return await fetch(
        `https://nft.mewapi.io/nft?contractHash=${tkn.tokenInfo.contract}`
      )
        .then(res => res.json())
        .then(json => {
          const name = json.tokenContracts
            ? json.tokenContracts[0].name || 'Unknown Nft'
            : json.name;

          this.contracts.push({
            count: BigNumber(tkn.balance).toFixed(0),
            name: name || tkn.tokenInfo.name,
            contract: tkn.tokenInfo.contract
          });
          this.selectedContract = this.contracts[0];
          console.error('contracts', this.contracts, this.selectedContract);
        });
    }
  }
};
