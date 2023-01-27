<template>
  <!--
    =====================================================================================
      Module Nft Manager
    =====================================================================================
    -->
  <div>
    <mew6-white-sheet
      class="mew-component--nft pa-8 px-md-8 py-md-10 mx-auto"
      :style="!isMobile ? 'max-width: 692px' : ''"
    >
      <div :class="!isMobile ? 'd-flex' : ''">
        <mew-tabs
          :class="!isMobile ? 'mr-auto' : ''"
          style="margin-left: -3.5rem"
          active-color="greenPrimary"
          :items="tabNames"
          :active-tab="activeTab"
          is-small
          @onTab="setTab"
        >
        </mew-tabs>
        <v-text-field
          :class="!isMobile ? 'ml-auto mt-1' : 'mt-4'"
          :style="!isMobile ? 'max-width: 219px' : ''"
          class="search-bar"
          placeholder="Search collection..."
          height="40"
          dense
          rounded
          filled
          light
        >
          <template #prepend-inner
            ><v-icon color="#9BA1AE" style="margin-left: -10px"
              >mdi-magnify</v-icon
            ></template
          >
        </v-text-field>
      </div>
      <div v-if="activeTab === 0">
        <no-nft-owned
          v-if="
            (!loadingContracts &&
              contracts.length === 0 &&
              tabs.length === 0) ||
            hasNoTokens
          "
        />
      </div>
      <!--
      =====================================================================================
        Domain Names Tab
      =====================================================================================
      -->
      <div v-else-if="activeTab === 1">
        <no-domains-owned v-if="domains.length === 0" />
        <div v-for="(domain, idx) in domains" :key="idx">
          <div class="d-flex mt-8" style="align-items: center">
            <img
              :src="getIcon(domain.name)"
              :alt="domain.name.split(' ')[0]"
              height="32px"
              width="32px"
              class="rounded-circle"
            />
            <span class="mew-heading-2 ml-3" style="letter-spacing: 0.3px">{{
              domain.name
            }}</span>
          </div>
          <!--
          =====================================================================================
            Display all owned domains by collection
          =====================================================================================
          -->
          <div class="mb-3 mt-4 d-flex flex-wrap" style="gap: 8px">
            <div
              v-for="(token, tokenIdx) in getTokensByCollection(
                domain.contract
              )"
              :key="tokenIdx"
            >
              <img
                :src="token.image"
                :alt="token.name"
                style="border-radius: 12px"
                width="150px"
                height="150px"
                class="cursor-pointer"
                @click="openTokenDetails(token)"
              />
            </div>
          </div>
        </div>
      </div>
    </mew6-white-sheet>

    <!--
    =====================================================================================
      Nft Token Card Details
    =====================================================================================
    -->
    <app-simple-dialog
      v-if="openDetails"
      :value="openDetails"
      no-title
      max-width="648px"
      @close="openDetails = false"
    >
      <div class="d-flex">
        <img
          :src="selectedNft.image"
          :alt="selectedNft.name"
          width="184px"
          height="184px"
          class="mr-7"
          style="border-radius: 12px"
        />
        <div class="full-width">
          <div class="d-flex full-width height-min-content">
            <div>
              <div class="mew-heading-2 height-min-content">
                {{ selectedNftName }}
              </div>
              <div class="muted-label height-min-content mt-7">Floor Price</div>
              <div class="mew-heading-4 font-weight-medium">
                {{ selectedNft.floor_price.fiat_value }}
              </div>
            </div>
            <div class="d-flex full-width">
              <div class="ml-auto">
                <div class="d-flex">
                  <v-btn
                    class="ml-auto"
                    color="textDark"
                    icon
                    @click="openDetails = false"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
                <div class="mt-9">
                  <a
                    :href="selectedNft.marketplace.nft_url"
                    target="_blank"
                    class="d-flex text-center justify-center textDark--text font-weight-medium"
                    style="gap: 8px"
                  >
                    <img
                      :src="raribleIcon"
                      alt="Rarible"
                      width="20px"
                      height="20px"
                    />
                    View on OpenSea
                    <v-icon size="18px" color="black">mdi-launch</v-icon>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <!-- NFT Description -->
          <div class="mt-4" style="letter-spacing: 0.36px">
            {{ selectedNft.description }}
          </div>
        </div>
      </div>
      <!-- Favorite / Share / Send Buttons -->

      <!-- Floating Left / Right Buttons -->
      <div class="floating-button" style="left: 20%">
        <v-icon>mdi-chevron-left</v-icon>
      </div>
      <div class="floating-button" style="right: 20%">
        <v-icon>mdi-chevron-right</v-icon>
      </div>
    </app-simple-dialog>

    <!--
    =====================================================================================
      Old Module Nft Manager
    =====================================================================================
    -->
    <mew-module
      v-if="false"
      class="text-center d-flex justify-end flex-grow-1 pt-6 mr-3"
      :has-elevation="true"
      :has-indicator="false"
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
        <no-nft-owned
          v-if="
            (!loadingContracts &&
              contracts.length === 0 &&
              tabs.length === 0) ||
            hasNoTokens
          "
        />
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
          :active-tab="nftTab"
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
import { formatFiatValue, toBNSafe } from '@/core/helpers/numberFormatHelper';

import NFT from './handlers/handlerNftManager';
import { BigNumber } from 'bignumber.js';

const MIN_GAS_LIMIT = 21000;
const UNS = 'Unstoppable Domains';
const ENS = 'Ethereum Name Service';

export default {
  components: {
    NftManagerDetails: () => import('./components/NftManagerDetails'),
    NftManagerSend: () => import('./components/NftManagerSend'),
    NoNftOwned: () => import('./components/NoNftOwned.vue'),
    NoDomainsOwned: () => import('./components/NoDomainsOwned.vue'),
    AppSimpleDialog: () => import('@/core/components/AppSimpleDialog.vue')
  },
  data() {
    return {
      nft: {},
      nftTab: 0,
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
      nftApiResponse: [],
      nftCollections: [],
      activeTab: 0,
      openDetails: false
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'web3', 'address']),
    ...mapState('global', ['network', 'gasPriceType']),
    ...mapGetters('wallet', ['balanceInETH', 'balanceInWei']),
    ...mapGetters('external', ['networkTokenUSDMarket']),
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
    tabNames() {
      return [
        {
          name: 'All NFTs'
        },
        {
          name: 'My Domains'
        }
      ];
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
    /**
     * Get all NFTs organized by contract
     */
    contracts() {
      console.log('nftApiResponse', this.nftApiResponse);
      if (this.nftApiResponse && this.nftApiResponse.length > 0) {
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
     * Get all domains from UNS/ENS
     */
    domains() {
      console.log('contracts', this.contracts);
      const domains = this.contracts.filter(item => {
        const collectionName = item.name.toLowerCase();
        if (
          collectionName === UNS.toLowerCase() ||
          collectionName.includes(ENS.toLowerCase())
        )
          return item;
      });
      return domains;
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
    },
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    selectedNftName() {
      const nameStart = this.selectedNft.name.substring(0, 17);
      return this.selectedNft.name.length > 20
        ? `${nameStart}...`
        : this.selectedNft.name;
    },
    raribleIcon() {
      return require('@/assets/images/icons/icon-rarible.svg');
    }
    // raribleLink() {
    //   // Doesnt work for all NFTs
    //   return `https://rarible.com/token/${this.selectedNft.contract}:${this.selectedNft.token_id}?tab=overview`;
    // }
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

      // this.getNfts();
      this.getCollections();
      this.localGasPrice = this.gasPriceByType(this.gasPriceType);
      this.hasMinEth();
    },
    // getNfts() {
    //   this.nft.getNfts().then(res => {
    //     this.nftApiResponse = res;
    //     this.loadingContracts = false;
    //     setTimeout(() => {
    //       this.loadingTokens = false;
    //     }, 500);
    //   });
    // },
    getCollections() {
      this.nft.getCollections().then(res => {
        this.nftCollections = res;
        console.log('getCollections', res);
        // Get the NFTs (up to 50) of the first 5 collections
        let count = 0;
        this.nftCollections.slice(0, 5).map(item => {
          this.nft.getNFTsInCollection(item.id, true).then(res => {
            this.nftApiResponse = this.nftApiResponse.concat(res);
            if (count >= 4) {
              this.loadingContracts = false;
              setTimeout(() => {
                this.loadingTokens = false;
              }, 500);
            }
            count++;
          });
        });
      });
    },
    // getNftsInCollection(contract_address, firstPageOnly = false) {
    //   this.nft
    //     .getNFTsInCollection(contract_address, firstPageOnly)
    //     .then(res => {
    //       this.nftApiResponse = res;
    //       this.loadingContracts = false;
    //       setTimeout(() => {
    //         this.loadingTokens = false;
    //       }, 500);
    //     });
    // },
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
      this.nftTab = val;
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
      this.getCollections();
      // this.getNfts();
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
    },
    /**
     * Set All NFTs/Domains tab
     * @param {Number} val Tab number
     */
    setTab(val) {
      this.activeTab = val;
    },
    getIcon(iconName) {
      const name = iconName.toLowerCase();
      if (name === UNS.toLowerCase())
        return require('@/assets/images/icons/icon-unstoppable-domains.png');
      if (name.includes(ENS.toLowerCase()))
        return require('@/assets/images/icons/icon-ens-domains.png');
      return '';
    },
    getTokensByCollection(contractAddress) {
      if (this.nftApiResponse.length > 0) {
        const contract = this.nftApiResponse.filter(item => {
          return (
            item.contract_address.toLowerCase() ===
            contractAddress.toLowerCase()
          );
        });
        if (contract) {
          console.log('contract', contract);
          return contract.map(item => {
            const url =
              item.image_url ||
              `${item.extra_metadata?.metadata_original_url}image` ||
              '';
            const floorPriceObj = item.collection.floor_prices[0];
            const marketPlace = item.collection.marketplace_pages[0];
            const mainTokenPrice = this.networkTokenUSDMarket.value;
            const tokenFiatValue = formatFiatValue(
              new BigNumber(mainTokenPrice)
                .multipliedBy(floorPriceObj.value)
                .toFixed()
            ).value;
            return {
              image: `https://img.mewapi.io/?image=${url}`,
              name: item.name || item.token_id,
              description: item.description || item.collection.description,
              token_id: item.token_id,
              contract: item.contract_address,
              erc721: item.contract.type === 'ERC721',
              floor_price: {
                token: floorPriceObj.payment_token.symbol,
                value: floorPriceObj.value,
                marketplace_name: floorPriceObj.marketplace_name,
                fiat_value: tokenFiatValue
              },
              marketplace: {
                nft_url: marketPlace.nft_url,
                marketplace_name: marketPlace.marketplace_name,
                collection_url: marketPlace.collection_url
              }
            };
          });
        }
      }
      return [];
    },
    openTokenDetails(token) {
      console.log('token', token);
      this.selectedNft = token;
      this.openDetails = true;
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

.mew-component--nft {
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.04);
  border-radius: 12px;
}

.search-bar input {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.3px;
  color: #9ba1ae;
}
</style>

<style lang="scss" scoped>
.height-min-content {
  height: min-content;
}

.muted-label {
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #7b818e;
}

.floating-button {
  padding: 12px;
  gap: 10px;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 0.4px 3px rgba(0, 0, 0, 0.08), 0px 5px 16px rgba(0, 0, 0, 0.1);
  border-radius: 100px;
  position: absolute;
  top: 50%;
  cursor: pointer;
}
.floating-button:hover {
  background: rgba(255, 255, 255, 1);
}
</style>
