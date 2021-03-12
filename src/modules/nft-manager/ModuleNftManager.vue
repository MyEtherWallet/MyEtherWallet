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
        <v-progress-circular v-if="!initLoaded" indeterminate color="primary" />
        <!--
    =====================================================================================
      Display owned nft tokens
    =====================================================================================
    -->
        <mew-tabs
          v-if="initLoaded"
          :items="tabs"
          :has-underline="$vuetify.breakpoint.smAndDown"
          :is-vertical="$vuetify.breakpoint.mdAndUp"
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
              <div v-if="!onNftSend">
                <div class="d-flex justify-space-between mt-3 mb-5">
                  <h5 class="font-weight-bold">
                    {{ nft.getActiveName() }}
                  </h5>
                  <div>Showing {{ startIndex }} to {{ endIndex }}</div>
                </div>
                <div v-if="tokens.length === 0">Loading ...</div>
                <div v-if="tokens.length !== 0">
                  <div
                    v-for="(token, tokenIdx) in tokens"
                    :key="tokenIdx"
                    class="mb-3"
                  >
                    <!--
    =====================================================================================
      Nft Token Card Details
    =====================================================================================
    -->
                    <nft-manager-details
                      :on-click="goToSend"
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
                    class="px-4 mt-3 d-flex align-center justify-space-between"
                  >
                    <mew-button
                      :has-full-width="false"
                      btn-style="outline"
                      title="Prior"
                      btn-size="small"
                      :disabled="!hasPriorPage && !contentLoading"
                      @click.native="priorPage"
                    />
                    <mew-button
                      :has-full-width="false"
                      btn-style="outline"
                      title="Next"
                      btn-size="small"
                      :disabled="!hasNextPage && !contentLoading"
                      @click.native="nextPage"
                    />
                  </div>
                </div>
              </div>
              <!--
    =====================================================================================
      Display send token page
    =====================================================================================
    -->
              <nft-manager-send
                v-if="onNftSend"
                :close="toggleNftSend"
                :get-image-url="getImageUrl"
                :nft="selectedNft"
                :send="sendTx"
                :disabled="!isValid"
                :set-address="setAddress"
              />
            </div>
          </template>
        </mew-tabs>
      </template>
    </mew-module>
  </div>
</template>

<script>
import NFT from './handlers/handlerNftManager';
import { mapGetters, mapState } from 'vuex';
import { Toast, SUCCESS, WARNING } from '@/modules/toast/handler/handlerToast';
import getService from '@/core/helpers/getService';
import NftManagerDetails from './components/NftManagerDetails';
import NftManagerSend from './components/NftManagerSend';

export default {
  components: {
    NftManagerDetails,
    NftManagerSend
  },
  data() {
    return {
      nft: {},
      initLoaded: false,
      tabs: [],
      contracts: [],
      tabActive: 1,
      tokens: [],
      onNftSend: false,
      selectedNft: {},
      toAddress: '',
      selectedCurrency: {},
      currentPage: 1,
      countPerPage: 9,
      contentLoading: false
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'web3', 'address']),
    ...mapState('global', ['network', 'online']),
    ...mapState('external', ['ETHUSDValue']),
    ...mapGetters('global', ['network', 'gasPrice']),
    /**
     * Pagination
     */
    hasPages() {
      if (this.initLoaded) {
        return this.nft.hasPages();
      }
      return false;
    },
    hasNextPage() {
      if (this.initLoaded) {
        return this.nft.hasNextPage();
      }
      return false;
    },
    hasPriorPage() {
      if (this.initLoaded) {
        return this.nft.hasPriorPage();
      }
      return false;
    },
    startIndex() {
      return 1 + (this.currentPage * this.countPerPage - this.countPerPage);
    },
    endIndex() {
      const endIdx = this.currentPage * this.countPerPage;
      if (this.tokens.length < this.countPerPage) {
        return (
          this.currentPage * this.countPerPage -
          (this.countPerPage - this.tokens.length)
        );
      }
      return this.tokens.length < endIdx ? endIdx : this.tokens.length;
    },
    /**
     * Check values
     */
    isValid() {
      return this.isValidAddress() && this.address !== '';
    }
  },
  mounted() {
    /**
     * Init NFT Handler
     */
    this.nft = new NFT({
      network: this.network,
      address: this.address,
      web3: this.web3,
      apollo: this.$apollo
    });
    this.nft.init().then(() => {
      this.initLoaded = true;
      this.contracts = this.nft.getAvailableContracts();
      this.tabs = this.contracts.map(item => {
        return { name: `${item.name} (${item.count})` };
      });
      this.onTab(0);
    });
  },
  methods: {
    toggleNftSend() {
      this.onNftSend = !this.onNftSend;
    },
    goToSend(selectedNft) {
      if (selectedNft) {
        this.selectedNft = selectedNft;
      }
      this.toggleNftSend();
    },
    sendTx() {
      if (this.isValid) {
        try {
          this.nft
            .send(this.toAddress, this.selectedNft.token_id)
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
            });
          this.updateValues();
          this.toggleNftSend();
          this.selectedNft = {};
        } catch (e) {
          Toast(e.message, {}, WARNING);
        }
      }
    },
    updateValues() {
      this.tokens = this.nft.selectNftsToShow();
      this.tabs = this.tabs.map(item => {
        if (
          item.name
            .toLowerCase()
            .includes(this.nft.getActiveName().toLowerCase())
        ) {
          return {
            name: `${this.nft.getActiveName()} (${this.nft.getTokenCount()})`
          };
        }
        return item;
      });
    },
    isValidAddress() {
      if (this.nft.ready) {
        return this.nft.isValidAddress(this.toAddress);
      }
      return false;
    },
    setAddress(address) {
      if (typeof address === 'object' && !!address) {
        this.toAddress = address.address;
      } else {
        this.toAddress = address;
      }
    },
    nextPage() {
      try {
        if (this.contentLoading) return;
        this.contentLoading = true;
        this.nft
          .nextPage()
          .then(() => {
            this.tokens = this.nft.selectNftsToShow();
            this.currentPage = this.nft.getCurrentPage();
            this.countPerPage = this.nft.getCountPerPage();
            this.contentLoading = false;
          })
          .catch(() => {
            this.contentLoading = false;
          });
      } catch (e) {
        this.contentLoading = false;
      }
    },
    priorPage() {
      this.nft.priorPage();
      this.tokens = this.nft.selectNftsToShow();
      this.currentPage = this.nft.getCurrentPage();
      this.countPerPage = this.nft.getCountPerPage();
    },
    getImageUrl(token) {
      if (this.initLoaded) {
        return this.nft.getImageUrl(token.token_id, token.contract);
      }
    },
    onTab(val) {
      this.tabActive = val;
      if (this.contracts.length === 0) {
        this.contracts = this.nft.getAvailableContracts();
      }
      this.contentLoading = true;
      this.tokens = [];
      this.nft
        .setActiveContract(this.nft.getAvailableContracts()[val].contract)
        .then(() => {
          this.nft.getPageValues().then(result => {
            if (result.tokens && Array.isArray(result.tokens)) {
              this.tokens = this.nft.selectNftsToShow();
              this.currentPage = this.nft.getCurrentPage();
              this.countPerPage = this.nft.getCountPerPage();
              this.contentLoading = false;
              this.$nextTick();
            }
          });
        })
        .catch(e => {
          Toast(e.message, {}, WARNING);
        });
    }
  }
};
</script>

<style lang="scss">
/**
* TODO: add to mew components
*/
.v-tab {
  font-size: 14px !important;
  padding-right: 0 !important;
}
</style>
