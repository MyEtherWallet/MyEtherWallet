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
                <div>Total: {{ selectedContract.total }}</div>
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
import { ETH, BSC, MATIC } from '@/utils/networks/types';
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
        let tabName = `${item.name} (${item.count})`;
        if (tabName.length > 25) {
          tabName = item.name.substring(0, 20);
          tabName += `... (${item.count})`;
        }
        return { name: tabName };
      });
    },
    tokens() {
      if (this.nftApiResponse.length > 0) {
        const contract = this.nftApiResponse.filter(item => {
          return (
            item.contract_address.toLowerCase() ===
            this.selectedContract.contract.toLowerCase()
          );
        });
        if (contract) {
          return contract.map(item => {
            const url = item.image_url ? item.image_url : '';
            return {
              image: `https://img.mewapi.io/?image=${url}`,
              name: item.name || item.token_id,
              token_id: item.token_id,
              contract: item.contract_address,
              erc721: item.contract.type === 'ERC721'
            };
          });
        }
      }
      return [];
    },
    contracts() {
      if (this.nftApiResponse.length > 0) {
        // Organize contracts by address
        return this.nftApiResponse.reduce((arr, item) => {
          const nftAmount = item.queried_wallet_balances[0].quantity;
          const inList = arr.find(i => i.contract === item.contract_address);
          if (inList) {
            inList.count++;
            inList.total += nftAmount;
          } else {
            arr.push({
              contract: item.contract_address,
              count: 1,
              total: nftAmount,
              name: item.contract.name || item.collection.name
            });
          }
          return arr;
        }, []);
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
    },
    /**
     * Check if network is supported
     */
    supportedNetwork() {
      return this.supportedNetworks.includes(this.network.type.name);
    },
    /**
     * List of supported networks
     */
    supportedNetworks() {
      return [ETH.name, MATIC.name, BSC.name];
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
      if (this.address)
        this.$router.push({ name: ROUTES_WALLET.NFT_MANAGER.NAME });
      if (this.supportedNetwork) {
        this.setUpNFT();
      } else {
        setTimeout(() => {
          Toast(
            `NFT Manager not supported in network: ${this.network.type.name}`,
            {},
            WARNING
          );
          this.nftApiResponse = [];
        }, 1000);
      }
    },
    address() {
      this.loadingContracts = true;
      this.loadingTokens = true;
      this.onNftSend = false;
      if (this.address)
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
        this.localGasPrice = gasTypeFee;
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
      if (!this.supportedNetwork) return;
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
          let gasPrice = undefined;
          if (this.network.type.name === 'MATIC')
            gasPrice = `0x${toBN(this.localGasPrice).toString('hex')}`;
          this.nft
            .send(this.toAddress, this.selectedNft, gasPrice)
            .then(response => {
              this.updateValues();
              this.enoughFunds = true;
              this.toAddress = '';
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
