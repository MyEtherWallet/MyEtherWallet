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
          :set-address="setAddress"
        />
      </template>
    </mew-module>
  </div>
</template>

<script>
import NFT from './handlers/handlerNftManager';
import { mapGetters, mapState } from 'vuex';
import {
  Toast,
  SUCCESS,
  WARNING,
  ERROR
} from '@/modules/toast/handler/handlerToast';
import getService from '@/core/helpers/getService';
import NftManagerDetails from './components/NftManagerDetails';
import NftManagerSend from './components/NftManagerSend';
import handlerNft from './handlers/handlerNft.mixin';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';

export default {
  components: {
    NftManagerDetails,
    NftManagerSend
  },
  mixins: [handlerNft],
  data() {
    return {
      nft: {},
      activeTab: 0,
      tokens: [],
      onNftSend: false,
      hasNoTokens: false,
      selectedNft: {},
      toAddress: '',
      selectedContract: {}
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'web3', 'address']),
    ...mapState('global', ['network', 'online']),
    ...mapGetters('global', ['isEthNetwork', 'network', 'gasPrice']),
    /**
     * Get Tabs
     */
    tabs() {
      return this.contracts.map(item => {
        return { name: `${item.name} (${item.count})` };
      });
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
      return this.nft.isValidAddress(this.toAddress);
    }
  },
  watch: {
    contracts(newVal) {
      if (newVal.length > 0) {
        this.onTab(0);
      }
    }
  },
  mounted() {
    /**
     * Init NFT Handler
     */
    this.nft = new NFT({
      network: this.network,
      address: this.address,
      web3: this.web3
    });
  },
  methods: {
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
      this.$router.push({ name: ROUTES_WALLET.NFT_MANAGER.NAME });
    },
    sendTx() {
      if (this.isValid) {
        try {
          this.nft
            .send(this.toAddress, this.selectedNft)
            .then(response => {
              this.updateValues();
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
          this.closeNftSend();
          this.selectedNft = {};
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
      this.$apollo.queries.getOwnersERC721Balances.refetch();
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
