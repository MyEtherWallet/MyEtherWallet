<template>
  <div class="crypto-kitties-manager">
    <interface-container-title :title="$t('nftManager.title')" />
    <div v-if="!isReady && isOnlineAndEth">
      <loading-sign :loadingmessage1="$t('common.loading')" />
    </div>

    <div v-if="isReady && hasNfts" class="content-container">
      <nft-side-menu
        :supported-nft-obj="nftConfig"
        :nft-config="nftConfig"
        :initial-highlighted="selectedContract"
        :loading-complete="countsRetrieved"
        :sent-update="sentUpdate"
        :nft-card-url="nftUrl"
        @selected="changeSelectedContract"
        @openCustomModal="openCustomModal"
        @removeCustomNft="openRemovalConfirmModal"
      ></nft-side-menu>

      <div class="block-divider" />

      <div v-if="showDetails">
        <nft-details
          :nft="detailsFor"
          :selected-title="nftTitle"
          :get-image="getImage"
          @nftTransferred="removeSentNft"
          @resetNFT="resetNFT"
          @back="comeBack"
        ></nft-details>
      </div>

      <div v-if="!showDetails">
        <content-block-title :button-text="ntfCount" :title="nftTitle" />

        <b-row>
          <b-col
            v-for="nft in nftToShow"
            :key="nft.key"
            cols="6"
            lg="4"
            md="4"
            class="mb-4"
          >
            <div
              class="text-center cursor-pointer"
              @click="showNftDetails(nft)"
            >
              <div
                v-if="!hasImage(nft)"
                class="spinner-box d-flex justify-content-center align-items-center"
              >
                <b-spinner
                  label="Large Spinner"
                  variant="secondary"
                  style="width: 50px; height: 50px;"
                ></b-spinner>
              </div>
              <div v-show="hasImage(nft)" class="product-img">
                <img :src="getImage(nft)" alt @load="hasLoaded(nft)" />
              </div>
              <p class="text-monospace">#{{ nft.name | ConcatToken }}</p>
            </div>
          </b-col>
        </b-row>

        <div
          class="pagination-container"
          :class="collectionLoading ? 'loading' : ''"
        >
          <nav
            v-show="selectedNft.tokens.length > 9"
            aria-label="Page navigation example"
          >
            <ul class="pagination justify-content-center">
              <li
                v-show="startIndex > 0"
                class="page-item"
                @click="getPrevious()"
              >
                <div class="page-link prev-button">Previous</div>
              </li>
              <li class="page-item">
                <div
                  v-if="startIndex + 1 != endIndex"
                  class="page-link page-index-button"
                >
                  {{
                    $t('nftManager.showing-range', {
                      first: startIndex + 1,
                      last: endIndex,
                      count: endIndex - startIndex
                    })
                  }}
                </div>
                <div
                  v-if="startIndex + 1 == endIndex"
                  class="page-link page-index-button"
                >
                  {{
                    $t('nftManager.showing', {
                      first: startIndex + 1,
                      count: endIndex - startIndex
                    })
                  }}
                </div>
              </li>
              <li v-show="showNextButton" class="page-item" @click="getNext()">
                <div class="page-link next-button">Next</div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <div v-if="isReady && !hasNfts" class="inner-side-menu content-container">
      <div v-show="!reLoading">
        <h3 class="no-nft-notice">{{ $t('nftManager.no-nft') }}</h3>
        <standard-button
          :options="{
            title: $t('nftManager.add-custom'),
            buttonStyle: 'green',
            helpCenter: false,
            noMinWidth: true,
            fullWidth: false
          }"
          :click-function="openCustomModal"
        />
      </div>
      <span v-show="reLoading">{{ $t('nftManager.reloading') }}</span>
    </div>

    <div v-if="!isOnlineAndEth">
      <div v-show="!online">{{ $t('nftManager.nft-are') }}</div>
      <div v-show="online" class="not-supported-txt">
        {{ $t('nftManager.not-supported', { value: network.type.name_long }) }}
      </div>
    </div>
    <div class="flex--row--align-start mft-manager-content-container"></div>
    <nft-custom-add-modal
      ref="customModal"
      :add-token="addCustom"
      :active-address="activeAddress"
    ></nft-custom-add-modal>
    <nft-custom-confirm-remove-modal
      ref="customRemoveModal"
      :for-removal="forRemoval"
      @remove="removeCustomNft"
    ></nft-custom-confirm-remove-modal>
  </div>
</template>

<script>
import store from 'store';
import LoadingSign from '@/components/LoadingSign';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import ContentBlockTitle from '@/layouts/InterfaceLayout/components/ContentBlockTitle';
import NFTSideMenu from '@/layouts/InterfaceLayout/containers/NFTManagerContainer/components/NFTSideMenu';
import NftDetails from './components/NftDetails';
import NftCustomAddModal from './components/NftCustomAddModal';
import NftCustomConfirmRemove from './components/NftCustomConfirmRemove';
import { mapState } from 'vuex';
import { nftABI } from './abis';
import StandardButton from '@/components/Buttons/StandardButton';
import placeholderImage from '@/assets/images/icons/defaultToken.png';
import utils from 'web3-utils';

export default {
  components: {
    'nft-custom-add-modal': NftCustomAddModal,
    'nft-custom-confirm-remove-modal': NftCustomConfirmRemove,
    'loading-sign': LoadingSign,
    'content-block-title': ContentBlockTitle,
    'nft-side-menu': NFTSideMenu,
    'interface-container-title': InterfaceContainerTitle,
    'nft-details': NftDetails,
    'standard-button': StandardButton
  },
  filters: {
    ConcatToken(value) {
      if (!value) return '';
      if (value.length > 20)
        return `${value.substr(0, 15)}...${value.substr(value.length - 6)}`;
      return value;
    }
  },
  data() {
    return {
      nftABI,
      nftUrl: 'https://nft2.mewapi.io/',
      countPerPage: 9,
      currentPage: 1,
      nftConfig: {},
      countsRetrieved: false,
      showDetails: false,
      reLoading: false,
      selectedContract: '',
      detailsFor: {},
      nftTokens: {},
      ownedTokens: [],
      sentUpdate: 0,
      customNFTs: [],
      forRemoval: {},
      collectionLoading: false,
      nftObjectClone: {}
    };
  },
  computed: {
    ...mapState('main', ['account', 'online', 'network']),
    nftTitle() {
      if (this.nftConfig[this.selectedContract]) {
        if (
          this.nftConfig[this.selectedContract].symbol === 'UNKNOWN' &&
          !this.nftConfig[this.selectedContract].custom
        ) {
          return `${this.$t('nftManager.unknown-token-title', {
            address: this.nftConfig[this.selectedContract].name
          })}`;
        }
        return this.nftConfig[this.selectedContract].name;
      }
      return `${this.$t('common.loading')}`;
    },
    startIndex() {
      return this.currentPage * this.countPerPage - this.countPerPage;
    },
    endIndex() {
      if (this.nftConfig[this.selectedContract]) {
        if(this.nftConfig[this.selectedContract].tokens){
          if (this.nftConfig[this.selectedContract].tokens.length) {
            if (
              this.nftConfig[this.selectedContract].tokens.length <
              this.currentPage * this.countPerPage
            ) {
              return this.nftConfig[this.selectedContract].tokens.length;
            }
            return this.currentPage * this.countPerPage;
          }
        }
      }
      return this.currentPage * this.countPerPage;
    },
    nftToShow() {
      if (this.nftConfig[this.selectedContract]) {
        if (!this.nftConfig[this.selectedContract].tokens) return [];
        return this.nftConfig[this.selectedContract].tokens.length >
          this.countPerPage
          ? this.nftConfig[this.selectedContract].tokens.slice(
              this.startIndex,
              this.endIndex
            )
          : this.nftConfig[this.selectedContract].tokens;
      }
      return [];
    },
    ntfCount() {
      if (
        this.nftConfig[this.selectedContract] &&
        this.nftConfig[this.selectedContract].tokens
      ) {
        return this.$t('nftManager.per-page-count', {
          perPage: this.countPerPage,
          count: this.nftConfig[this.selectedContract].tokens.length
        });
      }

      return this.$t('nftManager.none-owned');
    },
    selectedNft() {
      if (this.selectedContract) {
        return this.nftConfig[this.selectedContract];
      }
      return { tokens: [] };
    },
    showNextButton() {
      if (this.nftConfig[this.selectedContract]) {
        if(!this.nftConfig[this.selectedContract].tokens) return false;
        const ids_retrieved = this.nftConfig[this.selectedContract].tokens
          .length;
        return (
          this.endIndex !== ids_retrieved && this.endIndex <= ids_retrieved
        );
      }
      return null;
    },
    activeAddress() {
      return this.account.address;
    },
    hasNfts() {
      return Object.values(this.nftConfig).length > 0;
    },
    isReady() {
      return this.isOnlineAndEth && this.countsRetrieved;
    },
    isOnlineAndEth() {
      return this.online && this.network.type.name === 'ETH';
    }
  },
  watch: {},
  async mounted() {
    await this.setup();
  },
  //======================================================================
  methods: {
    addCustom(address, symbol) {
      this.reLoading = true;
      this.customNFTs.push({
        ERC721Extension: true,
        contract: address,
        customNft: true,
        title: symbol
      });
      this.$refs.customModal.$refs.modal.hide();
      store.set('customNFTs', this.customNFTs);
      this.sentUpdate += 1;
      this.setup();
    },
    removeCustomNft(item) {
      this.reLoading = true;
      const customNFTs = store.get('customNFTs');
      if (customNFTs !== undefined && customNFTs !== null) {
        const entryIndex = customNFTs.findIndex(
          entry => item.contract === entry.contract
        );
        customNFTs.splice(entryIndex, 1);
        store.set('customNFTs', customNFTs);
        this.setup();
        this.sentUpdate += 1;
      }
    },
    openRemovalConfirmModal(item) {
      this.forRemoval = item;
      this.$refs.customRemoveModal.$refs.modal.show();
    },
    openCustomModal() {
      this.$refs.customModal.$refs.modal.show();
    },
    hasLoaded(nft) {
      this.$set(nft, 'loaded', true);
    },
    hasImage(nft) {
      if (nft.customNft || nft.image === '') {
        return true;
      }
      if (nft.loaded) {
        return true;
      }
    },
    getImage(nft) {
      if (nft.customNft || nft.image === '') {
        return placeholderImage;
      }
      return `${this.nftUrl}tokenImage?path=${nft.image}`;
    },
    removeSentNft(nft) {
      this.nftObjectClone = utils._.clone(this.nftConfig[nft.contract]);
      const afterSent = this.nftConfig[nft.contract].tokens.filter(entry => {
        return entry.id !== nft.id;
      });
      this.$set(this.nftConfig[nft.contract], 'tokens', afterSent);
      if(this.nftConfig[nft.contract].tokens){
        if (this.nftConfig[nft.contract].tokens.length === 0)
          this.sentUpdate += 1;
      }
      this.showDetails = false;
    },
    resetNFT(nft) {
      if(Object.keys(this.nftObjectClone).length > 0){
        this.nftConfig[nft.contract] = this.nftObjectClone;
      }
    },
    changeSelectedContract(selectedContract) {
      this.selectedContract = selectedContract;
      this.showDetails = false;
    },
    comeBack() {
      this.showDetails = false;
    },

    async getTokens() {
      const data = await fetch(
        `${this.nftUrl}tokens?owner=${this.activeAddress}&chain=mainnet`,
        {
          mode: 'cors',
          cache: 'no-cache',
          method: 'GET',
          'Cache-Control': 'no-cache'
        }
      );
      return await data.json();
    },

    async setup() {
      if (this.network.type.name === 'ETH') {
        const customNFTs = store.get('customNFTs');

        if (customNFTs !== undefined && customNFTs !== null) {
          this.customNFTs = customNFTs;
        } else {
          this.customNFTs = [{}];
        }
        const configData = await this.getTokens();
        if (!configData.error) {
          const tokenAddresses = Object.keys(configData);
          tokenAddresses.forEach(address => {
            configData[address] = { ...configData[address] };
            const customInformation = this.customNFTs.find(
              item => item.contract === address
            );
            if (configData[address]) {
              configData[address].custom = false;
              if (
                configData[address].symbol === 'UNKNOWN' &&
                customInformation
              ) {
                configData[address].name = customInformation.title;
                configData[address].custom = true;
              } else if (configData[address].symbol === 'UNKNOWN') {
                configData[address].name = address;
              }
              configData[address].contract = address;
              configData[address].tokens = configData[address].tokens.map(
                item => {
                  item.contract = address;
                  return item;
                }
              );
              configData[address].startIndex = 0;
              configData[address].priorIndex = 0;
              configData[address].currentIndex = 0;
            }
          });
          this.nftConfig = { ...configData };
          this.selectedContract = Object.keys(this.nftConfig)[0];
        }
        this.reLoading = false;
        this.countsRetrieved = true;
      }
    },
    getNext() {
      this.currentPage++;
    },
    getPrevious() {
      if (this.currentPage >= 1) {
        this.currentPage--;
      }
    },
    showNftDetails(nft) {
      this.detailsFor = nft;
      this.showDetails = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NFTManagerContainer.scss';
</style>
