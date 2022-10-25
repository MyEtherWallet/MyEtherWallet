<template>
  <!--
    =====================================================================================
      Module Nft Manager
    =====================================================================================
    -->
  <div>
    <mew-module
      class="text-center d-flex justify-end flex-grow-1 pt-6 mr-3"
      :has-elevation="true"
      :has-indicator="true"
      title="NFT Manager"
    >
      <template #moduleBody>
        <!--
    =====================================================================================
      Loading
    =====================================================================================
    -->
        <v-skeleton-loader
          v-if="loadingContracts && !hasNoTokens"
          type="table-heading,list-item-avatar-three-line, list-item-avatar-three-line, list-item-avatar-three-line"
        />
        <!--
    =====================================================================================
    Display if no nfts owned
    =====================================================================================
    -->
        <v-card
          v-if="
            (!loadingContracts &&
              contracts.length === 0 &&
              tabs.length === 0) ||
            hasNoTokens
          "
          flat
          color="selectorBg lighten-1"
          class="d-flex align-center px-5 py-4"
          min-height="94px"
        >
          <v-card-text class="text-center"
            >{{ $t('nftManager.none-owned') }}
          </v-card-text>
        </v-card>
        <!--
    =====================================================================================
      Display owned nft tokens
    =====================================================================================
    -->
        <mew-tabs
          v-if="
            !loadingContracts && !onNftSend && tabs.length > 0 && !hasNoTokens
          "
          :items="tabs"
          :is-vertical="$vuetify.breakpoint.mdAndUp"
          :has-underline="$vuetify.breakpoint.smAndDown"
          :active-tab="activeTab"
          @onTab="onTab"
        >
          <template
            v-for="(contract, idx) in contracts"
            :slot="'tabItemContent' + (idx + 1)"
          >
            <div :key="idx" class="ml-5">
              <!--
    =====================================================================================
      Display all owned tokens by nft
    =====================================================================================
    -->
              <div class="d-flex justify-space-between mt-3 mb-5">
                <h5 class="font-weight-bold">
                  {{ selectedContract.name }}
                </h5>
                <div>Total: {{ selectedContract.count }}</div>
              </div>
              <div v-if="displayedTokens && displayedTokens.length === 0">
                Loading ...
              </div>
              <div v-if="displayedTokens && displayedTokens.length !== 0">
                <div
                  v-for="(token, tokenIdx) in displayedTokens"
                  :key="tokenIdx"
                  class="mb-3"
                >
                  <!--
    =====================================================================================
      Nft Token Card Details
    =====================================================================================
    -->
                  <nft-manager-details
                    :loading="loadingTokens"
                    :on-click="openNftSend"
                    :get-image-url="getImageUrl"
                    :token="token"
                  />
                </div>
                <!--
    =====================================================================================
      Displays pagination if there are more than > 9 tokens
    =====================================================================================
    -->
                <div
                  v-if="hasPages"
                  class="px-4 mt-3 d-flex align-center justify-end"
                >
                  <v-pagination
                    v-model="currentPage"
                    class="nft-pagination"
                    color="expandHeader"
                    :length="totalPages"
                    prev-icon="mdi-menu-left"
                    next-icon="mdi-menu-right"
                    @input="setPage"
                  />
                </div>
              </div>
            </div>
          </template>
        </mew-tabs>
        <!--
    =====================================================================================
      Display send token page
    =====================================================================================
    -->
        <nft-manager-send
          v-if="onNftSend"
          :close="closeNftSend"
          :get-image-url="getImageUrl"
          :nft="selectedNft"
          :nft-category="selectedContract.name"
          :send="sendTx"
          :disabled="!isValid"
          :enough-funds="enoughFunds"
          :show-balance-error="showBalanceError"
          :set-address="setAddress"
          @hasMinEth="hasMinEth"
        />
      </template>
    </mew-module>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { toBN, isAddress } from 'web3-utils';
import {
  Toast,
  SUCCESS,
  WARNING,
  ERROR
} from '@/modules/toast/handler/handlerToast';
import getService from '@/core/helpers/getService';

import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { ETH } from '@/utils/networks/types';
import { toBNSafe } from '@/core/helpers/numberFormatHelper';

import NFT from './handlers/handlerNftManager';

const MIN_GAS_LIMIT = 21000;

export default {
  components: {
    NftManagerDetails: () => import('./components/NftManagerDetails'),
    NftManagerSend: () => import('./components/NftManagerSend')
  },
  data() {
    return {
      nft: {},
      activeTab: 0,
      onNftSend: false,
      hasNoTokens: false,
      selectedNft: {},
      toAddress: '',
      selectedContract: {},
      gasFees: '0',
      enoughFunds: false,
      showBalanceError: false,
      localGasPrice: '0',
      loadingContracts: true,
      loadingTokens: true,
      nftApiResponse: []
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'web3', 'address']),
    ...mapState('global', ['network', 'gasPriceType']),
    ...mapGetters('wallet', ['balanceInETH', 'balanceInWei']),
    ...mapGetters('global', [
      'isEthNetwork',
      'network',
      'gasPrice',
      'gasPriceByType'
    ]),
    /**
     * Get Tabs
     */
    tabs() {
      return this.contracts.map(item => {
        return { name: `${item.name} (${item.count})` };
      });
    },
    tokens() {
      if (this.nftApiResponse.length > 0) {
        const contract = this.nftApiResponse.find(item => {
          return (
            item.contract_address.toLowerCase() ===
            this.selectedContract.contract
          );
        });
        if (contract) {
          return contract.assets.map(item => {
            const getImage =
              item.urls.length > 0
                ? item.urls.find(obj => {
                    if (obj.type === 'IMAGE') return obj;
                  })
                : '';

            const url = getImage ? getImage.url : '';
            return {
              image: `https://img.mewapi.io/?image=${url}`,
              name: item.name,
              token_id: item.token_id,
              contract: contract.contract_address
            };
          });
        }
      }
      return [];
    },
    contracts() {
      if (this.nftApiResponse.length > 0) {
        return this.nftApiResponse.map(item => {
          return {
            contract: item.contract_address,
            count: item.assets.length,
            name: item.contract_name
          };
        });
      }
      return [];
    },
    /**
     * Pagination
     */
    totalPages() {
      return this.nft.totalPages(this.selectedContract.count);
    },
    hasPages() {
      return this.nft.hasPages(this.selectedContract.count);
    },
    startIndex() {
      return this.nft.startIndex();
    },
    endIndex() {
      return this.nft.endIndex(this.selectedContract.count);
    },
    currentPage: {
      get() {
        return this.nft.currentPage;
      },
      set(value) {
        return value;
      }
    },
    /**
     * Display tokens according to page
     */
    displayedTokens() {
      return this.tokens.slice(this.startIndex, this.endIndex);
    },
    /**
     * Check if address is valid
     */
    isValid() {
      return this.nft.isValidAddress(this.toAddress) && this.enoughFunds;
    }
  },
  watch: {
    balanceInWei() {
      this.hasMinEth();
    },
    web3() {
      this.loadingContracts = true;
      this.loadingTokens = true;
      this.onNftSend = false;
      this.$router.push({ name: ROUTES_WALLET.NFT_MANAGER.NAME });
      if (this.network.type.name === ETH.name) {
        this.setUpNFT();
      } else {
        Toast(
          `NFT Manager not supported in network: ${this.network.type.name}`,
          {},
          WARNING
        );
        this.nftApiResponse = [];
      }
    },
    address() {
      this.loadingContracts = true;
      this.loadingTokens = true;
      this.onNftSend = false;
      this.$router.push({ name: ROUTES_WALLET.NFT_MANAGER.NAME });
      this.setUpNFT();
    },
    contracts(newVal) {
      if (newVal.length > 0) {
        this.onTab(0);
      }
    },
    async toAddress(newVal) {
      if (isAddress(newVal)) {
        const gasTypeFee = this.gasPriceByType(this.gasPriceType);
        const gasFees = await this.nft.getGasFees(newVal, this.selectedNft);
        const gasFeesToBN = toBNSafe(gasFees).mul(toBNSafe(gasTypeFee));
        this.gasFees = gasFeesToBN.toString();
        if (gasFeesToBN.gte(toBN(this.balanceInWei))) {
          //gasFeesToBN vs current balance
          this.enoughFunds = false;
          this.showBalanceError = true;
        } else {
          this.enoughFunds = true;
          this.showBalanceError = false;
        }
      }
    }
  },
  mounted() {
    this.setUpNFT();
  },
  methods: {
    setUpNFT() {
      /**
       * Init NFT Handler
       */
      this.nft = new NFT({
        network: this.network,
        address: this.address,
        web3: this.web3
      });

      this.getNfts();
      this.localGasPrice = this.gasPriceByType(this.gasPriceType);
      this.hasMinEth();
    },
    getNfts() {
      this.nft.getNfts().then(res => {
        this.nftApiResponse = res;
        this.loadingContracts = false;
        setTimeout(() => {
          this.loadingTokens = false;
        }, 500);
      });
    },
    hasMinEth() {
      const currentGasPrice = this.localGasPrice;
      if (
        toBN(this.balanceInWei).gt(toBN(currentGasPrice).muln(MIN_GAS_LIMIT))
      ) {
        this.enoughFunds = true;
        this.showBalanceError = false;
      } else {
        this.enoughFunds = false;
        this.showBalanceError = true;
      }
    },
    getImageUrl(token) {
      return this.nft.getImageUrl(token.contract, token.token_id);
    },
    onTab(val) {
      this.activeTab = val;
      this.selectedContract = this.contracts[val];
      this.selectedContractHash = this.contracts[val].contract;
      this.nft.goToFirstPage();
    },
    /**
     * Send NFT
     */
    openNftSend(selectedNft) {
      if (selectedNft) {
        this.selectedNft = selectedNft;
      }
      this.onNftSend = true;
      this.$router.push({ name: ROUTES_WALLET.NFT_MANAGER_SEND.NAME });
    },
    closeNftSend() {
      this.onNftSend = false;
      this.toAddress = '';
      this.$router.push({ name: ROUTES_WALLET.NFT_MANAGER.NAME });
    },
    async sendTx() {
      if (this.isValid) {
        try {
          this.nft
            .send(this.toAddress, this.selectedNft)
            .then(response => {
              this.updateValues();
              this.enoughFunds = true;
              this.closeNftSend();
              Toast(
                'Cheers! Your transaction was mined. Check it in ',
                {
                  title: `${getService(this.network.type.blockExplorerTX)}`,
                  url: this.network.type.blockExplorerTX.replace(
                    '[[txHash]]',
                    response.blockHash
                  )
                },
                SUCCESS,
                5000
              );
            })
            .catch(e => {
              Toast(e.message, {}, ERROR);
            });
        } catch (e) {
          Toast(e.message, {}, WARNING);
        }
      }
    },
    updateValues() {
      const idx = this.tokens.findIndex(
        item => item.token_id === this.selectedNft.token_id
      );
      this.tokens.splice(idx, 1);
      if (this.tokens.length === 0 && this.contracts.length === 1) {
        this.hasNoTokens = true;
      }
      this.getNfts();
    },
    setAddress(address) {
      if (typeof address === 'object' && !!address) {
        this.toAddress = address.address;
      } else {
        this.toAddress = address;
      }
    },
    /**
     * Pagination
     */
    setPage(number) {
      this.nft.setCurrentPage(number);
    }
  }
};
</script>
<style lang="scss">
.nft-pagination {
  .v-pagination__navigation,
  .v-pagination__item {
    box-shadow: none;
  }
}
</style>
